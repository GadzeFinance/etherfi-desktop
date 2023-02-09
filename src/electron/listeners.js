const {encrypt, decrypt } = require('./utils/encryptionUtils');
const {createMnemonic, generateKeys, validateMnemonic} = require('./utils/Eth2Deposit.js')
const {saveFile, selectFolder} = require('./utils/saveFile.js')
const EC = require('elliptic').ec
const fs = require('fs');
const path = require('path');
const { isAddress } = require('ethers/lib/utils');
const {callStakesQuery} = require('./TheGraph/queries')

const genNodeOperatorKeystores = async (event, arg) => {
    const data = await callStakesQuery();
    console.log(data)
    return;
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

const genMnemonic = async (event, arg) => {
    console.log("genMnemonic: Start")
    const language = arg[0]
    const mnemonic = await createMnemonic(language)
    event.sender.send("receive-new-mnemonic", [mnemonic])
    console.log("genMnemonic: End")
}

const genValidatorKeysAndEncrypt = async (event, arg) => {
    console.log("genEncryptedKeys: Start")
    const [walletAddress, mnemonic, password, folder] = arg

    const count = SUBGRAPH.GETSTAKES (walletAddress)

    const index = 1
    const network = 'goerli' // TODO: change to 'mainnet'
    const eth1_withdrawal_address = "0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA" // TODO: update this

    await generateKeys(mnemonic, index, count, network, password, eth1_withdrawal_address, folder)
    event.sender.send("receive-key-gen-confirmation", [])

    console.log("genEncryptedKeys: End")
}



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

const listenBuildStakerJson = async (event, arg) => {
    const [validatorKeyFilePaths, depositDataFilePath, password] = arg


    const validatorKeystoreList = validatorKeyFilePaths.map(
        filePath => JSON.parse(fs.readFileSync(filePath))
    )
    const depositDataList = JSON.parse(fs.readFileSync(depositDataFilePath))

    if (validatorKeystoreList.length !== depositDataList.length) {
        console.error("ERROR Deposit Data lenth != number of keys")
        return
    }
    // THIS IS THE OBJECT WE ARE BUILDING OUT


    // get list of the node Operator publick Keys -- THIS WILL BE PASSED IN LATER!!
    // TODO
    const bidrequest = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../test/nodeOperatorFiles/bidRequest.json")))
    const nodeOperatorPubKeys = bidrequest.pubKeyArray
    const curve = new EC('secp256k1')
    const stakeRequestJSON = []

    for (var depositData of depositDataList) {
        // for each deposit data get the corresponding validator keys
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
            defaultPath : stakeRequestFileName,
            buttonLabel: "Save Stake Request",
    
    }
    await saveFile(stakeRequestJSON, saveOptions)
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
    listenSelectFolder, 
    genValidatorKeysAndEncrypt,
    listenBuildStakerJson, 
    testWholeEncryptDecryptFlow
}