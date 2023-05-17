const crypto = require("crypto")
const BN = require("bn.js")
const EC = require("elliptic").ec

const IV_LENGTH = 12; // iv length of GCM should be 12 bytes (96 bits).

function encrypt(text, ENCRYPTION_KEY) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + cipher.getAuthTag().toString('hex');
}

function decrypt(text, ENCRYPTION_KEY) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.shift(), 'hex')
    const authTag = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
	decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Encrypt private keys which is json data
const encryptPrivateKeys = (jsonData, privKeysPassword) => {
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const dataBuffer = Buffer.from(JSON.stringify(jsonData), 'utf8')
    const encryptedData = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const encryptedJSON = {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        data: encryptedData.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex')
    };
    return encryptedJSON;
}

// Decrypt the private keys using hte password. Returns JSON data
const decryptPrivateKeys = (privateKeysJSON, privKeysPassword) => {
    const iv = Buffer.from(privateKeysJSON.iv, 'hex');
    const salt = Buffer.from(privateKeysJSON.salt, 'hex');
    const encryptedData = Buffer.from(privateKeysJSON.data, 'hex');
    const authTag = Buffer.from(privateKeysJSON.authTag, 'hex');
    const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, 'sha256');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    decryptedDataJSON = JSON.parse(decryptedData.toString('utf8'));
    return decryptedDataJSON;
}

module.exports = {
  encrypt,
  decrypt,
  encryptPrivateKeys,
  decryptPrivateKeys,
}
