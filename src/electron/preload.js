const {
    ipcRenderer,
    contextBridge,
} = require("electron");


// Expose protected methods off of window (ie.
// window.api) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("encryptionApi", {
    // Function used in Node Operator Tab to generate public keys that will be registerd and private keys for decrypting
    reqGenNodeOperatorKeys: function(numKeys, saveFolder, privKeysPassword){
        ipcRenderer.send("req-gen-node-operator-keys", [numKeys, saveFolder, privKeysPassword]);
    },
    // Function called when node operator keys are generated.
    receiveNOKeysConfirmation: function(func){
        ipcRenderer.once("receive-NO-keys-generated-result", (event, ...args) => func(event, ...args));       
    },
    // Function to request a new mnemonic to be created. (Staker Tab)
    reqNewMnemonic: function(language){
        ipcRenderer.send("req-new-mnemonic", [language]);
    },
    // Function to receive the new mnemonic in the front end. 
    receiveNewMnemonic: function(func){
        ipcRenderer.once("receive-new-mnemonic", (event, ...args) => func(event, ...args));       
    },
    reqStoredAccount: function() {
        ipcRenderer.send("req-stored-accounts", []);
    },
    recieveStoredAccount: function (func) {
        ipcRenderer.once("receive-req-stored-account-confirmation", (event, ...args) => func(event, ...args));       
    },
    reqStoredValidators: function() {
        ipcRenderer.send("req-stored-validators", []);
    },
    receiveStoredValidators: function(func) {
        ipcRenderer.once("receive-stored-validators", (event, ...args) => func(event, ...args))
    },
    reqGenValidatorKeysAndEncrypt: function(mnemonic, password, folder, stakeInfoPath, chain){
        ipcRenderer.send("req-gen-val-keys-and-encrypt", [mnemonic, password, folder, stakeInfoPath, chain]);
    },
    receiveKeyGenConfirmation: function(func){
        ipcRenderer.once("receive-key-gen-confirmation", (event, ...args) => func(event, ...args));       
    },
    reqDecryptValidatorKeys: function(encryptedValidatorKeysFilePath, privateKeysFilePath, privKeysPassword, saveFolder){
        ipcRenderer.send("req-decrypt-val-keys", [encryptedValidatorKeysFilePath, privateKeysFilePath, privKeysPassword, saveFolder]);
    },
    receiveDecryptReport: function(func){
        ipcRenderer.once("receive-decrypt-val-keys-report", (event, ...args) => func(event, ...args));       
    },
    reqGetPassword: function(number) {
        ipcRenderer.send('req-get-password', [number])
    },
    receiveGetPassword: function(func) {
        ipcRenderer.once("receive-get-password", (event, ...args) => func(event, ...args));       
    }
});

contextBridge.exposeInMainWorld("exitMessageApi", {
    // Function used in Node Operator Tab to generate public keys that will be registerd and private keys for decrypting
    reqGenSignedExitMessage: function(useStoredKeys, selectedValidator, keystorePath, keystorePassword, validatorIndex, epoch, saveFolder, chain){
        ipcRenderer.send("req-signed-exit-message", [useStoredKeys, selectedValidator, keystorePath, keystorePassword, validatorIndex, epoch, saveFolder, chain]);
    },
    receiveSignedExitMessageConfirmation: function(func){
        ipcRenderer.once("receive-signed-exit-message-confirmation", (event, ...args) => func(event, ...args));
    },
}); 

contextBridge.exposeInMainWorld("fileSystemApi", {
    // Function to select a Folder path 
    reqSelectFolderPath: function(){
        ipcRenderer.send("req-select-folder-path", []);
    },
    // Function to receive the selected folder path in the front end
    receiveSelectedFolderPath: function(func){
        ipcRenderer.once("receive-selected-folder-path", (event, ...args) => func(event, ...args));       
    },
    // Function to select a file path 
    reqSelectFilePath: function(){
        ipcRenderer.send("req-select-file-path", []);
    },
    // Function to receive the selected folder path in the front end
    receiveSelectedFilePath: function(func){
        ipcRenderer.once("receive-selected-file-path", (event, ...args) => func(event, ...args));       
    },
    // Function to open a folder in the OS native file viewer
    reqOpenFolder: function(folder){
        ipcRenderer.send("req-open-folder", [folder]);
    },
    reqShowFile: function(folder){
        ipcRenderer.send("req-show-file", [folder]);
    },
    

});

contextBridge.exposeInMainWorld("validateFilesApi", {
    // Validate Stake Info File
    validateStakeInfoJson: function(pathToFile){
        ipcRenderer.send("req-validate-file", [pathToFile, 'StakeInfo']);
    },
    receiveStakeInfoValidationResults: function(func){
        ipcRenderer.once("receive-validate-StakeInfo-results", (event, ...args) => func(event, ...args));       
    },
    // Validate Encrypted Validator Keys File
    validateEncryptedValidatorKeysJson: function(pathToFile){
        ipcRenderer.send("req-validate-file", [pathToFile, 'EncryptedValidatorKeys']);
    },
    receiveEncryptedValidatorKeysValidationResults: function(func){
        ipcRenderer.once("receive-validate-EncryptedValidatorKeys-results", (event, ...args) => func(event, ...args));       
    },
    // Validate Node Operator Private Keystore File
    validateNodeOperatorPrivateKeystoreJson: function(pathToFile){
        ipcRenderer.send("req-validate-file", [pathToFile, 'NodeOperatorPrivateKeystore']);
    },
    receiveNodeOperatorPrivateKeystoreValidationResults: function(func){
        ipcRenderer.once("receive-validate-NodeOperatorPrivateKeystore-results", (event, ...args) => func(event, ...args));       
    },
    // Validate Validator KeyStore File
    validateKeystoreJson: function(pathToFile){
        ipcRenderer.send("req-validate-file", [pathToFile, 'ValidatorKeystore']);
    },
    receiveKeystoreValidationResults: function(func){
        ipcRenderer.once("receive-validate-ValidatorKeystore-results", (event, ...args) => func(event, ...args));       
    },
});

contextBridge.exposeInMainWorld("utilsApi", {
    // Function to set up log listener
    receiveLogs: function(func){
        ipcRenderer.on("push-logs", (event, ...args) => func(event, ...args));       
    },
    // Function to copy Mnemonic to clipboard 
    copyToClipBoard: function(text){
        ipcRenderer.send("copy-to-clipboard", [text]);
    },
    stakerFinish: function(){
        ipcRenderer.send("staker-finish", null);
    },
    reqDatabaseContents: function() {
        ipcRenderer.send("req-database-contents", []);
    },
    recieveDatabaseContents: function(func) {
        ipcRenderer.once("receive-database-contents", (event, ...args) => func(event, ...args));       
    }
});


contextBridge.exposeInMainWorld("databaseApi", {
    // Function to request a check to see if the bidder public keys in the stake info file have already been used to encrypt validatorkeys
    reqCheckForStaleBidderPublicKeys: function(stakeInfoPath){
        ipcRenderer.send("req-check-for-stale-keys", [stakeInfoPath]);
    },
    receiveStaleBidderPublicKeysReport: function(func){
        ipcRenderer.once("receive-stale-keys-report", (event, ...args) => func(event, ...args));       
    },
    reqUpdateStaleKeys: function(stakeInfoPath){
        ipcRenderer.send("req-update-stale-keys", [stakeInfoPath]);
    },
    receiveUpdateStaleKeysResult: function(func){
        ipcRenderer.once("receive-update-stale-keys-report", (event, ...args) => func(event, ...args));       
    }
});

