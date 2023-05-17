const CryptoJS = require('crypto-js')
const Store = require('electron-store');

class Database {

    _store;
    _password;

    constructor(store) {
        this._store = store;
    }

    setPassword(password) {
        if (this.isPasswordSet()) {
            return
        }

        this._store.set("password", true)
        console.log("SetPass: ", this._store.store)
        this._password = password;
    }

    isPasswordSet() {
        console.log(this._store.store)
        return this._store.get("password");
    }

    addValidator(key, value) {
        this._store.set("validator/" + key.toString(), this.#encrypt(value))
    }

    getAllValidators() {
        let encryptedValidators = this._store.store;
        let decryptedValidators = new Map()
        Object.entries(encryptedValidators).forEach(entry => {
            const [key, value] = entry
            const [prefix, validatorID] = key.split("/")
            if (prefix == "validator") decryptedValidators[validatorID] = this.#decrypt(value);
        })
        return decryptedValidators
    }

    setMnemonic(value) {

        const key = "mnemonic/" + Object.keys(this._store.store).reduce((acc, key) => {
            return key.startsWith("mnemonic") ? acc + 1 : acc
        }, 0).toString()
        console.log(key)
        this._store.set(key, this.#encrypt(value))
    }

    getAllMnemonics() {
        let encryptedMnemonics = this._store.store;
        let decryptedMnemonics = new Map()
        Object.entries(encryptedMnemonics).forEach(entry => {
            const [key, value] = entry
            const [prefix, mnemonicID] = key.split("/")
            if (prefix == "mnemonic") decryptedMnemonics[mnemonicID] = this.#decrypt(value);
        })
        return decryptedMnemonics
    }

    #encrypt = (content) => CryptoJS.AES.encrypt(JSON.stringify({ content }), this._password).toString()
    #decrypt = (crypted) => JSON.parse(CryptoJS.AES.decrypt(crypted, this._password).toString(CryptoJS.enc.Utf8)).content
}

const storeInstance = new Store()
let database = new Database(storeInstance)

// database.setMnemonic("Apple Bull Cat Dog Elephant")
// database.setMnemonic("Ginger Hyena Ink Jellyfish Kangaroo")

// console.log("Here: ", database.getAllMnemonics())


module.exports = database


