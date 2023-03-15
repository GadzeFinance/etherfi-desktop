const {encrypt, decrypt } = require('./utils/encryptionUtils');
const {createMnemonic, generateKeys, validateMnemonic} = require('./utils/Eth2Deposit.js')
const {saveFile, selectFolder, selectJsonFile} = require('./utils/saveFile.js')
const EC = require('elliptic').ec
const BN = require('bn.js');
const fs = require('fs');
const crypto = require('crypto');



/**
 * Generates public and private key pairs and saves them in two separate JSON files.
 * 
 * @param {Object} event - An event object that is used to send data to the front end.
 * @param {Array} arg - An array containing two elements: `numKeys` and `saveFolder`.
 * 
 * @returns {undefined} Sends a message to the frontend with the path to where the files were saved
 * @returns {void} Sends a "receive-NO-keys-generated" event to the frontend process with paths to the generated files.
 */
const genNodeOperatorKeystores = async (event, arg) => {
    console.log("genNodeOperatorKeystores: Start")
    const curve = new EC('secp256k1')
    const [numKeys, saveFolder, privKeysPassword] = arg

    const publicFileJSON = {}
    const privateKeysJSON = {}

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
    publicFileJSON["pubKeyArray"] = pubKeyArray
    // save publicEtherfiKeystore
    const publicFileTimeStamp = new Date().toISOString().slice(0,-5)
    const publicFileName = "publicEtherfiKeystore-" + publicFileTimeStamp
    const pubKeysFilePath = `${saveFolder}/${publicFileName}.json`

    fs.writeFileSync(pubKeysFilePath, JSON.stringify(publicFileJSON), 'utf-8', (err) => {
        if (err) {
            console.error(err);
            return;
    }})

    // Create privateKeysJSON object
    privateKeysJSON["pubKeyArray"] = pubKeyArray
    privateKeysJSON["privKeyArray"] = privKeyArray
    // save privateEtherfiKeystore
    const privateFileTimeStamp = new Date().toISOString().slice(0,-5)
    const privateFileName = "privateEtherfiKeystore-" + privateFileTimeStamp
    const privKeysFilePath = `${saveFolder}/${privateFileName}.json`

    const encryptedPrivateKeysJSON = encryptPrivateKeys(privateKeysJSON, privKeysPassword)

    fs.writeFileSync(privKeysFilePath, JSON.stringify(encryptedPrivateKeysJSON), 'utf-8', (err) => {
        if (err) {
          console.error(err);
          return;
    }})
    // Send the file paths back to frontend
    event.sender.send("receive-NO-keys-generated", [pubKeysFilePath, privKeysFilePath])
    console.log("genNodeOperatorKeystores: End")

}

const encryptPrivateKeys = (jsonData, privKeysPassword) => {
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const dataBuffer = Buffer.from(JSON.stringify(jsonData), 'utf8')
    const encryptedData = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const encryptedJSON = {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        data: encryptedData.toString('hex')
    };
    return encryptedJSON;
}

const decryptPrivateKeys = (privateKeysJSON, privKeysPassword) => {
    const iv = Buffer.from(privateKeysJSON.iv, 'hex');
    const salt = Buffer.from(privateKeysJSON.salt, 'hex');
    const encryptedData = Buffer.from(privateKeysJSON.data, 'hex');
    const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, 'sha256');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    decryptedDataJSON = JSON.parse(decryptedData.toString('utf8'))
    return decryptedDataJSON
}

/**
 * Generates a new mnemonic and sends it to the main process.
 *
 * @param {Object} event - Electron's event object used for inter-process communication.
 * @param {Array} arg - Array containing language used to generate the mnemonic.
 * @returns {void} Sends a "receive-new-mnemonic" event to the frontend process with the generated mnemonic as argument.
 */
const genMnemonic = async (event, arg) => {
    console.log("genMnemonic: Start")
    const language = arg[0]
    const mnemonic = await createMnemonic(language)
    event.sender.send("receive-new-mnemonic", [mnemonic])
    console.log("genMnemonic: End")
}

