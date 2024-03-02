const Store = require("electron-store");
const crypto = require("crypto");
const schema = require('./storageSchema');
const { add } = require("winston");

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

        const salt = crypto.randomBytes(16).toString('base64');
        this._store.set("passwordSalt", salt)

        // TODO: check the password has not already been set
        this._store.set("passwordSet", true);
        this._store.set(
            "passwordHash",
            crypto.createHash("sha256").update(`${password}:${salt}`).digest("hex")
        );
        // Since this is our first time using app, we also need to generate a password for validators
        const operatorPassword = this.generatePassword();
        this._store.set('operatorPassword', this.encrypt(operatorPassword, password))
    }

    validatePassword(password) {
        const storedHash = this._store.get("passwordHash");
        const salt = this._store.get("passwordSalt")
        return (
            storedHash === crypto.createHash("sha256").update(`${password}:${salt}`).digest("hex")
        );
    }

    getValidatorByIndex(validatorIndex) {
        const obj = this._store.get('stakerAddress')
        if (!obj) return {}
        const addresses = Object.keys(obj)
        let validator = {}
        for (const address of addresses) {
            const validators = obj[address].validators
            if (!validators) continue
            const validator = validators[validatorIndex]
            if (!validator) continue
            return validator
        }
        return validator
    }

    getValidatorPassword(address, validatorIndex, password) {
        const validator = this.getValidatorByIndex(validatorIndex)
        const encryptedPassword = validator.password
        return this.decrypt(encryptedPassword, password)
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

    setAllStakerAddresses(stakerAddresses, dbPassword) {
        this._store.set("stakerAddress", stakerAddresses);
    }

    getAllStakerAddresses(dbPassword) {
        const allStakerAddress = this._store.get("stakerAddress");

        let is_legacy = true
        for (const address in allStakerAddress) {
            if (address === "undefined") continue // filter out empty address
            const mnemonics = allStakerAddress[address].mnemonics
            if (Object.keys(mnemonics).length === 0) { // empty array, no need to convert to new format
                is_legacy = false
                break
            }
            if (Object.keys(mnemonics)[0].startsWith("{")) { // already in new format
                is_legacy = false
                break
            }
            // convert to new format
            const newMnemonics = {}
            for (const mnemonic in mnemonics) {
                const encryptedMnemonic = this.encrypt(mnemonic, dbPassword);
                newMnemonics[encryptedMnemonic] = mnemonics[mnemonic]
            }
            allStakerAddress[address].mnemonics = newMnemonics
        }

        if (is_legacy) {
            this._store.set("stakerAddress", allStakerAddress)
        }

        return allStakerAddress;
    }

    addMnemonic(address, mnemonic, validatorPassword, password) {
        const encryptedMnemonic = this.encrypt(mnemonic, password);
        this._store.set(`stakerAddress.${address}.mnemonics.${encryptedMnemonic}`, {
            password: this.encrypt(validatorPassword, password),
            mnemonic: encryptedMnemonic,
            dateCreated: new Date().toLocaleDateString()
        });
    }

    getMnemonics(address, password) {
        let oldDecrypedObject = this._store.get(`stakerAddress.${address}.mnemonics`);
        if (!oldDecrypedObject) {
            return {}
        }
        const decrypedObject = {}
        Object.keys(oldDecrypedObject).forEach((key, index) => {
            // in new flow it's a json
            if (key.startsWith("{")) {
                const decryptedKey = this.decrypt(key, password)
                decrypedObject[decryptedKey] = {
                    password: this.decrypt(oldDecrypedObject[key].password, password),
                    mnemonic: this.decrypt(oldDecrypedObject[key].mnemonic, password),
                    dateCreated: oldDecrypedObject[key].dateCreated
                };
            } else { // in old flow it's plain text
                decrypedObject[key] = {
                    password: this.decrypt(oldDecrypedObject[key].password, password),
                    mnemonic: this.decrypt(oldDecrypedObject[key].mnemonic, password),
                    dateCreated: oldDecrypedObject[key].dateCreated
                };
            }
            
        });
        return decrypedObject;
    }

    addValidators(address, validatorID, keystoreFile, keystorePassword, password) {
        console.log('adding validator', address, validatorID, keystoreFile, keystorePassword, password)
        this._store.set(`stakerAddress.${address}.validators.${validatorID}`, {
            password: this.encrypt(keystorePassword, password),
            keystore: this.encrypt(keystoreFile, password)
        });
    }

    getValidators(address, password) {
        if (!address) {
            const obj = this._store.get('stakerAddress')
            if (!obj) return {}
            const addresses = Object.keys(obj)

            const decryptedValidators = addresses.reduce((acc, address) => {
                if (!address) return acc
                const validators = obj[address].validators
                if (!validators) return acc
                Object.keys(validators).forEach((key) => {
                    if (!key) return acc
                    acc[key] = {
                        password: this.decrypt(validators[key].password, password),
                        keystore: this.decrypt(validators[key].keystore, password)
                    }
                })
                return acc
            }, {})

            return decryptedValidators
        }
        let decrypedObject = this._store.get(`stakerAddress.${address}.validators`);
        if (!decrypedObject) return {}

        Object.keys(decrypedObject).forEach((key, index) => {
            decrypedObject[key] = {
                password: this.decrypt(decrypedObject[key].password, password),
                keystore: this.decrypt(decrypedObject[key].keystore, password)
            };
        });
        return decrypedObject;
    }

    getAllValidatorIndices(address) {
        const obj = this._store.get(`stakerAddress.${address}.validators`);
        if (!obj) return []
        return Object.keys(obj)
    }


    getHistoryRecordsByTimestampList(timestamps) {
        const records = {};
        for (const timestamp of timestamps) {
            const record = this._store.get(`historyRecords.${timestamp}`) || {};
            records[timestamp] = record;
        }
        return records;
    }

    getHistoryTimestampList() {
        if (!this._store.get(`historyRecordTimestampList`)) {
            this._store.set(`historyRecordTimestampList`, []);
        }
        return this._store.get(`historyRecordTimestampList`);
    }

    getHistoryRecordCount() {
        if (!this._store.get(`historyRecordCount`)) {
            this._store.set(`historyRecordCount`, 0);
        }
        return this._store.get(`historyRecordCount`);
    }

    addHistoryRecord(timestamp, data) {
        this._store.set(`historyRecords.${timestamp}`, data);
        const recordCount = this.getHistoryRecordCount() || 0;
        this._store.set(`historyRecordCount`, recordCount + 1);
        const timestamps = this.getHistoryTimestampList() || [];
        timestamps.push(timestamp);
        this._store.set(`historyRecordTimestampList`, timestamps);
    }

    generatePassword () {
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
const storage = new Database(store)

module.exports = {
    storage,
    store,
    Database
}
