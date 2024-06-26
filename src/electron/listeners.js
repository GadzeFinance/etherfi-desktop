const fs = require("fs")
const EC = require("elliptic").ec
const BN = require("bn.js")
const path = require("path")
const axios = require("axios")
const electron = require("electron")
const {
    encrypt,
    decrypt,
    encryptPrivateKeys,
    decryptPrivateKeys,
} = require("./utils/encryptionUtils")
const {
    createMnemonic,
    generateKeys,
    validateMnemonic,
    generateDepositData,
} = require("./utils/Eth2Deposit.js")
const { selectFolder, selectJsonFile } = require("./utils/saveFile.js")
const {
    encodeGenerateKeysData,
    addHistoryRecord,
} = require("./utils/historyUtils")
const { decryptResultCodes, desktopAppVersion } = require("./constants")
const logger = require("./utils/logger")
const { storage } = require("./utils/storage")
const isDev = process.env.NODE_ENV === "development"

const ETH1_ADDRESS_WITHDRAWAL_PREFIX = Buffer.from('01', 'hex');
const FORKS = { 'mainnet': Buffer.from('00000000','hex'), 'goerli': Buffer.from('00001020', 'hex')};

const graphqlEndpoint =
    process.env.NODE_ENV === "production"
        ? "https://api.studio.thegraph.com/query/41778/etherfi-mainnet/version/latest"
        : "https://api.studio.thegraph.com/query/41778/etherfi-goerli/version/latest"

const queryEndpoint =
    process.env.NODE_ENV === "production"
        ? "https://etherfi.vercel.app/api/beaconChain/findOneCollated?pubkey="
        : "https://goerli.etherfi.vercel.app/api/beaconChain/findOneCollated?pubkey="

/**
 * Generates public and private key pairs and saves them in two separate JSON files
 * Encrypts the Private Key Json file with the password before saving it to a file
 *
 * @param {Number} numKeys - The number of Keys the user would like to generate
 * @param {String} saveFolder - The path to the folder the keys should be saved too
 *
 * @returns {Array<String>} - 2 element list containing the file paths to the public and private key files
 */
const genNodeOperatorKeystores = async (
    numKeys,
    saveFolder,
    privKeysPassword,
    address,
    dbPassword
) => {
    logger.info("genNodeOperatorKeystores: Start")

    const allWallets = await storage.getAllStakerAddresses(dbPassword)
    if (allWallets == undefined || !(address in allWallets)) {
        await storage.addStakerAddress(address)
    }

    const curve = new EC("secp256k1")

    const publicFileJSON = {}
    const privateKeysJSON = {}

    const privKeyArray = []
    const pubKeyArray = []
    for (var i = 0; i < numKeys; i++) {
        // create new key pair
        const keyPair = curve.genKeyPair()

        // get public key and encode it in hex
        const pubPoint = keyPair.getPublic()
        const pub = pubPoint.encode("hex")
        privKeyArray.push(keyPair.getPrivate().toString())
        pubKeyArray.push(pub)
    }

    // Create publicFileJSON object
    publicFileJSON["pubKeyArray"] = pubKeyArray
    // This is here to ensure we can update the desktop app and not break the webapp in the future.
    publicFileJSON["etherfiDesktopAppVersion"] = desktopAppVersion
    // save publicEtherfiKeystore
    const publicFileTimeStamp = Date.now()
    const publicFileName = "publicEtherfiKeystore-" + publicFileTimeStamp
    const pubKeysFilePath = path.join(saveFolder, `${publicFileName}.json`)

    fs.writeFileSync(
        pubKeysFilePath,
        JSON.stringify(publicFileJSON),
        "utf-8",
        (err) => {
            if (err) {
                logger.error(
                    "Error in 'genNodeOperatorKeystores' writing PublicKeyFile",
                    err
                )
                throw new Error("Error writing private keys file")
            }
        }
    )

    // Create privateKeysJSON object
    privateKeysJSON["pubKeyArray"] = pubKeyArray
    privateKeysJSON["privKeyArray"] = privKeyArray
    // save privateEtherfiKeystore
    const privateFileTimeStamp = Date.now()
    const privateFileName = "privateEtherfiKeystore-" + privateFileTimeStamp
    const privKeysFilePath = path.join(saveFolder, `${privateFileName}.json`)
    const encryptedPrivateKeysJSON = encryptPrivateKeys(
        privateKeysJSON,
        privKeysPassword
    )
    encryptedPrivateKeysJSON["etherfiDesktopAppVersion"] = desktopAppVersion

    fs.writeFileSync(
        privKeysFilePath,
        JSON.stringify(encryptedPrivateKeysJSON),
        "utf-8",
        (err) => {
            if (err) {
                logger.error(
                    "Error in 'genNodeOperatorKeystores' writing PrivateKeyFile",
                    err
                )
                throw new Error("Error writing private keys file")
            }
        }
    )

    // for (const publicKey of pubKeyArray) {
    //         storage.addOperatorKey(address, publicKey, )
    // }

    // 1 Hash the private key file using sha256
    // 2 upon adding a new operator key, if the private key hashed is already in the storage, we relate pulic key to the hash
    // else, we will hash the private key, store a mapping from hash to the actual file (this will only happen once, ever)
    // 3 store public key to private key hash in map

    logger.info("genNodeOperatorKeystores: End")
    return [pubKeysFilePath, privKeysFilePath]
}

