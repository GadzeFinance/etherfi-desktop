const {
    ipcRenderer,
    contextBridge
} = require("electron");


// Expose protected methods off of window (ie.
// window.api) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    // Function used in Node Operator Tab to generate public keys that will be registerd and private keys for decrypting
    reqGenNodeOperatorKeys: function(numKeys, connectedWallet){
        ipcRenderer.send("req-gen-node-operator-keys", [numKeys, connectedWallet]);
    },
    // Function to request a new mnemonic to be created. (Staker Tab)
    reqNewMnemonic: function(language){
        ipcRenderer.send("req-new-mnemonic", [language]);
    },
    // Function to receive the new mnemonic in the front end. 
    receiveNewMnemonic: function(func){
        ipcRenderer.once("receive-new-mnemonic", (event, ...args) => func(event, ...args));       
    },
    
    receiveBidFileInfo: function(func){
        ipcRenderer.once("receive-public-bid-file", (event, ...args) => func(event, ...args));       
    },
    reqSelectFiles: function(){
        ipcRenderer.send("req-select-files", []);
    },
    receiveSelectedFilesPaths: function(func){
        ipcRenderer.once("receive-selected-files-paths", (event, ...args) => func(event, ...args));       
    },
    reqBuildStakerFile: function(validatorKeyFilePaths, depositDataFilePath, password){
        ipcRenderer.send("req-build-public-staker-file", [validatorKeyFilePaths, depositDataFilePath, password]);
    },
});

