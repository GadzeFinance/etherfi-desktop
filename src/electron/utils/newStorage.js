const Store = require("electron-store");
const crypto = require("crypto");

const newSchema = {
    passwordSet: {
        type: "boolean",
        default: true,
    },
    passwordHash: {
        type: "string",
        default: "",
    },
    validatorPassword: {
        type: "string",
        default: "",
    },
    stakerAddresses: {
        type: "object",
        properties: {
            stakerAddress: {
                type: "object",
                properties: {
                    mnemonicCount: {
                        type: "integer",
                        default: 1,
                    },
                    mnemonics: {
                        type: "object",
                        properties: {
                            mnemonicID: {
                                // Key is auto increment, value is mnemonic
                                type: "string",
                                default: "",
                            },
                        },
                    },
                    validatorCount: {
                        type: "integer",
                        default: 1,
                    },
                    validators: {
                        type: "object",
                        properties: {
                            validatorID: {
                                // Value will be the keystore file
                                type: "string",
                                default: "",
                            },
                        },
                    },
                },
            },
        },
    },
    validatorAddresses: {
        type: "object",
        properties: {
            validatorAddress: {
                type: "object",
                properties: {
                    operatorKeysCount: {
                        type: "integer",
                        default: 0,
                    },
                    operatorKeys: {
                        type: "object",
                        properties: {
                            operatorKeyID: {
                                type: "object",
                                properties: {
                                    privateKey: {
                                        type: "string",
                                        default: "",
                                    },
                                    publicKey: {
                                        type: "string",
                                        default: "",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

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
        this._store.set('validatorPassword', this.encrypt(validatorPassword, password))
    }

    validatePassword(password) {
        const storedHash = this._store.get("passwordHash");
        return (
            storedHash === crypto.createHash("sha256").update(password).digest("hex")
        );
    }


    getValidatorPassword(password) {
        return decrypt(this._store.get('validatorPassword'), password)
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

    addMnemonic(address, mnemonic, password) {
        const mnemonicID = (this._store.get("stakerAddress.mnemonicCount") | 0) + 1;
        this._store.set(`stakerAddress.${address}.mnemonics.${mnemonicID}`, encrypt(mnemonic, password));
        this._store.set("stakerAddress.mnemonicCount", parseInt(mnemonicID));
    }

    getMnemonics(address, password) {
        let decrypedObject = this._store.get(`stakerAddress.${address}.mnemonics`);
        Object.keys(decrypedObject).forEach((key, index) => {
            decrypedObject[key] = decrypt(decrypedObject[key], password);
        });
        return decrypedObject;
    }

    addValidators(address, validatorID, keystoreFile, password) {
        this._store.set(`stakerAddress.${address}.validators.${validatorID}`, encrypt(keystoreFile, password));
    }

    getValidators(address, password) {
        let decrypedObject = this._store.get(`stakerAddress.${address}.validators`);
        Object.keys(decrypedObject).forEach((key, index) => {
            decrypedObject[key] = decrypt(decrypedObject[key], password);
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
        console.log("PASSWORD: ", privKeysPassword)
        console.log(privateKeysJSON)
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

const store = new Store({ newSchema });
// store.clear();
// password = "Password123!";

const db = new Database(store);
// db.setPassword(password);
// console.log("Passwords match: ", db.validatePassword(password));

// console.log("Generated Password match: ", db.getValidatorPassword(password))

// db.addStakerAddress("0xABC");
// console.log("Current Addresses: ", db.getStakerAddress("0xABC"));
// console.log("All Staker Addresses: ", db.getAllStakerAddresses());
// db.addMnemonic("0xABC", "Apple Ball Cat Dog", password);
// db.addMnemonic("0xABC", "Elephant Frog Gellyfish Hyena", password);
// console.log("Fetch the mnemonics: ", db.getMnemonics("0xABC", password));
// console.log("All Staker Addresses: ", db.getAllStakerAddresses());

// db.addValidators("0xABC", "45", "{key: store}", password);
// console.log("All validators: ", db.getValidators("0xABC", password))

// db.addValidatorAddress('0xDEF')
// console.log("All Validator Addresses: ", db.getValidatorAddress('0xDEF'));
// console.log("Get All Validator Addresses: ", db.getAllValidatorAddress())

module.exports = {
    store,
    db
}