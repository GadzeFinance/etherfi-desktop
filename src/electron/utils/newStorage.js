const Store = require("electron-store");
const crypto = require("crypto");

const newSchema = {
    passwordHash: {
        type: "string",
    },
    validatorPassword: {
        type: "string",
        default: "",
    },
    operatorPassword: {
        type: "string",
        default: "",
    },
    stakerAccounts: {
        type: "array",
        items: {
            type: "object",
            properties: {
                address: {
                    type: "string",
                },
                mnemonics: {
                    type: "array",
                    items: { type: "string" },
                },
                validators: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: "string",
                            data: "string",
                        },
                    },
                },
            },
        },
    },
    // not sure this is the right shape for this data, but it's a start
    nodeOperatorAccounts: {
        type: "array",
        items: {
            type: "object",
            properties: {
                index: { type: "integer" },
                publicKey: { type: "string" },
                privateKey: { type: "string" },
            },
        },
    },
};

class Database {
    _store;

    constructor(store) {
        this._store = store;
    }

    _getStakerAccountByAddress(address) {
        return this._store.get("stakerAccounts").find((account) => account.address === address);
    }

    _updateStakerAccount(account) {
        const allAccounts = this._store.get("stakerAccounts");
        const rest = allAccounts.filter((account) => account.address !== address);
        const account = allAccounts.find((account) => account.address === address);
        if (!account) return;

        this.store.set("stakerAccounts", [...rest, account]);
    }

    _getValidatorAccountByAddress(address) {
        return this._store.get("validatorAccounts").find((account) => account.address === address);
    }

    _updateValidatorAccount(account) {
        const allAccounts = this._store.get("validatorAccounts");
        const rest = allAccounts.filter((account) => account.address !== address);
        const account = allAccounts.find((account) => account.address === address);
        if (!account) return;

        this.store.set("validatorAccounts", [...rest, account]);
    }

    isPasswordSet() {
        return !!this._store.get("passwordHash");
    }

    setPassword(password) {
        // TODO: check the password has not already been set
        this._store.set(
            "passwordHash",
            crypto.createHash("sha256").update(password).digest("hex")
        );
        // // Since this is our first time using app, we also need to generate a password for validators
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


    addStakerAccount(address) {
        if (!address) return;

        const current = this._store.get("stakerAccounts");
        if (!current.find((account) => account.address === address)) {
            this._store.set("stakerAccounts", [
                ...current,
                {
                    address,
                    mnemonics: [],
                    validatorIDs: [],
                },
            ]);
        }
    }

    getStakerAccount(address) {
        return this._store.get('stakerAccounts').find((account) => account.address === address);
    }

    // TODO: why are these functions the same?
    getAllStakerAddresses() {
        return this._store.get("stakerAccounts").map((account) => account.address);
    }
    getStakerAddressList() {
        return this._store.get("stakerAccounts").map((account) => account.address);
    }

    addMnemonic(address, mnemonic, password) {
        const account = this._getStakerAccountByAddress(address);
        if (!account) return;

        const encryptedMnemonic = this.encrypt(mnemonic, password);
        this._updateStakerAccount({
            ...account,
            mnemonics: [...account.mnemonics, encryptedMnemonic],
        })
    }

    getMnemonics(address, password) {
        const account = this._getStakerAccountByAddress(address);
        if (!account) return [];

        return account.mnemonics.map((mnemonic) => this.decrypt(mnemonic, password));
    }

    addValidator(address, validatorID, keystoreFile, password) {
        this._store.set(`stakerAddress.${address}.validators.${validatorID}`, this.encrypt(keystoreFile, password));
        const account = this._getStakerAccountByAddress(address);
        if (!account) return;

        const encryptedKeystore = this.encrypt(keystoreFile, password);
        this._updateStakerAccount({
            ...account,
            validators: [...account.validators, { id: validatorID, data: encryptedKeystore }],
        });
    }

    getValidatorsByAddress(address, password) {
        const account = this._getValidatorAccountByAddress(address);
        if (!account) return [];

        return account.validators.map((validator) => ({
            id: validator.id,
            data: this.decrypt(validator.keystore, password),
        }));
    }

    // busted
    addValidatorAddress(address) {
        const path = `validatorAddress.${address}`;
        if (!this._store.get(path)) {
            this._store.set(path, {});
        }
    }

    // busted
    getValidatorAddress(address) {
        const path = `validatorAddress.${address}`;
        return this._store.get(path);
    }

    // busted
    getAllValidatorAddress() {
        return this._store.get("validatorAddress");
    }

    // busted
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

const store = new Store({ schema: newSchema });
const db = new Database(store)
// store.clear();
// password = "Password123!";
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
module.exports = db
