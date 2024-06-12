const { ipcRenderer, contextBridge } = require("electron")

// Expose protected methods off of window (ie.
// window.api) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("encryptionApi", {
    // Function used in Node Operator Tab to generate public keys that will be registerd and private keys for decrypting
    reqGenNodeOperatorKeys: function (numKeys, saveFolder, privKeysPassword, address, dbPassword) {
        ipcRenderer.send("req-gen-node-operator-keys", [
            numKeys,
            saveFolder,
            privKeysPassword,
            "",
            dbPassword
        ])
    },
    // Function called when node operator keys are generated.
    receiveNOKeysConfirmation: function (func) {
        ipcRenderer.once("receive-NO-keys-generated-result", (event, ...args) =>
            func(event, ...args)
        )
    },
    // Function to request a new mnemonic to be created. (Staker Tab)
    reqNewMnemonic: function (language) {
        ipcRenderer.send("req-new-mnemonic", [language])
    },
    // Function to receive the new mnemonic in the front end.
    receiveNewMnemonic: function (func) {
        ipcRenderer.once("receive-new-mnemonic", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqStoredMnemonic: function (address, password) {
        ipcRenderer.send("req-stored-mnemonics", [address, password])
    },
    recieveStoredMnemonic: function (func) {
        ipcRenderer.once(
            "receive-req-stored-mnemonics-confirmation",
            (event, ...args) => func(event, ...args)
        )
    },
    reqStoredValidators: function (address, password) {
        ipcRenderer.send("req-stored-validators", [address, password])
    },
    receiveStoredValidators: function (func) {
        ipcRenderer.once("receive-stored-validators", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqGenValidatorKeysAndEncrypt: function (
        mnemonic,
        password,
        stakeInfo,
        address,
        mnemonicOption,
        importPassword,
        stakingCode,
        stakingMode
    ) {
        ipcRenderer.send("req-gen-val-keys-and-encrypt", [
            mnemonic,
            password,
            stakeInfo,
            address,
            mnemonicOption,
            importPassword,
            stakingCode,
            stakingMode,
        ])
    },
    receiveKeyGenConfirmation: function (func) {
        ipcRenderer.once("receive-key-gen-confirmation", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqDecryptValidatorKeys: function (
        encryptedValidatorKeysFilePath,
        privateKeysFilePath,
        privKeysPassword,
        saveFolder
    ) {
        ipcRenderer.send("req-decrypt-val-keys", [
            encryptedValidatorKeysFilePath,
            privateKeysFilePath,
            privKeysPassword,
            saveFolder,
        ])
    },
    receiveDecryptReport: function (func) {
        ipcRenderer.once("receive-decrypt-val-keys-report", (event, ...args) =>
            func(event, ...args)
        )
    },
    // This seems to be a legacy function, no one is using it.
    reqGetStakerAddresses: function (password) {
        ipcRenderer.send("req-get-staker-address", [password])
    },
    receieveGetStakerAddresses: function (func) {
        ipcRenderer.once("receive-get-staker-address", (event, ...args) =>
            func(event, ...args)
        )
    },
    receiveGenerateKey: function (func) {
        ipcRenderer.on("receive-generate-key", (event, ...args) =>
            func(event, ...args)
        )
    },
    stakeRequest: function (func) {
        ipcRenderer.on("stake-request", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqGetStakeRequestOnImportKeys: function (
        address,
        keystores,
        stakeInfo,
        keystoreNames,
        password,
        databasePassword
    ) {
        ipcRenderer.send("req-get-stake-request-on-import-keys", [address, keystores, stakeInfo, keystoreNames, password, databasePassword])
    },
    stakeRequestOnImportKeys: function (func) {
        ipcRenderer.on("stake-request-on-import-keys", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqDecrypt: function (cipherText, password) {
        ipcRenderer.send("req-decrypt", [cipherText, password])
    },
    receiveDecrypt: function (func) {
        ipcRenderer.once("receive-decrypt", (event, ...args) => func(event, ...args))
    }
})

contextBridge.exposeInMainWorld("exitMessageApi", {
    // Function used in Node Operator Tab to generate public keys that will be registerd and private keys for decrypting
    reqGenSignedExitMessage: function (
        useStoredKeys,
        selectedValidator,
        keystorePath,
        keystorePassword,
        validatorIndex,
        epoch,
        saveFolder,
        chain,
        password,
        address
    ) {
        ipcRenderer.send("req-signed-exit-message", [
            useStoredKeys,
            selectedValidator,
            keystorePath,
            keystorePassword,
            validatorIndex,
            epoch,
            saveFolder,
            chain,
            password,
            address,
        ])
    },
    receiveSignedExitMessageConfirmation: function (func) {
        ipcRenderer.once(
            "receive-signed-exit-message-confirmation",
            (event, ...args) => func(event, ...args)
        )
    },
})

contextBridge.exposeInMainWorld("fileSystemApi", {
    // Function to select a Folder path
    reqSelectFolderPath: function () {
        ipcRenderer.send("req-select-folder-path", [])
    },
    // Function to receive the selected folder path in the front end
    receiveSelectedFolderPath: function (func) {
        ipcRenderer.once("receive-selected-folder-path", (event, ...args) =>
            func(event, ...args)
        )
    },
    // Function to select a file path
    reqSelectFilePath: function () {
        ipcRenderer.send("req-select-file-path", [])
    },
    // Function to receive the selected folder path in the front end
    receiveSelectedFilePath: function (func) {
        ipcRenderer.once("receive-selected-file-path", (event, ...args) =>
            func(event, ...args)
        )
    },
    // Function to open a folder in the OS native file viewer
    reqOpenFolder: function (folder) {
        ipcRenderer.send("req-open-folder", [folder])
    },
    reqShowFile: function (folder) {
        ipcRenderer.send("req-show-file", [folder])
    },
})

contextBridge.exposeInMainWorld("validateFilesApi", {
    // Validate Stake Info File
    validateStakeInfoJson: function (pathToFile) {
        ipcRenderer.send("req-validate-file", [pathToFile, "StakeInfo"])
    },
    receiveStakeInfoValidationResults: function (func) {
        ipcRenderer.once(
            "receive-validate-StakeInfo-results",
            (event, ...args) => func(event, ...args)
        )
    },
    // Validate Encrypted Validator Keys File
    validateEncryptedValidatorKeysJson: function (pathToFile) {
        ipcRenderer.send("req-validate-file", [
            pathToFile,
            "EncryptedValidatorKeys",
        ])
    },
    receiveEncryptedValidatorKeysValidationResults: function (func) {
        ipcRenderer.once(
            "receive-validate-EncryptedValidatorKeys-results",
            (event, ...args) => func(event, ...args)
        )
    },
    // Validate Node Operator Private Keystore File
    validateNodeOperatorPrivateKeystoreJson: function (pathToFile) {
        ipcRenderer.send("req-validate-file", [
            pathToFile,
            "NodeOperatorPrivateKeystore",
        ])
    },
    receiveNodeOperatorPrivateKeystoreValidationResults: function (func) {
        ipcRenderer.once(
            "receive-validate-NodeOperatorPrivateKeystore-results",
            (event, ...args) => func(event, ...args)
        )
    },
    // Validate Validator KeyStore File
    validateKeystoreJson: function (pathToFile) {
        ipcRenderer.send("req-validate-file", [pathToFile, "ValidatorKeystore"])
    },
    receiveKeystoreValidationResults: function (func) {
        ipcRenderer.once(
            "receive-validate-ValidatorKeystore-results",
            (event, ...args) => func(event, ...args)
        )
    },
})

contextBridge.exposeInMainWorld("utilsApi", {
    // Function to set up log listener
    receiveLogs: function (func) {
        ipcRenderer.on("push-logs", (event, ...args) => func(event, ...args))
    },
    // Function to copy Mnemonic to clipboard
    copyToClipBoard: function (text) {
        ipcRenderer.send("copy-to-clipboard", [text])
    },
    stakerFinish: function () {
        ipcRenderer.send("staker-finish", null)
    },
})

contextBridge.exposeInMainWorld("databaseApi", {
    reqSetPassword: function (password) {
        ipcRenderer.send("req-set-password", [password])
    },
    receiveSetPasswordResult: function (func) {
        ipcRenderer.once("receive-set-password-result", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqValidatePassword: function (password) {
        ipcRenderer.send("req-validate-password", [password])
    },
    receiveValidatePasswordResult: function (func) {
        ipcRenderer.once("receive-validate-password-result", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqIsPasswordSet: function () {
        ipcRenderer.send("req-is-password-set", [])
    },
    receiveIsPasswordSet: function (func) {
        ipcRenderer.once("receive-is-password-set", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqAllStakerAddresses: function (password) {
        ipcRenderer.send("req-all-staker-addresses", [password])
    },
    receiveAllStakerAddresses: function (func) {
        ipcRenderer.once("receive-all-staker-addresses", (event, ...args) =>
            func(event, ...args)
        )
    },
    receiveIsPasswordSet: function (func) {
        ipcRenderer.once("receive-is-password-set", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqGetStakerAddressList: function (dbPassword) {
        ipcRenderer.send("req-get-staker-address-list", [dbPassword])
    },
    receiveGetStakerAddressList: function (func) {
        ipcRenderer.once("receive-get-staker-address-list", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqGetPassword: function (password) {
        ipcRenderer.send("req-get-password", [password])
    },
    recievePassword: function (func) {
        ipcRenderer.once("receive-get-password", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqGetValidatorIndices: function (password) {
        ipcRenderer.send("req-get-validator-indices", [password])
    },
    recieveGetValidatorIndices: function (func) {
        ipcRenderer.once("receive-get-validator-indices", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqHistoryByPage: function (page, databasePassword) {
        ipcRenderer.send("req-history-page", [page, databasePassword])
    },
    receiveHistoryByPage: function (func) {
        ipcRenderer.once("receive-history-page", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqHistoryPageCount: function () {
        ipcRenderer.send("req-history-page-count", [])
    },
    receiveHistoryPageCount: function (func) {
        ipcRenderer.once("receive-history-page-count", (event, ...args) =>
            func(event, ...args)
        )
    },
    reqSetAllStakerAddresses: function (stakerAddresses, dbPassword) {
        ipcRenderer.send("req-set-all-staker-addresses", [stakerAddresses, dbPassword])
    },
    receiveSetAllStakerAddresses: function (func) {
        ipcRenderer.once("receive-set-all-staker-addresses", (event, ...args) =>
            func(event, ...args)
        )
    }
})
