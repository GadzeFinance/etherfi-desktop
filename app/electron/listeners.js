const { genKey, encrypt, decrypt } = require('./utils.js/encryptionUtils');
const {saveFile, selectFiles, chooseSavePath} = require('./utils.js/saveFile.js')
const EC = require('elliptic').ec
const BN = require('bn.js')
const fs = require('fs');
const path = require('path')


const listenSelectFiles = async (event, arg) => {
    let result = await selectFiles()
    event.sender.send("receive-selected-files-paths", result.filePaths)
}

const listenBuildStakerJson = async (event, arg) => {
    const validatorKeyFilePaths = arg[0]
    const depositDataFilePath = arg[1]
    const password = arg[2]

    const validatorKeyStoreJSON = validatorKeyFilePaths.map(
        filePath => JSON.parse(fs.readFileSync(filePath))
    )
    const depositDataJSON = JSON.parse(fs.readFileSync(depositDataFilePath));

    const stakeRequestJSON = {}
    const stakePrivateJSON = {}

    // Do Cool Things and Save the resulting files
    // using {validatorKeyStoreJSON, depositDataJSON, password}
}

const buildPublicBidJson = async (event, arg) => {
    const curve = new EC('secp256k1') // secp
    const [bidSize, bidPrice] = arg;
    console.log(bidSize, bidPrice)

    const bidRequestJSON = {}
    const nodeOperatorKeysJSON = {}

    const privKeyArray = []
    const pubKeyArray = []
    for(var i = 0; i < bidSize; i++) {
        // create new key pair for each bid
        const keyPair = curve.genKeyPair()

        // get public key and encode it in hex
        const pubPoint = keyPair.getPublic()
        const pub = pubPoint.encode('hex');
        privKeyArray.push(keyPair.getPrivate().toString()) // do this in a more secure way? 
        pubKeyArray.push(pub)
    }

    // Create bidRequestJSON object
    bidRequestJSON["bidSize"] = bidSize
    bidRequestJSON["bidPrice"] = bidPrice
    bidRequestJSON["pubKeyArray"] = pubKeyArray

    // Create nodeOperatorKeysJSON object
    nodeOperatorKeysJSON["pubKeyArray"] = pubKeyArray
    nodeOperatorKeysJSON["privKeyArray"] = privKeyArray


    // save bidRequestJSON
    const bidRequestTimeStamp = new Date().toISOString().slice(0,-5)
    const bidRequestFileName = "bidRequest-" + bidRequestTimeStamp
    var saveOptions = {
        title: "Save bidRequestJSON file",
        defaultPath : bidRequestFileName,
        buttonLabel: "Save Bid Request",

    }
    await saveFile(bidRequestJSON, saveOptions)

    // save nodeoperatorKeysJSON
    const nodeOperatorKeysTimeStamp = new Date().toISOString().slice(0,-5)
    const nodeOperatorKeysFileName = "nodeOperatorKeys-" + nodeOperatorKeysTimeStamp
    saveOptions = {
            title: "Save nodeOperatorKeys file",
            defaultPath : nodeOperatorKeysFileName,
            buttonLabel: "Save Node Operator Keys",
    
    }
    await saveFile(nodeOperatorKeysJSON, saveOptions)

    // Send response to the front end? Maybe this should be the file names/locations?
    event.sender.send("receive-public-bid-file", bidRequestJSON)

}

