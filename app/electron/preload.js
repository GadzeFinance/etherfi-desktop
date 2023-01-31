const {
    ipcRenderer,
    contextBridge
} = require("electron");

// Expose protected methods off of window (ie.
// window.api.sendToA) in order to use ipcRenderer
// without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    reqPublicBidFile: function(bidSize, bidPrice){
        ipcRenderer.send("req-public-bid-file", [bidSize, bidPrice]);
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
        ipcRenderer.send("req-build-staker-file", [validatorKeyFilePaths, depositDataFilePath, password]);
    },
    genStakeRequest: function(walletAddress){
        ipcRenderer.send("gen-stake-request", walletAddress);
    },
});
