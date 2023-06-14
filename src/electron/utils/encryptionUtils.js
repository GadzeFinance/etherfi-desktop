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
    const usingCBC = textParts.length === 2;
    const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.shift(), 'hex');
    if (usingCBC) {
        console.info("using CBC decryption...");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    console.info("using GCM decryption...");
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
    const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, 'sha256');
    // Check authTag in the private keys file: if present, use GCM; if not, use CBC
    if (!privateKeysJSON.authTag) {
        console.info("using CBC decryption...")
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
        const decryptedData = Buffer.concat([
          decipher.update(encryptedData),
          decipher.final(),
        ])
        const decryptedDataJSON = JSON.parse(decryptedData.toString("utf8"))
        return decryptedDataJSON
    }
    console.info("using GCM decryption...")
    const authTag = Buffer.from(privateKeysJSON.authTag, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    const decryptedDataJSON = JSON.parse(decryptedData.toString('utf8'));
    return decryptedDataJSON;
}

module.exports = {
  encrypt,
  decrypt,
  encryptPrivateKeys,
  decryptPrivateKeys,
}
