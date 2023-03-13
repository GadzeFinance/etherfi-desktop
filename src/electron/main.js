const {
    app,
    BrowserWindow,
    ipcMain,
    clipboard,
    shell,
} = require("electron");

const path = require("path");
const isDevelopment = process.env.NODE_ENV === "development";
const { 
    genNodeOperatorKeystores,
    genMnemonic,
    listenSelectFolder,
    listenSelectJsonFile,
    genValidatorKeysAndEncrypt,
    decryptValidatorKeys,
    testWholeEncryptDecryptFlow
} = require('./listeners');

const {validateJsonFile} = require('./utils/validateFile')
// const {checkIfKeysAreStale, updateStaleKeys} = require('./utils/staleKeysManager')



function createWindow() {
    // Create a new window
    const window = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        nodeIntegration: false, 
        webPreferences: {
            sandbox: true,
            devtools:true,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    // Event listeners on the window
    window.webContents.on("did-finish-load", () => {
        window.show();
        window.focus();
    });

    // Load our HTML file
    if (isDevelopment) {
        console.log("Running Dev");
        window.loadURL("http://localhost:40992");
        window.webContents.openDevTools();

    } else {
        console.log("Running Prod");
        window.loadURL(`file://${__dirname}/../react/index.html`);
        // window.loadFile("src/dist/index.html");
    }
    /**
     * Set the Permission Request Handler to deny all permissions requests
     */
    window.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        console.log("Rejecting Permission Request: " + permission);
        return callback(false);
    });
}

// This method is called when Electron
// has finished initializing
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


// Register IPC Listeners
ipcMain.on("req-gen-node-operator-keys", genNodeOperatorKeystores);  
ipcMain.on("req-new-mnemonic", genMnemonic);
ipcMain.on("req-select-folder-path", listenSelectFolder);
ipcMain.on("req-select-file-path", listenSelectJsonFile);
ipcMain.on("req-gen-val-keys-and-encrypt", genValidatorKeysAndEncrypt);
ipcMain.on("req-decrypt-val-keys", decryptValidatorKeys);

// Validating Files
ipcMain.on("req-validate-file", (event, args) => {
    const [path, fileType] = args
    const result = validateJsonFile(path, fileType)
    event.sender.send(`receive-validate-${fileType}-results`, [result.isValid, result.errors])
})

// Check for Stale Keys
ipcMain.on("req-check-for-stale-keys", async (event, args) => {
    const stakeInfoPath = args[0]
    // const staleKeys = await checkIfKeysAreStale(stakeInfoPath)
    const staleKeys = []
    event.sender.send("receive-stale-keys-report", staleKeys)
})
ipcMain.on("req-update-stale-keys", async (event, args) => {
    // const stakeInfoPath = args[0]
    // const result = await updateStaleKeys(stakeInfoPath)
    const result = true;
    event.sender.send("receive-update-stale-keys-report", result)
})



ipcMain.on("copy-to-clipboard", (event, arg) => {
    const text = arg[0]
    clipboard.writeText(text)
})
ipcMain.on("req-open-folder", (event, arg) => {
    const folder = arg[0]
    console.log(folder[0])
    shell.openPath(folder)
})

// Called when the staker presses "Finish" on the finish step.
ipcMain.on("staker-finish", (event, arg) => {
    clipboard.clear();
    app.quit();
})




// ipcMain.on("req-build-public-staker-file", listenBuildStakerJson);
