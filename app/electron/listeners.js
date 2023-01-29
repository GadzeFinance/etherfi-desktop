const { genKey, encrypt, decrypt } = require('./util');
const EC = require('elliptic').ec


const buildPublicBidJson = (event, arg) => {
    const curve = new EC('secp256k1')

    console.log(arg)
    console.log("I AM HERE")
    const newKey = genKey();
    console.log(newKey)
    const privateKey = genKey()

    const publickKey = curve.g.mul(privateKey)
    console.log(publickKey)

    event.sender.send("receive-public-bid-file", "HELLLLOOOOOOO")
}

const testWholeEncryptDecryptFlow = () => {
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
}

module.exports = {buildPublicBidJson}