// Assumption: the folder that is passed in contains only one deposit data file and more than one keystore file
// We are also assuming that the deposit data file starts with "deposit_data" and keystore file starts with "keystore"
const genStakeRequest = (event, arg) => {
    const NUM_VALIDATORS = 10
    const [walletAddress] = arg
    const nodeOperatorFiles = fs.readdirSync(path.resolve(__dirname, '../test/nodeOperatorFiles'))
    const validatorKeysDir = fs.readdirSync(path.resolve(__dirname, '../test/validator_keys'))
    console.log(nodeOperatorFiles)
    console.log(validatorKeysDir)

    // get the file name for the deposit data
    let depositDataFilePath = ""
    for (var fileName of validatorKeysDir) {
        if (fileName.includes("deposit_data")) {
            depositDataFilePath = path.resolve(__dirname, `../test/validator_keys/${fileName}`)
        }
    }
    // Read the deposit data file
    const rawDepositData = fs.readFileSync(depositDataFilePath)
    const depositDataList = JSON.parse(rawDepositData);

    // const depositDataKeyStoreObj = {}
    // for (var fileName of validatorKeysDir) {
    //     if (fileName.includes("keystore")) {
    //         const keystorePath = path.resolve(__dirname, `../test/validator_keys/${fileName}`)
    //         const rawKeystore = fs.readFileSync(keystorePath)
    //         const validatorKey = JSON.parse(rawKeystore);
    //         const validatorKeyPubKey = validatorKey.pubkey
    //         for (var deposit)
    //         depositDataKeyStoreObj[validatorKey.pubkey] = {}
    //         depositDataKeyStoreObj[validatorKey.pubkey]["validatorKey"] = validatorKey
    //     }
    // }

    // parse the depositData and fill out the depositPubKeyToKeyMap 

    // for (var depositData of depositDataList) {
    //     depositPubKeyToKeyMap[depositData.pubkey] = depositData

    //     // get the correct validator Key for this deposit data
    //     for (var fileName of )
    // }

    // Read the bidRequest file to get nodeOperatorPubKeys
    const rawBidRequest = fs.readFileSync(path.resolve(__dirname, '../test/nodeOperatorFiles/bidRequest.json'))
    const bidRequest = JSON.parse(rawBidRequest);
    console.log(bidRequest.pubKeyArray)
    console.log(depositPubKeyToKeyMap)
    
    const stakeRequestList = []



    const SCHEMA = 
        [
            {
                depositData: {},
                encryptedValidatorKey: "", // ??? How to store?
                encryptedPassword: "",
                stakerPubEncryptionKey: "",
                // NEED SOMETHING TO INDEX What nodeOperator pubKey should be used to decrypt
                // Going to use nodeOperatorPubKey right now. Can be changed to "stakeID" later
                nodeOperatorPublicEncryptionKey: ""
            }
        ]
    // This function is generating the stakeReqJSON
    // for each of the keystores I want too:
    // get the deposit data for that keystore: 



    //TODO: Use wallet address to get the list of stakes and the private keys to use for each of the stakes

}

const testWholeEncryptDecryptFlow = (event, arg) => {
    const AlicePrivateKey = genKey()
    // curve.g.mul(key) -- publicKey
    const AlicePublicKey = curve.g.mul(AlicePrivateKey)
    
    
    
    
    const BobPrivateKey = genKey()
    const BobPublicKey = curve.g.mul(BobPrivateKey)

    const BobSharedSecret = AlicePublicKey.mul(BobPrivateKey).getX()
    const AliceSharedSecret = BobPublicKey.mul(AlicePrivateKey).getX()

    const message = "okay nooowww"

    const encryptedMsg = encrypt(message, BobSharedSecret.toArrayLike(Buffer, 'be', 32))
    const decryptedMsg = decrypt(encryptedMsg, AliceSharedSecret.toArrayLike(Buffer, 'be', 32))
    console.log(decryptedMsg)

    var key = curve.genKeyPair();
    var pubPoint = key.getPublic();
    var x = pubPoint.getX();
    var y = pubPoint.getY();
    var pub = pubPoint.encode('hex');

    var key2 = curve.keyFromPublic(pub, 'hex');

    console.log(key === key2)
}

// const generateValidatorKeys = (event, arg) => {

//     //Option 1: Call ether CLI --- ? 
    
//     //Option 2: Get  Validator Key and passowrd. 

//     // We have a file (or many) named

//     ValidatorKeyJSON = file.usePassword(Password).read()

//     validatorKeyString = ValidatorKeyJSON.toString()
//     encryptedValidatorKey = encrypt(validatorKeyString)

//     // Node operator Side

//     vali





//     console.log(arg)
//     console.log("I AM HERE")
//     const newKey = genKey();
//     console.log(newKey)
//     const privateKey = genKey()

//     const publickKey = curve.g.mul(privateKey)
//     console.log(publickKey)

//     event.sender.send("receive-public-bid-file", "HELLLLOOOOOOO")
// }


module.exports = {listenSelectFiles, listenBuildStakerJson, buildPublicBidJson, testWholeEncryptDecryptFlow, genStakeRequest}