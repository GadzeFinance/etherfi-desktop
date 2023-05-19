const Store = require('electron-store');
const schema = require('./storageSchema');
class Database {
    _store

    constructor(store) {
        this._store = store;
    }

    /**
     * Returns EVERYTHING
     * @returns {object}
     */
    getEverything() {
        return this._store.store;
    }

    /**
     * Adds mnemonic and password to accounts
     * @param {string} mnemonic 
     * @param {string} password 
     */
    addAccount(mnemonic, password) {
        const accountID = (this._store.get("stakers.count") | 0) + 1;
        this._store.set(`stakers.data.${accountID}`, {mnemonic: mnemonic, password: password});
        this._store.set("stakers.count", parseInt(accountID));
    }

    /**
     * Returns all accounts with mnemonic and password
     * @returns {object} MUST STRINGIFY WHEN NEEDED!
     */
    getAccounts() {
        const accounts = this._store.get("stakers.data")
        return accounts ?? {}
    }
    /**
     * Returns all validators with id and private key
     * @param {string} validatorID 
     * @param {string} privateKey This is a stringified JSON!!
     */
    addValidator(validatorID, privateKey) {
        this._store.set(`validators.data.${validatorID}`, {validatorID: validatorID, fileData: privateKey})
        const newCount = (this._store.get("validators.count") | 0) + 1
        this._store.set("validators.count", newCount);
    }

    /**
     * Returns all validators
     * @returns {object} MUST STRINGIFY WHEN NEEDED!
     */
    getValidators() {
        return this._store.get("validators.data")
    }

    
}



const store = new Store({ schema });
database = new Database(store)
module.exports = database

