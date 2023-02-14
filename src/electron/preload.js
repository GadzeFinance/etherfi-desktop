const {
    ipcRenderer,
    contextBridge
} = require("electron");


// Expose protected methods off of window (ie.
// window.api) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    // Function used in Node Operator Tab to generate public keys that will be registerd and private keys for decrypting
    reqGenNodeOperatorKeys: function(numKeys, saveFolder){
        ipcRenderer.send("req-gen-node-operator-keys", [numKeys, saveFolder]);
    },
    // Function called when node operator keys are generated.
    receiveNOKeysConfirmation: function(func){
        ipcRenderer.once("receive-NO-keys-generated", (event, ...args) => func(event, ...args));       
    },
    // Function to request a new mnemonic to be created. (Staker Tab)
    reqNewMnemonic: function(language){
        ipcRenderer.send("req-new-mnemonic", [language]);
    },
    // Function to receive the new mnemonic in the front end. 
    receiveNewMnemonic: function(func){
        ipcRenderer.once("receive-new-mnemonic", (event, ...args) => func(event, ...args));       
    },
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
    reqGenValidatorKeysAndEncrypt: function(mnemonic, password, folder, stakeInfoPath){
        ipcRenderer.send("req-gen-val-keys-and-encrypt", [mnemonic, password, folder, stakeInfoPath]);
    },
    receiveKeyGenConfirmation: function(func){
        ipcRenderer.once("receive-key-gen-confirmation", (event, ...args) => func(event, ...args));       
    },
    receiveLogs: function(func){
        ipcRenderer.on("push-logs", (event, ...args) => func(event, ...args));       
    },

});

