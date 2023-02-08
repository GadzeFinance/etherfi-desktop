const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");
const isDevelopment = process.env.NODE_ENV === "development";
const { 
    genNodeOperatorKeystores,
    genMnemonic,
    listenSelectFiles,
    listenBuildStakerJson, 
    testWholeEncryptDecryptFlow
} = require('./listeners');


function createWindow() {
    // Create a new window
    const window = new BrowserWindow({
        width: 800,
        height: 600,
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
        window.loadURL("http://localhost:40992");
        window.webContents.openDevTools();

    } else {
        console.log("Running Prod");
        window.loadFile("src/dist/index.html");
    }
    /**
     * Set the Permission Request Handler to deny all permissions requests
     */
    // app.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    //     console.log("HERE?")
    //     return callback(false);
    // });
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

ipcMain.on("req-select-files", listenSelectFiles);
ipcMain.on("req-build-public-staker-file", listenBuildStakerJson);
