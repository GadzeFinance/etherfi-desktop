const {encrypt, decrypt } = require('./utils/encryptionUtils');
const {createMnemonic, generateKeys, validateMnemonic} = require('./utils/Eth2Deposit.js')
const {saveFile, selectFolder} = require('./utils/saveFile.js')
const EC = require('elliptic').ec
const fs = require('fs');
const path = require('path');
const { isAddress } = require('ethers/lib/utils');
const {getDepositedStakesForAddressQuery} = require('./TheGraph/queries');
const { assert } = require('console');


/* This function generates etherfi keys the node operator needs to register in order to place a bid
* @param numKeys: the number of keys to generate
* @param walletAddress: the wallet address requesting the key generation
* @ return: This function saves two files with the prefixes:
* "publicEtherfiKeystore-" and "privateEtherfiKeystore-"
* The 'public' file contains the public keys to be registered
*
*/
const genNodeOperatorKeystores = async (event, arg) => {
    const curve = new EC('secp256k1')
    const [numKeys, walletAddress] = arg

    const publicFileJSON = {}
    const privateFileJSON = {}

    const privKeyArray = []
    const pubKeyArray = []
    for(var i = 0; i < numKeys; i++) {
        // create new key pair for each bid
        const keyPair = curve.genKeyPair()

        // get public key and encode it in hex
        const pubPoint = keyPair.getPublic()
        const pub = pubPoint.encode('hex');
        privKeyArray.push(keyPair.getPrivate().toString()) // do this in a more secure way? 
        pubKeyArray.push(pub)
    }

    // Create publicFileJSON object
    publicFileJSON["walletAddress"] = walletAddress
    publicFileJSON["pubKeyArray"] = pubKeyArray

    // Create privateFileJSON object
    privateFileJSON["pubKeyArray"] = pubKeyArray
    privateFileJSON["privKeyArray"] = privKeyArray


    // save publicEtherfiKeystore
    const publicFileTimeStamp = new Date().toISOString().slice(0,-5)
    const publicFileName = "publicEtherfiKeystore-" + publicFileTimeStamp
    var saveOptions = {
        title: "Save publicEtherfiEncryptionKeys",
        defaultPath : publicFileName,
        buttonLabel: "Save",

    }
    await saveFile(publicFileJSON, saveOptions)

    // save privateEtherfiKeystore
    const privateFileTimeStamp = new Date().toISOString().slice(0,-5)
    const privateFileName = "privateEtherfiKeystore-" + privateFileTimeStamp
    saveOptions = {
            title: "Save privateEtherfiKeystore file",
            defaultPath : privateFileName,
            buttonLabel: "Save",
    
    }
    await saveFile(privateFileJSON, saveOptions)

    // TODO: show on the front end 
    // Send response to the front end? Maybe this should be the file names/locations?
    event.sender.send("receive-public-bid-file", publicFileJSON)
}

/* This function generates a new Mnemonic which can be used to generate deposit data and keystores
* @param language: the language to generate the mnemonic in
* @ return: This function emits the "receive-new-mnemonic" with the mnemonic as data.
*/
const genMnemonic = async (event, arg) => {
    console.log("genMnemonic: Start")
    const language = arg[0]
    const mnemonic = await createMnemonic(language)
    event.sender.send("receive-new-mnemonic", [mnemonic])
    console.log("genMnemonic: End")
}