/**
 * Generates and encrypts the validator keys for a given stakeInfo.json file and mnemonic
 *
 * @param {object} event - Event object
 * @param {Array} arg - An array that contains the following elements:
 *   arg[0]: {String} mnemonic - The mnemonic seed phrase
 *   arg[1]: {String} password - The password for encrypting the validator keys
 *   arg[2]: {String} folder - The folder where the generated files will be saved
 *   arg[3]: {String} stakeInfoPath - The path to the stakeInfo.json file
 *
 * @return {object} - Sends an event `receive-key-gen-confirmation` with a single argument, 
 *   an array containing the folder path where the generated keys are saved.
 */
const genValidatorKeysAndEncrypt = async (event, arg) => {
    console.log("genEncryptedKeys: Start")
    var [mnemonic, password, folder, stakeInfoPath] = arg

    // get the data from stakeInfoPath
    const stakeInfo = JSON.parse(fs.readFileSync(stakeInfoPath))
    const count = stakeInfo.length
    const nodeOperatorPublicKeys = stakeInfo.map((stake) => stake.bidderPublicKey)
    const eth1_withdrawal_address = stakeInfo[0].withdrawalSafeAddress;

    const timeStamp = new Date().toISOString().slice(0,-5)
    folder += `/etherfi_keys-${timeStamp}`

    const index = 1
    const network = 'goerli' // TODO: change to 'mainnet'

    await generateKeys(mnemonic, index, count, network, password, eth1_withdrawal_address, folder)

    // now we need to encrypt the keys and generate "stakeRequest.json"
    await _encryptValidatorKeys(folder, password, nodeOperatorPublicKeys)

    // Send back the folder where everything is save
    event.sender.send("receive-key-gen-confirmation", [folder])

    console.log("genEncryptedKeys: End")
}

/**
 * Helper function that retrieves deposit data and keystore files from the specified folder.
 *
 * @param {string} folderPath - The path to the folder where the deposit data and keystore files are stored.
 * @returns {{depositDataList: Object[], validatorKeystoreList: Object[]}} 
 *   An object containing two arrays: depositDataList, a list of deposit data objects, 
 *   and validatorKeystoreList, a list of keystore objects.
 */
const _getDepositDataAndKeystoresJSON = async (folderPath) => {
    const depositDataFilePaths = []
    const validatorKeyFilePaths =  []
        
    fs.readdirSync(folderPath).forEach(fileName => {
        if (fileName.includes("deposit_data")) {
            depositDataFilePaths.push(`${folderPath}/${fileName}`)
        } else if (fileName.includes("keystore")) {
            validatorKeyFilePaths.push(`${folderPath}/${fileName}`)
        } else {
            console.log(`Unexpected File: ${fileName}`)
        }
    });
    console.log(depositDataFilePaths)
    if (depositDataFilePaths.length != 1) {
        console.error("ERROR: Multiple deposit data files")
    }
    const depositDataList = JSON.parse(fs.readFileSync(depositDataFilePaths[0]))

    const validatorKeystoreList = validatorKeyFilePaths.map(
        filePath => { 
            return {
                keystoreName: filePath.split("/").pop(),
                keystoreData: JSON.parse(fs.readFileSync(filePath))
            }
        }
    )

    if (validatorKeystoreList.length !== depositDataList.length) {
        console.error("ERROR: Deposit Data lenth != number of keys")
    }

    return {depositDataList, validatorKeystoreList}
}

/**
 * Encrypts validator keys and password for each deposit data element in the given folder path.
 *
 * @param {string} folderPath - The path to the folder containing deposit data and validator keystore files.
 * @param {string} password - The password for the validator keystore.
 * @param {Array} nodeOperatorPubKeys - An array of node operator public keys.
 *
 * @returns {undefined} - Returns nothing, saves the encrypted data to a stake request file in the given folder path.
 */
