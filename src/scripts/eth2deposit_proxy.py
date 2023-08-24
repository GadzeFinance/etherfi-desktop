"""The eth2deposit_proxy application.

This application is used as a proxy between our electron application and the eth2-deposit-cli
internals. It exposes some eth2-deposit-cli functions as easy to use commands that can be called
on the CLI.
"""

import os
import argparse
import json
import sys
import time
from staking_deposit.key_handling.key_derivation.mnemonic import (
    get_mnemonic,
    reconstruct_mnemonic
)

from typing import Any, Dict
from py_ecc.bls import G2ProofOfPossession as bls
from staking_deposit.exceptions import ValidationError
from staking_deposit.key_handling.keystore import Keystore
from staking_deposit.utils.ssz import SignedVoluntaryExit, VoluntaryExit, compute_signing_root, compute_voluntary_exit_domain
from staking_deposit.utils.intl import (
    closest_match,
    load_text,
)

from eth_utils import is_hex_address, to_normalized_address

from staking_deposit.credentials import (
    CredentialList,
)

from staking_deposit.exceptions import ValidationError
from staking_deposit.utils.validation import (
    verify_deposit_data_json,
)
from staking_deposit.utils.constants import (
    MAX_DEPOSIT_AMOUNT,
)

from staking_deposit.settings import (
    get_chain_setting,
)

def validate_mnemonic(mnemonic: str, word_lists_path: str) -> str:
    """Validate a mnemonic using the eth2-deposit-cli logic and returns the mnemonic.

    Keyword arguments:
    mnemonic -- the mnemonic to validate
    word_lists_path -- path to the word lists directory
    """

    mnemonic = reconstruct_mnemonic(mnemonic, word_lists_path)
    if mnemonic is not None:
        return mnemonic
    else:
        raise ValidationError('That is not a valid mnemonic, please check for typos.')

def create_mnemonic(word_list, language='english'):
    """Returns a new random mnemonic.

    Keyword arguments:
    word_lists -- path to the word lists directory
    language -- the language for the mnemonic words, possible values are 'chinese_simplified',
                'chinese_traditional', 'czech', 'english', 'italian', 'korean', 'portuguese' or
                'spanish' (default 'english')
    """
    return get_mnemonic(language=language, words_path=word_list)

def generate_keys(args):
    """Generate validator keys.

    Keyword arguments:
    args -- contains the CLI arguments pass to the application, it should have those properties:
            - wordlist: path to the word lists directory
            - mnemonic: mnemonic to be used as the seed for generating the keys
            - index: index of the first validator's keys you wish to generate
            - count: number of signing keys you want to generate
            - folder: folder path for the resulting keystore(s) and deposit(s) files
            - network: network setting for the signing domain, possible values are 'mainnet',
                       'prater', 'kintsugi' or 'kiln'
            - password: password that will protect the resulting keystore(s)
            - eth1_withdrawal_address: (Optional) eth1 address that will be used to create the
                                       withdrawal credentials
    """
    
    eth1_withdrawal_address = None
    if args.eth1_withdrawal_address:
        eth1_withdrawal_address = args.eth1_withdrawal_address
        if not is_hex_address(eth1_withdrawal_address):
            raise ValueError("The given Eth1 address is not in hexadecimal encoded form.")

        eth1_withdrawal_address = to_normalized_address(eth1_withdrawal_address)

    mnemonic = validate_mnemonic(args.mnemonic, args.wordlist)
    mnemonic_password = ''
    amounts = [MAX_DEPOSIT_AMOUNT] * args.count
    folder = args.folder
    chain_setting = get_chain_setting(args.network)
    if not os.path.exists(folder):
        os.mkdir(folder)

    credentials = CredentialList.from_mnemonic(
        mnemonic=mnemonic,
        mnemonic_password=mnemonic_password,
        num_keys=args.count,
        amounts=amounts,
        chain_setting=chain_setting,
        start_index=args.index,
        hex_eth1_withdrawal_address=eth1_withdrawal_address,
    )

    keystore_filefolders = credentials.export_keystores(password=args.password, folder=folder)
    # TODO: determine if in the BNFT flow when exporting deposit data
    deposits_file = credentials.export_deposit_data_json(folder=folder)
    if not credentials.verify_keystores(keystore_filefolders=keystore_filefolders, password=args.password):
        raise ValidationError("Failed to verify the keystores.")
    if not verify_deposit_data_json(deposits_file, credentials.credentials):
        raise ValidationError("Failed to verify the deposit data JSON files.")

def parse_create_mnemonic(args):
    """Parse CLI arguments to call the create_mnemonic function.
    """
    mnemonic = None
    if args.language:
        mnemonic = create_mnemonic(args.wordlist, language=args.language)
    else:
        mnemonic = create_mnemonic(args.wordlist)

    print(json.dumps({
        'mnemonic': mnemonic
    }))