/* This function generates deposit data and keystores
*  It then encrypts the keystores and creates a bunled "stakeRequest.json" file
* @param walletAddress: the wallet address (staker address) who needs to generate keys
* @param mnemonic: the mnemonic that was preiously generated
* @param keystore: the password the user entered to create the keystore with
* @param folder: the user selected folder to save all the files too
*/
const genValidatorKeysAndEncrypt = async (event, arg) => {
    console.log("genEncryptedKeys: Start")
    var [walletAddress, mnemonic, password, folder] = arg
    folder += "/etherfi_keys"

    const {data} = await getDepositedStakesForAddressQuery(walletAddress);
    // TODO: CHECK FOR ERRORS in a nicer way
    if(data.stakes.length < 1) {
        console.log("ERROR: number of stakes for this wallet address in deposit state:" +  count)
    }
    const count = data.stakes.length
    const nodeOperatorPublicKeys = data.stakes.map((stake) => stake.winningBid.bidderPublicKey)
    console.log(nodeOperatorPublicKeys)
    return 


    const index = 1
    const network = 'goerli' // TODO: change to 'mainnet'
    const eth1_withdrawal_address = walletAddress// TODO: update this

    await generateKeys(mnemonic, index, count, network, password, eth1_withdrawal_address, folder)
    event.sender.send("receive-key-gen-confirmation", [])

    // now we need to encrypt the keys and generate "stakeRequest.json"
    await _encryptValidatorKeys(folder, password, nodeOperatorPublicKeys)


    console.log("genEncryptedKeys: End")
}

/* Helper method that gets the deposit data and keystores from the files that were generated */
const _getDepositDataAndKeystoresJSON = (folderPath) => {
    const depositDataFilePaths = []
    const validatorKeyFilePaths =  []
        
    fs.readdir(folderPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (fileName) {
            if (fileName.includes("deposit_data")) {
                depositDataFilePaths.push(`${folderPath}/${fileName}`)
            } else if (fileName.includes("keystore")) {
                validatorKeyFilePaths.push(`${folderPath}/${fileName}`)
            } else {
                console.log(`Unexpected File: ${fileName}`)
            }
        });
    });

    if (depositDataFilePaths.length !== 1) {
        console.error("ERROR: Multiple deposit data files")
    }
    const depositDataList = JSON.parse(fs.readFileSync(depositDataFilePaths[0]))

    const validatorKeystoreList = validatorKeyFilePaths.map(
            filePath => JSON.parse(fs.readFileSync(filePath))
    )

    if (validatorKeystoreList.length !== depositDataList.length) {
        console.error("ERROR: Deposit Data lenth != number of keys")
    }

    return {depositDataList, validatorKeystoreList}
}


const _encryptValidatorKeys = async (folderPath, password, nodeOperatorPubKeys) => {
    // need to convert the folder path to a list of keystore paths and a deposit data file path
    const {depositDataList, validatorKeystoreList} = _getDepositDataAndKeystoresJSON(folderPath);

    const curve = new EC('secp256k1')

    const stakeRequestJSON = []
    for (var depositData of depositDataList) {
        // Step 1: Get the keystore corresponding to the depsoit data element
        const matchesFound = validatorKeystoreList.filter(validatorKey => {
            return validatorKey.pubkey === depositData.pubkey
        })

        if (matchesFound.length !== 1) { 
            console.error("ERROR: more than one validator key found for deposit data")
            console.log(depositData)
            console.log(matchesFound)
            return
        }
        const validatorKey = JSON.stringify(matchesFound[0])
        // create new keyPair

        // Step 2: Encrypt validator keys 
        // get the nodeOperatorPubKey Point
        const nodeOperatorPubKeyHex = nodeOperatorPubKeys.pop()
        const nodeOperatorPubKeyPoint = curve.keyFromPublic(nodeOperatorPubKeyHex, 'hex').getPublic();

        const stakerKeyPair = curve.genKeyPair()
        const stakerPrivKey = stakerKeyPair.getPrivate()

        const stakerSharedSecret = nodeOperatorPubKeyPoint.mul(stakerPrivKey).getX()
        const encryptedValidatorKey = encrypt(validatorKey, stakerSharedSecret.toArrayLike(Buffer, 'be', 32))
        const encryptedPassword = encrypt(password, stakerSharedSecret.toArrayLike(Buffer, 'be', 32))
        const stakerPubKeyHex = stakerKeyPair.getPublic().encode('hex')

        const data = {
            depositData: depositData, 
            encryptedValidatorKey: encryptedValidatorKey,
            encryptedPassword:encryptedPassword,
            stakerPublicKey: stakerPubKeyHex, 
            nodeOperatorPublicKey: nodeOperatorPubKeyHex
        }

        stakeRequestJSON.push(data)
    }

    // dont need to save a private file for the staker right now
    // const stakePrivateJSON = {}

    const stakeRequestTimeStamp = new Date().toISOString().slice(0,-5)
    const stakeRequestFileName = "stakeRequest-" + stakeRequestTimeStamp
    saveOptions = {
            title: "Save nodeOperatorKeys file",
            defaultPath : folderPath + '/' + stakeRequestFileName,
            buttonLabel: "Save Stake Request",
    }
    await saveFile(stakeRequestJSON, saveOptions)
}