const _encryptValidatorKeys = async (folderPath, password, nodeOperatorPubKeys) => {
    // need to convert the folder path to a list of keystore paths and a deposit data file path
    const {depositDataList, validatorKeystoreList} = await _getDepositDataAndKeystoresJSON(folderPath);

    const curve = new EC('secp256k1')

    const stakeRequestJSON = []
    for (var depositData of depositDataList) {
        // Step 1: Get the keystore corresponding to the depsoit data element
        const matchesFound = validatorKeystoreList.filter(keyStoreObj => {
            return keyStoreObj.keystoreData.pubkey === depositData.pubkey
        })

        if (matchesFound.length !== 1) { 
            console.error("ERROR: more than one validator key found for deposit data")
            console.log(depositData)
            console.log(matchesFound)
            return
        }
        const validatorKey = JSON.stringify(matchesFound[0].keystoreData)
        const keystoreName = matchesFound[0].keystoreName
        // create new keyPair

        // Step 2: Encrypt validator keys 
        // get the nodeOperatorPubKey Point
        const nodeOperatorPubKeyHex = nodeOperatorPubKeys.pop()
        const nodeOperatorPubKeyPoint = curve.keyFromPublic(nodeOperatorPubKeyHex, 'hex').getPublic();

        // Step 3: generate staker keys and derive shared secret
        const stakerKeyPair = curve.genKeyPair()
        const stakerPrivKey = stakerKeyPair.getPrivate()

        const stakerSharedSecret = nodeOperatorPubKeyPoint.mul(stakerPrivKey).getX()

        // Step 4: encrypt data and store it in the stakeReqeustJSON arrays
        const stakeRequestItem = {
            depositData: depositData,
            encryptedKeystoreName: encrypt(keystoreName, stakerSharedSecret.toArrayLike(Buffer, 'be', 32)),
            encryptedValidatorKey: encrypt(validatorKey, stakerSharedSecret.toArrayLike(Buffer, 'be', 32)),
            encryptedPassword: encrypt(password, stakerSharedSecret.toArrayLike(Buffer, 'be', 32)),
            stakerPublicKey: stakerKeyPair.getPublic().encode('hex'),
            nodeOperatorPublicKey: nodeOperatorPubKeyHex
        }

        stakeRequestJSON.push(stakeRequestItem)
    }

    // dont need to save a private file for the staker right now
    // const stakePrivateJSON = {}

    const stakeRequestTimeStamp = new Date().toISOString().slice(0,-5)
    const stakeRequestFileName = "stakeRequest-" + stakeRequestTimeStamp
    const filePath = `${folderPath}/${stakeRequestFileName}.json`

    fs.writeFileSync(filePath, JSON.stringify(stakeRequestJSON), 'utf-8', (err) => {
        if (err) {
          console.error(err);
          return;
    }})
}

/**
 * Opens dialog that allows user to select a folder path.
 * 
 * @emits "receive-selected-folder-path" event with the selected folder path
 * 
 * @returns {undefined} No return value. Emits "receive-selected-folder-path" event with selected folder path
 */
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

/**
 * Opens dialog that allows user to select a file.
 * 
 * @emits "receive-selected-folder-path" event with the selected folder path
 * 
 * @returns {undefined} No return value. Emits "receive-selected-folder-path" event with selected folder path
 */
const listenSelectJsonFile = async (event, arg) => {
    selectJsonFile().then((result) => {
        const path = result.canceled ? '' : result.filePaths[0];
        event.sender.send("receive-selected-file-path", path)
    }).catch((error) => {
        console.log("ERROR Selecting Files")
        console.log(error)
        event.sender.send("receive-selected-file-path", 'Error Selecting Path')
    })
}

const decryptReportEnum = {
    SUCCESS: 0,
    BAD_PASSWORD: 1,
    BAD_PRIVATE_KEYS: 2,
    SAVE_FILE_ERROR: 3, 
}

