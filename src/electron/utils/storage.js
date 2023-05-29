const Store = require("electron-store");
const crypto = require("crypto");
const schema = require('./storageSchema')

class Database {
    _store;

    constructor(store) {
        this._store = store;
    }

    isPasswordSet() {
        const passwordSet = this._store.get("passwordSet");
        return passwordSet;
    }

    setPassword(password) {
        // TODO: check the password has not already been set
        this._store.set("passwordSet", true);
        this._store.set(
            "passwordHash",
            crypto.createHash("sha256").update(password).digest("hex")
        );
        // Since this is our first time using app, we also need to generate a password for validators
        const validatorPassword = this.#generatePassword();
        const operatorPassword = this.#generatePassword();
        this._store.set('validatorPassword', this.encrypt(validatorPassword, password))
        this._store.set('operatorPassword', this.encrypt(operatorPassword, password))
    }

    validatePassword(password) {
        const storedHash = this._store.get("passwordHash");
        return (
            storedHash === crypto.createHash("sha256").update(password).digest("hex")
        );
    }


    getValidatorPassword(password) {
        return this.decrypt(this._store.get('validatorPassword'), password)
    }


    addStakerAddress(address) {
        const path = `stakerAddress.${address}`;
        if (!this._store.get(path)) {
            this._store.set(path, {});
        }
    }

    getStakerAddress(address) {
        const path = `stakerAddress.${address}`;
        return this._store.get(path);
    }

    getAllStakerAddresses() {
        return this._store.get("stakerAddress");
    }

    getStakerAddressList() {
        return this._store.get("stakerAddress");
    }

    addMnemonic(address, mnemonic, password) {
        const mnemonicID = (this._store.get(`stakerAddress.${address}.mnemonicCount`) | 0) + 1;
        this._store.set(`stakerAddress.${address}.mnemonics.${mnemonicID}`, this.encrypt(mnemonic, password));
        this._store.set(`stakerAddress.${address}.mnemonicCount`, parseInt(mnemonicID));
    }

    getMnemonics(address, password) {
        let decrypedObject = this._store.get(`stakerAddress.${address}.mnemonics`);
        if (!decrypedObject) {
            return {}
        }
        Object.keys(decrypedObject).forEach((key, index) => {
            decrypedObject[key] = this.decrypt(decrypedObject[key], password);
        });
        return decrypedObject;
    }

    addValidators(address, validatorID, keystoreFile, password) {
        this._store.set(`stakerAddress.${address}.validators.${validatorID}`, this.encrypt(keystoreFile, password));
    }

    getValidators(address, password) {
        let decrypedObject = this._store.get(`stakerAddress.${address}.validators`);
        if (!decrypedObject) return {}

        Object.keys(decrypedObject).forEach((key, index) => {
            decrypedObject[key] = this.decrypt(decrypedObject[key], password);
        });
        return decrypedObject;
    }


    addValidatorAddress(address) {
        const path = `validatorAddress.${address}`;
        if (!this._store.get(path)) {
            this._store.set(path, {});
        }
    }

    getValidatorAddress(address) {
        const path = `validatorAddress.${address}`;
        return this._store.get(path);
    }

    getAllValidatorAddress() {
        return this._store.get("validatorAddress");
    }

    // if the history data gets large we might need pagination
    getHistoryPageCount() {
        return this._store.get("historyPageCount");
    }

    getHistoryPage(pageId) {
        return this._store.get(`historyPages.${pageId}`) || [];
    }
    
    addHistoryPage() {
        const pageId = (this._store.get(`historyPageCount`) || 0) + 1;
        this._store.set(`historyPages.${pageId}`, {});
        this._store.set(`historyPageCount`, pageId);
        return pageId;
    }

    getHistoryRecordCount(pageId) {
        return this._store.get(`historyPages.${pageId}.recordCount`);
    }

    addHistoryRecord(pageId, timestamp, data) {
        // It's not this api's duty to ensure the number of records don't exceed
        const newRecordCount = (this._store.get(`historyPages.${pageId}.recordCount`) || 0) + 1;
        this._store.set(`historyPages.${pageId}.records.${timestamp}`, data);
        this._store.set(`historyPages.${pageId}.recordCount`, newRecordCount);
    }

    addOperatorKey(address, publicKey, privateKey, password) {
        this._store.set(`validatorAddresses.${address}.${publicKey}`, this.encrypt(privateKey, password));
    }

    #generatePassword () {
        const wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
        return Array.from(crypto.randomFillSync(new Uint32Array(20)))
        .map((x) => wishlist[x % wishlist.length])
        .join('')
    }

    encrypt = (jsonData, privKeysPassword) => {
        const salt = crypto.randomBytes(16);
        const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, "sha256");
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        const dataBuffer = Buffer.from(jsonData, "utf8");
        const encryptedData = Buffer.concat([
            cipher.update(dataBuffer),
            cipher.final(),
        ]);
        const encryptedJSON = {
            iv: iv.toString("hex"),
            salt: salt.toString("hex"),
            data: encryptedData.toString("hex"),
        };
        return JSON.stringify(encryptedJSON);
    };
    
    decrypt = (privateKeysJSON, privKeysPassword) => {
        privateKeysJSON = JSON.parse(privateKeysJSON)
        const iv = Buffer.from(privateKeysJSON.iv, "hex");
        const salt = Buffer.from(privateKeysJSON.salt, "hex");
        const encryptedData = Buffer.from(privateKeysJSON.data, "hex");
        const key = crypto.pbkdf2Sync(privKeysPassword, salt, 100000, 32, "sha256");
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        const decryptedData = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final(),
        ]);
        const decryptedDataJSON = decryptedData.toString("utf8");
        return decryptedDataJSON;
    };
}

const store = new Store({ schema });
const db = new Database(store)
// store.clear();
console.log(store.store)

module.exports = db
