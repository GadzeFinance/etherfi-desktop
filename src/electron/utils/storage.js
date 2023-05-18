const CryptoJS = require('crypto-js')
const Store = require('electron-store');

class Database {

    _store;
    _password;

    constructor(store) {
        this._store = store;
    }

    getEverything() {
        return JSON.stringify(this._store.store)
    }

    addValidator(key, value) {
        this._store.set("validator/" + key.toString(), JSON.stringify(value))
    }

    getAllValidators() {

        let encryptedValidators = this._store.store;
        let decryptedValidators = new Map()
        Object.entries(encryptedValidators).forEach(entry => {
            const [key, value] = entry
            const [prefix, validatorID] = key.split("/")
            if (prefix == "validator") decryptedValidators[validatorID] = JSON.parse(value);
        })
        return decryptedValidators
    }

    setMnemonic(value) {
        const key = "mnemonic/" + Object.keys(this._store.store).reduce((acc, key) => {
            return key.startsWith("mnemonic") ? acc + 1 : acc
        }, 0).toString()
        this._store.set(key, value)
    }

    getAllMnemonics() {
        let encryptedMnemonics = this._store.store;
        let decryptedMnemonics = new Map()
        Object.entries(encryptedMnemonics).forEach(entry => {
            const [key, value] = entry
            const [prefix, mnemonicID] = key.split("/")
            if (prefix == "mnemonic") decryptedMnemonics[mnemonicID] = value;
        })
        return decryptedMnemonics
    }

    setPassword(password) {
        const key = "password/" + Object.keys(this._store.store).reduce((acc, key) => {
            return key.startsWith("password") ? acc + 1 : acc
        }, 0).toString()
        this._store.set(key, password)
    }

    getPassword(number) {
        return this._store.get(`password/${number}`);
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