const decryptValidatorKeys = async (event, arg) => {
    console.log("decryptValidatorKeys: Start")
    const [encryptedValidatorKeysFilePath, privateKeysFilePath, privKeysPassword,chosenFolder] = arg
    // This will work since the files have already been validated (validateFile.js)
    const encryptedValidatorKeysJson = JSON.parse(fs.readFileSync(encryptedValidatorKeysFilePath))
    const encrpytedPrivateKeysJson = JSON.parse(fs.readFileSync(privateKeysFilePath))
    var privateKeysJson = null
    try {
        privateKeysJson = decryptPrivateKeys(encrpytedPrivateKeysJson, privKeysPassword)
    } catch (err) {
        console.error(err.message)
        event.sender.send("receive-decrypt-val-keys-report", decryptReportEnum.BAD_PASSWORD, '', err.message)
        return
        // TODO: send error message to frontend saying the password is wrong
    }

    const curve = new EC('secp256k1')
    const keystoreToPassword = {
        keystoreArray: [],
        passwordArray: [],
    }

    // create folder to store filess
    const timeStamp = new Date().toISOString().slice(0,-5)
    const saveFolder = `${chosenFolder}/decrypted_validator_keys-${timeStamp}`
    if (!fs.existsSync(saveFolder)) {
        fs.mkdirSync(saveFolder);
      }

    try {
        // For each of the validator keys
        for (var encryptedValKey of encryptedValidatorKeysJson) {
            // Step 1: get the staker public key and convert it to a point
            const stakerPublicKeyHex = encryptedValKey["stakerPublicKey"]
            const receivedStakerPubKeyPoint = curve.keyFromPublic(stakerPublicKeyHex, 'hex').getPublic()

            // Step 2: get the correct node Operator Private Key and convert it to a Big Number
            const keyIndex = privateKeysJson["pubKeyArray"].indexOf(encryptedValKey["nodeOperatorPublicKey"])
            const nodeOperatorPrivKeyString = privateKeysJson["privKeyArray"][keyIndex]
            const nodeOperatorPrivKey = new BN(nodeOperatorPrivKeyString)

            // Step 3: Generate shared secret and decrypt the message
            const nodeOperatorSharedSecret = receivedStakerPubKeyPoint.mul(nodeOperatorPrivKey).getX()
            const validatorKeyString = decrypt(encryptedValKey["encryptedValidatorKey"], nodeOperatorSharedSecret.toArrayLike(Buffer, 'be', 32))
            const validatorKeyPassword = decrypt(encryptedValKey["encryptedPassword"], nodeOperatorSharedSecret.toArrayLike(Buffer, 'be', 32))
            const keystoreName = decrypt(encryptedValKey["encryptedKeystoreName"], nodeOperatorSharedSecret.toArrayLike(Buffer, 'be', 32))

            // Save keystore file
            const keyStorePath = `${saveFolder}/${keystoreName}`
            fs.writeFileSync(keyStorePath, validatorKeyString, 'utf-8', (err) => {
                if (err) {
                    console.error(err);
                    event.sender.send("receive-decrypt-val-keys-report", decryptReportEnum.SAVE_FILE_ERROR, '', err.message)
                }})
            keystoreToPassword["keystoreArray"].push(keystoreName)
            keystoreToPassword["passwordArray"].push(validatorKeyPassword)
        }
    } catch (err) {
        // Send Error Message to Frontend that the 
        event.sender.send("receive-decrypt-val-keys-report", decryptReportEnum.BAD_PRIVATE_KEYS, '', err.message)

    }
    
    const keystoreToPasswordFile = `${saveFolder}/keystore_to_password.json`
    fs.writeFileSync(keystoreToPasswordFile, JSON.stringify(keystoreToPassword), 'utf-8', (err) => {
        if (err) {
            event.sender.send("receive-decrypt-val-keys-report", decryptReportEnum.SAVE_FILE_ERROR, '', err.message)
            return;
    }})

    // Send Success!
    event.sender.send("receive-decrypt-val-keys-report", decryptReportEnum.SUCCESS, saveFolder, '')
    console.log("decryptValidatorKeys: End")
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
    listenSelectJsonFile,
    decryptValidatorKeys,
    testWholeEncryptDecryptFlow
}