def parse_generate_keys(args):
    generate_keys(args)

def parse_validate_mnemonic(args):
    """Parse CLI arguments to call the validate_mnemonic function.
    """
    validate_mnemonic(args.mnemonic, args.wordlist)

    """Generate Exit Message.

    Keyword arguments:
    args -- contains the CLI arguments pass to the application, it should have those properties:
            - chain: The chain for the exit message
            - keystore_path: The path to the Validator Keystore file
            - keystore_password: The password that decrypts the keystore file
            - validator_index: The index of the validator relating to the keystore
            - epoch: the epoch to exit the validator 
    """
def generate_exit_message(args):
    
    saved_keystore = Keystore.from_file(args.keystore_path)
    
    try:
        secret_bytes = saved_keystore.decrypt(args.keystore_password)
    except Exception:
        raise ValidationError(load_text(['arg_generate_exit_transaction_keystore_password', 'mismatch']))
    
    signing_key = int.from_bytes(secret_bytes, 'big')

    message = VoluntaryExit(
        epoch=args.epoch,
        validator_index=args.validator_index
    )

    chain_settings = get_chain_setting(args.chain)
    domain = compute_voluntary_exit_domain(
        fork_version=chain_settings.CURRENT_FORK_VERSION,
        genesis_validators_root=chain_settings.GENESIS_VALIDATORS_ROOT
    )

    signing_root = compute_signing_root(message, domain)
    signature = bls.Sign(signing_key, signing_root)

    signed_exit = SignedVoluntaryExit(
        message=message,
        signature=signature,
    )

    # Safe exit message to folder
    folder = args.save_folder
    filefolder = os.path.join(folder, 'signedExitMessage-%i.json' % time.time())

    signed_exit_json: Dict[str, Any] = {}
    message = {
        'epoch': str(signed_exit.message.epoch),
        'validator_index': str(signed_exit.message.validator_index),
    }
    signed_exit_json.update({'message': message})
    signed_exit_json.update({'signature': '0x' + signed_exit.signature.hex()})

    with open(filefolder, 'w') as f:
        json.dump(signed_exit_json, f)
    if os.name == 'posix':
        os.chmod(filefolder, int('440', 8))  # Read for owner & group
    
    # Print exit message to stdout to be retrieved from NodeJS code
    print(json.dumps({
        'filefolder': filefolder
    }))

def main():
    """The application starting point.
    """
    main_parser = argparse.ArgumentParser()

    subparsers = main_parser.add_subparsers(title="subcommands")
    
    create_parser = subparsers.add_parser("create_mnemonic")
    create_parser.add_argument("wordlist", help="Path to word list directory", type=str)
    create_parser.add_argument("--language", help="Language", type=str)
    create_parser.set_defaults(func=parse_create_mnemonic)

    generate_parser = subparsers.add_parser("generate_keys")
    generate_parser.add_argument("wordlist", help="Path to word list directory", type=str)
    generate_parser.add_argument("mnemonic", help="Mnemonic", type=str)
    generate_parser.add_argument("index", help="Validator start index", type=int)
    generate_parser.add_argument("count", help="Validator count", type=int)
    generate_parser.add_argument("folder", help="Where to put the deposit data and keystore files", type=str)
    generate_parser.add_argument("network", help="For which network to create these keys for", type=str)
    generate_parser.add_argument("password", help="Password for the keystore files", type=str)
    generate_parser.add_argument("--eth1_withdrawal_address", help="Optional eth1 withdrawal address", type=str)
    generate_parser.set_defaults(func=parse_generate_keys)

    validate_parser = subparsers.add_parser("validate_mnemonic")
    validate_parser.add_argument("wordlist", help="Path to word list directory", type=str)
    validate_parser.add_argument("mnemonic", help="Mnemonic", type=str)
    validate_parser.set_defaults(func=parse_validate_mnemonic)
    
    generate_exit_message_parser = subparsers.add_parser("generate_exit_transaction")
    generate_exit_message_parser.add_argument("chain", help="chain", type=str)
    generate_exit_message_parser.add_argument("keystore_path", help="Path to Keystore", type=str)
    generate_exit_message_parser.add_argument("keystore_password", help="Keystore password", type=str)
    generate_exit_message_parser.add_argument("validator_index", help="Index of the validator", type=int)
    generate_exit_message_parser.add_argument("epoch", help="Epoch to Exit at", type=int)
    generate_exit_message_parser.add_argument("save_folder", help="Path to save exit message to", type=str)
    generate_exit_message_parser.set_defaults(func=generate_exit_message)

    args = main_parser.parse_args()
    if not args or 'func' not in args:
        main_parser.parse_args(['-h'])
    else:
        try:
            args.func(args)
        except (ValidationError, ValueError) as exc:
            print(str(exc), file=sys.stderr)
            sys.exit(1)

if __name__ == "__main__":
    main()