const crypto = require('crypto');
const BN = require('bn.js')
const EC = require('elliptic').ec


const genKey = () => {
    const curve = new EC('secp256k1')
    while (true) {
        const privateKey = new BN(crypto.randomBytes(Math.ceil(curve.n.bitLength() / 8)))
        if (!privateKey.isZero() && privateKey.cmp(curve.n) < 0) return privateKey
    }
}

function encrypt(text, ENCRYPTION_KEY) {
    const IV_LENGTH = 16; // For AES, this is always 16
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, ENCRYPTION_KEY) {

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = { 
    genKey,
    encrypt, 
    decrypt 
};