// Opens dialog that allows user to select a folder path.
// Emits "receive-selected-folder-path" event with the path selected
const listenSelectFolder = async (event, arg) => {
    selectFolder().then((result) => {
        const path = result.canceled ? '' : result.filePaths[0];
        event.sender.send("receive-selected-folder-path", path)
    }).catch((error) => {
        console.log("ERROR Selecting Files")
        console.log(error)
        event.sender.send("receive-selected-folder-path", 'Error Selecting Path')
    })
}


// Test Function
const testWholeEncryptDecryptFlow = (event, arg) => {

    const curve = new EC('secp256k1')
    // Step 1: BID
    const nodeOperatorKeyPair = curve.genKeyPair()
    const nodeOperatorPrivKey = nodeOperatorKeyPair.getPrivate()
    
    const nodeOperatorPubKeyPoint = nodeOperatorKeyPair.getPublic()
    const nodeOperatorPubKeyHex = nodeOperatorPubKeyPoint.encode('hex') // send this out!

    // Step 2: Encrypt validator keys 
    const stakerKeyPair = curve.genKeyPair()
    const stakerPrivKey = stakerKeyPair.getPrivate()
    const stakerPubKeyPoint = stakerKeyPair.getPublic()
    const stakerPubKeyHex = stakerPubKeyPoint.encode('hex') // send this out!

    const recievedNodeOpPubKeyPoint = curve.keyFromPublic(nodeOperatorPubKeyHex, 'hex').getPublic()
    const stakerSharedSecret = recievedNodeOpPubKeyPoint.mul(stakerPrivKey).getX()
    const valKey = {"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "0463d22d68366006c3e61d551255d49cc16339d5445bdaa1a59f5dae30dac3e7"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "cd87b4b75a340239782919e7d81bf253dd9c7fd7d8956e83436b0e48ea8301dc"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "9ad66f5a200048b7c1933dc0a39adcc9"}, "message": "c469bf7d17899947ec78c4fe31676f3814a7bf696a85384aff4f0f7b4fbc9945"}}, "description": "", "pubkey": "96cadf6d4ff420ffd36c6f3d389564ad8f64a42c3c8e6b9ad7ef119b245248cef57ae4191f4c91163c23d79f4e77c275", "path": "m/12381/3600/1/0/0", "uuid": "61504df3-f306-4b65-ab7b-726ffa73bcbe", "version": 4}
    const validatorKey = JSON.stringify(valKey);
    const encryptedMsg = encrypt(validatorKey, stakerSharedSecret.toArrayLike(Buffer, 'be', 32))


    // Step 3: Decrypt the message
    const receivedStakerPubKeyPoint = curve.keyFromPublic(stakerPubKeyHex, 'hex').getPublic()
    const nodeOperatorSharedSecret = receivedStakerPubKeyPoint.mul(nodeOperatorPrivKey).getX()
    const decryptedMsg = decrypt(encryptedMsg, nodeOperatorSharedSecret.toArrayLike(Buffer, 'be', 32))
    console.log(validatorKey)
    console.log("-----------------------------------")
    console.log(validatorKey.length)
    console.log("-----------------------------------")
    console.log(encryptedMsg)
    console.log("-----------------------------------")
    console.log(encryptedMsg.length)
    console.log("-----------------------------------")
    console.log(decryptedMsg)
    console.log("-----------------------------------")
    console.log(decryptedMsg.length)
    console.log("-----------------------------------")

}


module.exports = {
    genNodeOperatorKeystores,
    genMnemonic,
    genValidatorKeysAndEncrypt,
    listenSelectFolder, 
    testWholeEncryptDecryptFlow
}
