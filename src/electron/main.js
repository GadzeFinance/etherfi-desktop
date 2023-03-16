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
const { standardResultCodes, decryptResultCodes } = require('./resultCodes')


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

// Register IPC Event handlers

/* ------------------------------------------------------------- */
/* --------------- Encryption Flow API Handlers ---------------- */
/* ------------------------------------------------------------- */
ipcMain.on("req-gen-node-operator-keys", async (event, args) => {
    const [numKeys, saveFolder, privKeysPassword] = args
    try {
        const [pubKeysFilePath, privKeysFilePath] = await genNodeOperatorKeystores(numKeys, saveFolder, privKeysPassword)
        event.sender.send("receive-NO-keys-generated-result", standardResultCodes.SUCCESS, pubKeysFilePath, privKeysFilePath, '')

    } catch (error) {
        event.sender.send("receive-NO-keys-generated-result", standardResultCodes.ERROR, '', '', error.message)
    }
});

ipcMain.on("req-new-mnemonic", async (event, args) => {
    const language = args[0]
    try {
        const mnemonic = await genMnemonic(language)
        event.sender.send("receive-new-mnemonic", standardResultCodes.SUCCESS, mnemonic, '')
    } catch (error) {
        event.sender.send("receive-new-mnemonic", standardResultCodes.ERROR, '', error.message)
    }
});

ipcMain.on("req-gen-val-keys-and-encrypt",  async (event, args) => {
    var [mnemonic, password, folder, stakeInfoPath] = args
    try {
        const savePath = await genValidatorKeysAndEncrypt(mnemonic, password, folder, stakeInfoPath)
        event.sender.send("receive-key-gen-confirmation", standardResultCodes.SUCCESS, savePath , '')
    } catch (error) {
        event.sender.send("receive-key-gen-confirmation",  standardResultCodes.ERROR, '', error.message)
    }
});

ipcMain.on("req-decrypt-val-keys",  async (event, args) => {
    try {
        const saveFolder = await decryptValidatorKeys(event, args)
        event.sender.send("receive-decrypt-val-keys-report", decryptResultCodes.SUCCESS, saveFolder, '')
    } catch (error) {
        event.sender.send("receive-decrypt-val-keys-result", decryptResultCodes.UNKNOWN_ERROR, error.message)
    }
});


/* ------------------------------------------------------------- */
/* ----------------- Validating Files Schemas ------------------ */
/* ------------------------------------------------------------- */
ipcMain.on("req-validate-file", (event, args) => {
    const [path, fileType] = args
    const result = validateJsonFile(path, fileType)
    event.sender.send(`receive-validate-${fileType}-results`, [result.isValid, result.errors])
})

/* ------------------------------------------------------------- */
/* ----------------- Selecting Files Handlers ------------------ */
/* ------------------------------------------------------------- */
ipcMain.on("req-select-folder-path", listenSelectFolder);
ipcMain.on("req-select-file-path", listenSelectJsonFile);




/* ------------------------------------------------------------- */
/* ----------------- Miscellaneous  Handlers ------------------- */
/* ------------------------------------------------------------- */
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


/* ------------------------------------------------------------- */
/* --------------- Checking For Stale Keys --------------------- */
/* ------------------------------------------------------------- */
ipcMain.on("req-check-for-stale-keys", async (event, args) => {
    // const stakeInfoPath = args[0]
    // const staleKeys = await checkIfKeysAreStale(stakeInfoPath)
    // Stubbing this for now.
    const staleKeys = []
    event.sender.send("receive-stale-keys-report", staleKeys)
})

ipcMain.on("req-update-stale-keys", async (event, args) => {
    // const stakeInfoPath = args[0]
    // const result = await updateStaleKeys(stakeInfoPath)
    // Stubbing this for now.
    const result = true;
    event.sender.send("receive-update-stale-keys-report", result)
})