/**
 * Generates a new mnemonic using the eth staking CLI
 *
 * @param {string} language - The language to generate the mnemonic in
 * @returns {string} - The 24 word mnemonic
 */
const genMnemonic = async (language) => {
    logger.info("genMnemonic: Start")
    const mnemonic = await createMnemonic(language)
    logger.info("genMnemonic: End")
    return mnemonic
}

/**
 * Generates validator keys and encrypts them using the bidderPublicKeys in given stakeInfo.json file and mnemonic
 * 
 * @typedef {Object.<string, string>} StakeInfo
 *
 * @param {string} mnemonic - The 24 word mnmonic seed phrase
 * @param {string} password - The password to encrypt the validator keystores with
 * @param {StakeInfo[]} stakeInfo - The stakeinfo array
 * 

 * @return {string} - The path to the folder that was created. 
 * 
 * @NOTE -    This folder that is returned contains the validator Keystores & deposit data for each key that was generated. 
 *                    It also contains single stakeRequest.json file which contains the encrypted data.
 *                     The stakeRequest.json file is what the user should upload to the DAPP.
 */
const genValidatorKeysAndEncrypt = async (
    event,
    mnemonic,
    databasePassword,
    stakeInfo,
    address,
    mnemonicOption,
    importPassword,
    stakingCode,
    stakingMode
) => {
    logger.info("genEncryptedKeys: Start")
    const allWallets = await storage.getAllStakerAddresses(databasePassword)
    if (allWallets == undefined || !(address in allWallets)) {
        await storage.addStakerAddress(address)
    }

    let password = await storage.generatePassword()
    if (mnemonicOption == "import") {
        const response = await validateMnemonic(mnemonic)
        if (response.stderr != "") throw new Error(response.stderr)
        password = importPassword
    }

    const stakeInfoLength = stakeInfo.length
    const timeStamp = Date.now()
    const userDataPath = (electron.app || electron.remote.app).getPath(
        "userData"
    )
    const generatedFolder = `etherfi_keys-${timeStamp}`
    const folder = path.join(userDataPath, generatedFolder)
    const nodeOperatorPublicKeys = []
    const validatorIDs = []

    const withdrawalAddr2StakeInfo = {}
    for (const info of stakeInfo) {
        if (!withdrawalAddr2StakeInfo[info.withdrawalSafeAddress]) {
            withdrawalAddr2StakeInfo[info.withdrawalSafeAddress] = []
        }
        withdrawalAddr2StakeInfo[info.withdrawalSafeAddress].push(info)
    }

    for (const [withdrawalSafeAddress, infoArray] of Object.entries(withdrawalAddr2StakeInfo)) {
        const ids = infoArray.map((i) => i.validatorID)
        validatorIDs.push(...ids)
    }
    const isUnique = await storage.checkUniqueValidatorIds(validatorIDs, address)
    if (!isUnique) {
        throw new Error("Validator Ids have been used before")
    }
    let startIndex = 0
    for (const [withdrawalSafeAddress, infoArray] of Object.entries(withdrawalAddr2StakeInfo)) {
        const pubkeys = infoArray.map((i) => i.bidderPublicKey)
        const ids = infoArray.map((i) => i.validatorID)
        const eth1_withdrawal_address = withdrawalSafeAddress
        const networkName = infoArray[0].networkName
        nodeOperatorPublicKeys.push(...pubkeys)
        try {
            const startTime = new Date().getTime()
            await generateKeys(
                mnemonic,
                infoArray.length,
                networkName,
                password,
                eth1_withdrawal_address,
                folder,
                startIndex,
                databasePassword,
                address,
                stakingMode
            )
            const endTime = new Date().getTime()
            const usedTime = (endTime - startTime) / 1000
            // event.sender.send(
            //     "receive-generate-key",
            //     index,
            //     stakeInfoLength,
            //     usedTime
            // )
        } catch (err) {
            logger.error(
                "Error in 'genValidatorKeysAndEncrypt' when generating keys",
                err
            )
            throw new Error("Couldn't generate validator keys")
        }
        startIndex += infoArray.length
    }

    // now we need to encrypt the keys and generate "stakeRequest.json"
    try {
        const stakeRequestJson = await _encryptValidatorKeys(
            folder,
            password,
            nodeOperatorPublicKeys,
            validatorIDs,
            address,
            databasePassword
        )
        event.sender.send("stake-request", stakeRequestJson)
    } catch (err) {
        logger.error(
            "Error in 'genValidatorKeysAndEncrypt' when encrypting keys",
            err
        )
        throw new Error("Error encrypting validator keys")
    }

    // Only add to the db if we dont have mnemonic added already
    const allAccounts = await storage.getMnemonics(address, databasePassword)

    if (
        !Object.values(allAccounts).some((value) =>
            value.mnemonic.includes(mnemonic)
        )
    ) {
        await storage.addMnemonic(address, mnemonic, password, databasePassword)
    }

    // Add to history
    logger.info("start to add history...")
    const fileContent = JSON.stringify(stakeInfo)
    const historyData = encodeGenerateKeysData(
        address,
        "stakeInfo",
        fileContent,
        mnemonic,
        validatorIDs,
        stakingCode,
        databasePassword
    )
    addHistoryRecord(historyData)

    fs.rmdir(folder, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error deleting folder: ${err}`)
        } else {
            console.log("Folder deleted successfully")
        }
    })

    // Send back the folder where everything is save
    logger.info("genEncryptedKeys: End")
    return folder
}

/**
 * Helper function that retrieves deposit data and keystore files from the specified folder.
 *
 * @param {string} folderPath - The path to the folder where the deposit data and keystore files are stored.
 * @returns {{depositDataList: Object[], validatorKeystoreList: Object[]}}
 *     An object containing two arrays: depositDataList, a list of deposit data objects,
 *     and validatorKeystoreList, a list of keystore objects.
 */
const _getDepositDataAndKeystoresJSON = async (folderPath) => {
    const depositDataFilePaths = []
    const validatorKeyFilePaths = []

    fs.readdirSync(folderPath).forEach((fileName) => {
        console.log("fileName:", fileName)
        if (fileName.includes("deposit_data")) {
            depositDataFilePaths.push(path.join(folderPath, fileName))
        } else if (fileName.includes("keystore")) {
            validatorKeyFilePaths.push(path.join(folderPath, fileName))
        } else {
            logger.info(
                `'_getDepositDataAndKeystoresJSON': Unexpected File: ${fileName}`
            )
        }
    })
    // depositDataList will be sorted in chronological order
    const depositDataList = depositDataFilePaths.map((filePath) => {
        console.log(filePath, JSON.parse(fs.readFileSync(filePath)))
        return JSON.parse(fs.readFileSync(filePath))
    }).flat()
    const validatorKeystoreList = validatorKeyFilePaths.map((filePath) => {
        console.log(filePath, JSON.parse(fs.readFileSync(filePath)))
        return {
            keystoreName: path.parse(filePath).base,
            keystoreData: JSON.parse(fs.readFileSync(filePath)),
        }
    })

    if (validatorKeystoreList.length !== depositDataList.length) {
        console.log(
            "Error in '_getDepositDataAndKeystoresJSON' Deposit Data lenth != number of keys",
            `validatorKeystoreList.length: ${validatorKeystoreList.length}`,
            `depositDataList.length: ${depositDataList.length}`
        )
    }

    return { depositDataList, validatorKeystoreList }
}

const generateStakeRequestOnImportKeys = async (
    address,
    keystores,
    stakeInfo,
    keystoreNames,
    password,
    databasePassword
) => {

    const timeStamp = Date.now()
    const userDataPath = (electron.app || electron.remote.app).getPath(
        "userData"
    )
    const generatedFolder = `etherfi_deposit_data-${timeStamp}`
    const folder = path.join(userDataPath, generatedFolder)

    const withdraw_addresses = stakeInfo.map((info) => info.withdrawalSafeAddress)
    const network = stakeInfo[0].networkName // TODO: assume having all the same networks
    const validator_ids = stakeInfo.map((info) => info.validatorID)
    const staking_mode = "bnft"
    const keystore_password = password

    await generateDepositData(
        JSON.stringify(withdraw_addresses),
        folder,
        network,
        JSON.stringify(validator_ids),
        staking_mode,
        JSON.stringify(keystores),
        keystore_password
    )

    const files = fs.readdirSync(folder);

    if (files.length === 0) {
        console.error('No files found in the directory');
        return;
    }
    if (files.length > 1) {
        console.error('More than one file found in the directory');
        return;
    }

    const file = files[0];
    const filePath = path.join(folder, file);
    const contents = fs.readFileSync(filePath, 'utf8');

    const depositDataList = JSON.parse(contents);
    const validatorKeystoreList = keystores.map((keystore, index) => {
      return {
        keystoreName: keystoreNames[index],
        keystoreData: JSON.parse(keystore),
      };
    });
    const nodeOperatorPubKeys = stakeInfo.map((info) => info.bidderPublicKey);
  
    const stakeRequestJSON = _from_deposit_data_and_keystore_to_stake_request_list(
      depositDataList,
      validatorKeystoreList,
      validator_ids,
      password,
      nodeOperatorPubKeys, 
      address,
      databasePassword
    );

    depositDataList.forEach((depositData, i) => {
        const pubkey = depositData.pubkey;
        const matchesFound = validatorKeystoreList.filter((keyStoreObj) => {
            return keyStoreObj.keystoreData.pubkey === pubkey
        })
        const keystore = matchesFound[0].keystoreData;
        storage.addValidators(address, validator_ids[i], JSON.stringify(keystore), password, databasePassword)
    })

    // Add to history
    logger.info("start to add history...")
    const fileContent = JSON.stringify(stakeInfo)
    const historyData = encodeGenerateKeysData(
        address,
        "stakeInfo",
        fileContent,
        "",
        validator_ids,
        ""
    )
    addHistoryRecord(historyData)
  
    fs.rmdirSync(folder, { recursive: true });
    console.log("Folder deleted successfully");

    return stakeRequestJSON

}

/**
 * 
 * Note that we are using the order in stakeInfo array to match depositData and validatorIDs, depositData and keystore file are matched by pubkey
 * 
 * @param {Array} depositDataList - An array of deposit data objects.
 * @param {Array} validatorKeystoreList - An array of keystore objects.
 * @param {Array} validatorIDs - The IDs of the validators. (These are etherfi IDs (set in etherfi smart contracts), NOT VALIDATOR INDEX).
 * @param {string} password - The password for the validator keystore.
 * @param {Array} nodeOperatorPubKeys - An array of node operator public keys.
 *
 * @returns {Array} - Returns an array of stake request objects.
 */
const _from_deposit_data_and_keystore_to_stake_request_list = (
    depositDataList,
    validatorKeystoreList,
    validatorIDs,
    password,
    nodeOperatorPubKeys,
    address,
    databasePassword
) => {
    const curve = new EC("secp256k1")
    const stakeRequestJSON = []

    console.log(JSON.stringify(depositDataList))
    console.log(JSON.stringify(validatorKeystoreList))

    for (var i = 0; i < depositDataList.length; i++) {
        // Step 1: Get the keystore corresponding to the depsoit data element
        const matchesFound = validatorKeystoreList.filter((keyStoreObj) => {
            return keyStoreObj.keystoreData.pubkey === depositDataList[i].pubkey
        })

        if (matchesFound.length !== 1) {
            logger.error(
                "'_encryptValidatorKeys' more than one or zero validator key found for deposit data",
                depositDataList[i],
                matchesFound
            )
            throw new Error(
                "Found multiple validator keys for a single deposit data"
            )
        }
        const validatorKey = JSON.stringify(matchesFound[0].keystoreData)
        const keystoreName = matchesFound[0].keystoreName

        // Step 2: Encrypt validator keys
        // get the nodeOperatorPubKey Point
        const nodeOperatorPubKeyHex = nodeOperatorPubKeys[i]
        const nodeOperatorPubKeyPoint = curve
            .keyFromPublic(nodeOperatorPubKeyHex, "hex")
            .getPublic()

        // Step 3: generate staker keys and derive shared secret
        const stakerKeyPair = curve.genKeyPair()
        const stakerPrivKey = stakerKeyPair.getPrivate()

        const stakerSharedSecret = nodeOperatorPubKeyPoint
            .mul(stakerPrivKey)
            .getX()

        // Step 4: encrypt data and store it in the stakeReqeustJSON arrays
        const stakeRequestItem = {
            validatorID: validatorIDs[i],
            depositData: depositDataList[i],
            encryptedKeystoreName: encrypt(
                keystoreName,
                stakerSharedSecret.toArrayLike(Buffer, "be", 32)
            ),
            encryptedValidatorKey: encrypt(
                validatorKey,
                stakerSharedSecret.toArrayLike(Buffer, "be", 32)
            ),
            encryptedPassword: encrypt(
                password,
                stakerSharedSecret.toArrayLike(Buffer, "be", 32)
            ),
            stakerPublicKey: stakerKeyPair.getPublic().encode("hex"),
            nodeOperatorPublicKey: nodeOperatorPubKeyHex,
            etherfiDesktopAppVersion: desktopAppVersion, // This is here to ensure we can update the desktop app and not break the webapp in the future.
        }

        stakeRequestJSON.push(stakeRequestItem)

        storage.addValidators(
            address,
            validatorIDs[i],
            validatorKey,
            password,
            databasePassword
        )
    }

    return stakeRequestJSON
}



/**
 * Encrypts validator keys and password for each deposit data element in the given folder path.
 *
 * @param {string} folderPath - The path to the folder containing deposit data and validator keystore files.
 * @param {string} password - The password for the validator keystore.
 * @param {Array} nodeOperatorPubKeys - An array of node operator public keys.
 * @param {Array} validatorIDs - The IDs of the validators. (These are etherfi IDs (set in etherfi smart contracts), NOT VALIDATOR INDEX).
 *
 * @returns {undefined} - Returns nothing, saves the encrypted data to a stake request file in the given folder path.
 */
const _encryptValidatorKeys = async (
    folderPath,
    password,
    nodeOperatorPubKeys,
    validatorIDs,
    address,
    databasePassword
) => {
    logger.info("_encryptValidatorKeys: Start")
    // need to convert the folder path to a list of keystore paths and a deposit data file path
    const { depositDataList, validatorKeystoreList } =
        await _getDepositDataAndKeystoresJSON(folderPath)

    const stakeRequestJSON = _from_deposit_data_and_keystore_to_stake_request_list(
        depositDataList,
        validatorKeystoreList,
        validatorIDs,
        password,
        nodeOperatorPubKeys,
        address,
        databasePassword
    )

    // dont need to save a private file for the staker right now
    // const stakePrivateJSON = {}

    const stakeRequestTimeStamp = Date.now()
    const stakeRequestFileName = "stakeRequest-" + stakeRequestTimeStamp
    const filePath = path.join(folderPath, `${stakeRequestFileName}.json`)

    fs.writeFileSync(
        filePath,
        JSON.stringify(stakeRequestJSON),
        "utf-8",
        (err) => {
            if (err) {
                logger.error(
                    "'_encryptValidatorKeys' could not write out stakeRequestJSON",
                    `filePath: ${filePath}`,
                    err
                )
                throw new Error("Could not write out stakeRequestJSON")
            }
        }
    )
    logger.info("_encryptValidatorKeys: End")

    return stakeRequestJSON
}

/**
 * Decrypts Validator Keys using the private keys file.
 * Saves the keystores and password -> keystore map in a folder named 'decrypted_validator_key-<timestamp>'
 *
 * @NOTE PARAMS ARE PASSED IN THROUGH 'arg'
 * @param {string} encryptedValidatorKeysFilePath (arg[0]) - The path to the encrypted validator keys file.
 * @param {string} privateKeysFilePath (arg[1])    - The path to the private keys file.
 * @param {string} privKeysPassword (arg[2])    - The password that decrypts the private keys file.
 * @param {string} chosenFolder (arg[3])    - The path to save the decrypted validator keys too.
 *
 * @returns {saveFolder} - The path to the folder that was created to save the decrypted validator keys and password -> keystore map json.
 */
const decryptValidatorKeys = async (event, arg) => {
    logger.info("decryptValidatorKeys: Start")
    const [
        encryptedValidatorKeysFilePath,
        privateKeysFilePath,
        privKeysPassword,
        chosenFolder,
    ] = arg
    // This will work since the files have already been validated (validateFile.js)
    const encryptedValidatorKeysJson = JSON.parse(
        fs.readFileSync(encryptedValidatorKeysFilePath)
    )
    const encrpytedPrivateKeysJson = JSON.parse(
        fs.readFileSync(privateKeysFilePath)
    )
    var privateKeysJson = null
    try {
        privateKeysJson = decryptPrivateKeys(
            encrpytedPrivateKeysJson,
            privKeysPassword
        )
    } catch (err) {
        logger.error(
            "'decryptValidatorKeys' error decrypting Private Keys with password",
            err
        )
        event.sender.send(
            "receive-decrypt-val-keys-report",
            decryptResultCodes.BAD_PASSWORD,
            "",
            err.message
        )
        return
    }

    const curve = new EC("secp256k1")
    const keystoreToPassword = {
        keystoreArray: [],
        passwordArray: [],
    }

    // create folder to store filess
    const timeStamp = Date.now()
    const saveFolder = path.join(
        chosenFolder,
        `decrypted_validator_keys-${timeStamp}`
    )
    if (!fs.existsSync(saveFolder)) {
        fs.mkdirSync(saveFolder)
    }

    try {
        // For each of the validator keys
        for (var encryptedValKey of encryptedValidatorKeysJson) {
            // Step 1: get the staker public key and convert it to a point
            const stakerPublicKeyHex = encryptedValKey["stakerPublicKey"]
            const receivedStakerPubKeyPoint = curve
                .keyFromPublic(stakerPublicKeyHex, "hex")
                .getPublic()

            // Step 2: get the correct node Operator Private Key and convert it to a Big Number
            const keyIndex = privateKeysJson["pubKeyArray"].indexOf(
                encryptedValKey["nodeOperatorPublicKey"]
            )
            const nodeOperatorPrivKeyString =
                privateKeysJson["privKeyArray"][keyIndex]
            const nodeOperatorPrivKey = new BN(nodeOperatorPrivKeyString)

            // Step 3: Generate shared secret and decrypt the message
            const nodeOperatorSharedSecret = receivedStakerPubKeyPoint
                .mul(nodeOperatorPrivKey)
                .getX()
            const validatorKeyString = decrypt(
                encryptedValKey["encryptedValidatorKey"],
                nodeOperatorSharedSecret.toArrayLike(Buffer, "be", 32)
            )
            const validatorKeyPassword = decrypt(
                encryptedValKey["encryptedPassword"],
                nodeOperatorSharedSecret.toArrayLike(Buffer, "be", 32)
            )
            const keystoreName = decrypt(
                encryptedValKey["encryptedKeystoreName"],
                nodeOperatorSharedSecret.toArrayLike(Buffer, "be", 32)
            )

            // Save keystore file
            const keyStorePath = path.join(saveFolder, keystoreName)
            fs.writeFileSync(
                keyStorePath,
                validatorKeyString,
                "utf-8",
                (err) => {
                    if (err) {
                        logger.info.error(err)
                        event.sender.send(
                            "receive-decrypt-val-keys-report",
                            decryptResultCodes.SAVE_FILE_ERROR,
                            "",
                            err.message
                        )
                        return
                    }
                }
            )
            keystoreToPassword["keystoreArray"].push(keystoreName)
            keystoreToPassword["passwordArray"].push(validatorKeyPassword)
        }
    } catch (err) {
        // Send Error Message to Frontend that the
        logger.error(
            "'decryptValidatorKeys' error decrypting validator keys",
            err
        )
        event.sender.send(
            "receive-decrypt-val-keys-report",
            decryptResultCodes.BAD_PRIVATE_KEYS,
            "",
            err.message
        )
        return
    }

    const keystoreToPasswordFile = path.join(
        saveFolder,
        `keystore_to_password-${timeStamp}.json`
    )
    fs.writeFileSync(
        keystoreToPasswordFile,
        JSON.stringify(keystoreToPassword),
        "utf-8",
        (err) => {
            if (err) {
                event.sender.send(
                    "receive-decrypt-val-keys-report",
                    decryptResultCodes.SAVE_FILE_ERROR,
                    "",
                    err.message
                )
                return
            }
        }
    )

    logger.info("decryptValidatorKeys: End")
    return saveFolder
}

const fetchStoredMnemonics = async (address, password) => {
    const mnemonics = await storage.getMnemonics(address, password)
    return mnemonics
}

const fetchStoredValidators = async (address, password) => {
    let validators = await storage.getValidators(address, password)

    return validators
}

const setPassword = async (password) => {
    return await storage.setPassword(password)
}

const setAllStakerAddresses = async (stakerAddresses, password) => {
    await storage.setAllStakerAddresses(stakerAddresses, password)
}

const getStakerAddress = async (password) => {
    const allStakers = await storage.getAllStakerAddresses(password)

    if (!allStakers || !password) {
        return {}
    }
    
    return allStakers
}

const getValidatorIndices = async (password) => {
    return await storage.getAllValidatorIndices(password)
}

const isPasswordSet = async () => {
    return await storage.isPasswordSet()
}

const validatePassword = async (password) => {
    return await storage.validatePassword(password)
}

const getStakerAddressList = async (dbPassword) => {
    return await storage.getAllStakerAddresses(dbPassword)
}

/**
 * Opens dialog that allows user to select a folder path.
 *
 * @emits "receive-selected-folder-path" event with the selected folder path
 *
 * @returns {undefined} No return value. Emits "receive-selected-folder-path" event with selected folder path
 */
const listenSelectFolder = async (event, arg) => {
    selectFolder()
        .then((result) => {
            const path = result.canceled ? "" : result.filePaths[0]
            event.sender.send("receive-selected-folder-path", path)
        })
        .catch((error) => {
            logger.error("'listenSelectFolder' Error Selecting Folder", error)
            event.sender.send(
                "receive-selected-folder-path",
                "Error Selecting Folder"
            )
        })
}

/**
 * Opens dialog that allows user to select a file.
 *
 * @emits "receive-selected-folder-path" event with the selected folder path
 *
 * @returns {undefined} No return value. Emits "receive-selected-folder-path" event with selected folder path
 */
const listenSelectJsonFile = async (event, arg) => {
    selectJsonFile()
        .then((result) => {
            const path = result.canceled ? "" : result.filePaths[0]
            event.sender.send("receive-selected-file-path", path)
        })
        .catch((error) => {
            logger.error("'listenSelectJsonFile' Error Selecting File", error)
            event.sender.send(
                "receive-selected-file-path",
                "Error Selecting Path"
            )
        })
}

// Test Function too see the whole encryption and decryption flow.
// TODO: outdated. we use aes-gcm now. need to update
const testWholeEncryptDecryptFlow = (event, arg) => {
    const curve = new EC("secp256k1")
    // Step 1: BIDDER -> Node Operator Key Gen Tab
    const nodeOperatorKeyPair = curve.genKeyPair()
    const nodeOperatorPrivKey = nodeOperatorKeyPair.getPrivate()

    const nodeOperatorPubKeyPoint = nodeOperatorKeyPair.getPublic()
    const nodeOperatorPubKeyHex = nodeOperatorPubKeyPoint.encode("hex") // send this out!

    // Step 2: Encrypt validator keys - Staker -> Validator Key Gen Tab
    const stakerKeyPair = curve.genKeyPair()
    const stakerPrivKey = stakerKeyPair.getPrivate()
    const stakerPubKeyPoint = stakerKeyPair.getPublic()
    const stakerPubKeyHex = stakerPubKeyPoint.encode("hex") // send this out!

    const recievedNodeOpPubKeyPoint = curve
        .keyFromPublic(nodeOperatorPubKeyHex, "hex")
        .getPublic()
    const stakerSharedSecret = recievedNodeOpPubKeyPoint
        .mul(stakerPrivKey)
        .getX()

    const valKey = {
        crypto: {
            kdf: {
                function: "scrypt",
                params: {
                    dklen: 32,
                    n: 262144,
                    r: 8,
                    p: 1,
                    salt: "0463d22d68366006c3e61d551255d49cc16339d5445bdaa1a59f5dae30dac3e7",
                },
                message: "",
            },
            checksum: {
                function: "sha256",
                params: {},
                message:
                    "cd87b4b75a340239782919e7d81bf253dd9c7fd7d8956e83436b0e48ea8301dc",
            },
            cipher: {
                function: "aes-128-ctr",
                params: { iv: "9ad66f5a200048b7c1933dc0a39adcc9" },
                message:
                    "c469bf7d17899947ec78c4fe31676f3814a7bf696a85384aff4f0f7b4fbc9945",
            },
        },
        description: "",
        pubkey: "96cadf6d4ff420ffd36c6f3d389564ad8f64a42c3c8e6b9ad7ef119b245248cef57ae4191f4c91163c23d79f4e77c275",
        path: "m/12381/3600/1/0/0",
        uuid: "61504df3-f306-4b65-ab7b-726ffa73bcbe",
        version: 4,
    }
    const validatorKey = JSON.stringify(valKey)
    const encryptedMsg = encrypt(
        validatorKey,
        stakerSharedSecret.toArrayLike(Buffer, "be", 32)
    )

    // Step 3: Decrypt the message - Node Operator -> Decrypt Tab
    const receivedStakerPubKeyPoint = curve
        .keyFromPublic(stakerPubKeyHex, "hex")
        .getPublic()
    const nodeOperatorSharedSecret = receivedStakerPubKeyPoint
        .mul(nodeOperatorPrivKey)
        .getX()
    const decryptedMsg = decrypt(
        encryptedMsg,
        nodeOperatorSharedSecret.toArrayLike(Buffer, "be", 32)
    )
    logger.info(validatorKey)
    logger.info("-----------------------------------")
    logger.info(validatorKey.length)
    logger.info("-----------------------------------")
    logger.info(encryptedMsg)
    logger.info("-----------------------------------")
    logger.info(encryptedMsg.length)
    logger.info("-----------------------------------")
    logger.info(decryptedMsg)
    logger.info("-----------------------------------")
    logger.info(decryptedMsg.length)
    logger.info("-----------------------------------")
}

const storageDecrypt = (ciphertext, password) => {
    return storage.decrypt(ciphertext, password)
}

module.exports = {
    genNodeOperatorKeystores,
    genMnemonic,
    genValidatorKeysAndEncrypt,
    decryptValidatorKeys,
    listenSelectFolder,
    listenSelectJsonFile,
    testWholeEncryptDecryptFlow,
    fetchStoredMnemonics,
    fetchStoredValidators,
    getStakerAddress,
    getStakerAddressList,
    isPasswordSet,
    setPassword,
    validatePassword,
    getValidatorIndices,
    generateStakeRequestOnImportKeys,
    storageDecrypt,
    setAllStakerAddresses
}
