const crypto = require('crypto');
const BN = require('bn.js')
const EC = require('elliptic').ec

// Encrypt any text
function encrypt(text, ENCRYPTION_KEY) {
    const IV_LENGTH = 16; // For AES, this is always 16
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt text that has been encrypted with 'encrypt' funciton
function decrypt(text, ENCRYPTION_KEY) {

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

// Encrypt private keys which is json data
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

module.exports = { 
    genKey,
    encrypt, 
    decrypt,
    encryptPrivateKeys,
    decryptPrivateKeys
};
