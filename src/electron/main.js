const { app, BrowserWindow, ipcMain, clipboard, shell } = require("electron")
const logger = require("./utils/logger")

const path = require("path")
const isDevelopment = process.env.NODE_ENV === "development"
const {
    genNodeOperatorKeystores,
    genMnemonic,
    listenSelectFolder,
    listenSelectJsonFile,
    genValidatorKeysAndEncrypt,
    decryptValidatorKeys,
    fetchStoredValidators,
    getStakerAddress,
    getStakerAddressList,
    isPasswordSet,
    setPassword,
    validatePassword,
    fetchStoredMnemonics,
    generateStakeRequestOnImportKeys,
    storageDecrypt,
    setAllStakerAddresses,
} = require("./listeners")

const { validateJsonFile } = require("./utils/validateFile")
const { standardResultCodes, decryptResultCodes } = require("./constants")
const { generateSignedExitMessage } = require("./utils/Eth2Deposit")
const {
    getHistoryRecordsByPage,
    getHistoryPageCount,
} = require("./utils/historyUtils")

function createWindow() {
    // Create a new window
    const window = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        nodeIntegration: false,
        webPreferences: {
            sandbox: true,
            devtools: true,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js"),
        },
    })

    // Event listeners on the window
    window.webContents.on("did-finish-load", () => {
        window.show()
        window.focus()
    })

    // Load our HTML file
    if (isDevelopment) {
        logger.info("Starting App in Development Mode")
        window.loadURL("http://localhost:40992")
        window.webContents.openDevTools()
    } else {
        logger.info("Starting App in Production Mode")
        window.loadURL(`file://${__dirname}/../react/index.html`)
        // window.loadFile("src/dist/index.html");
    }
    /**
     * Set the Permission Request Handler to deny all permissions requests
     */
    window.webContents.session.setPermissionRequestHandler(
        (webContents, permission, callback) => {
            logger.info(`Rejecting Permission Request: ${permission}`)
            return callback(false)
        }
    )
}

// This method is called when Electron
// has finished initializing
app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

// Register IPC Event handlers

/* ------------------------------------------------------------- */
/* --------------- Encryption Flow API Handlers ---------------- */
/* ------------------------------------------------------------- */
// Returns (result, pubkeyFilePath| '', privKeyFilePath | '', errorMessag e| '') to frontend
ipcMain.on("req-gen-node-operator-keys", async (event, args) => {
    const [numKeys, saveFolder, privKeysPassword, address, dbPassword] = args
    try {
        const [pubKeysFilePath, privKeysFilePath] =
            await genNodeOperatorKeystores(
                numKeys,
                saveFolder,
                privKeysPassword,
                address,
                dbPassword
            )
        event.sender.send(
            "receive-NO-keys-generated-result",
            standardResultCodes.SUCCESS,
            pubKeysFilePath,
            privKeysFilePath,
            ""
        )
    } catch (error) {
        logger.error("Error Generating Encryption Keys:", error)
        event.sender.send(
            "receive-NO-keys-generated-result",
            standardResultCodes.ERROR,
            "",
            "",
            error.message
        )
    }
})

// Returns (result, mnemonic | '', errorMessage | '') to frontend
ipcMain.on("req-new-mnemonic", async (event, args) => {
    const language = args[0]
    try {
        const mnemonic = await genMnemonic(language)
        event.sender.send(
            "receive-new-mnemonic",
            standardResultCodes.SUCCESS,
            mnemonic,
            ""
        )
    } catch (error) {
        logger.error("Error Requesting Mnemonic:", error)
        event.sender.send(
            "receive-new-mnemonic",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

// Return (result, path_to_saved_folder | '', errorMessage | '') to frontend
ipcMain.on("req-gen-val-keys-and-encrypt", async (event, args) => {
    var [
        mnemonic,
        password,
        stakeInfo,
        address,
        mnemonicOption,
        importPassword,
        stakingCode,
        stakingMode,
    ] = args
    try {
        const savePath = await genValidatorKeysAndEncrypt(
            event,
            mnemonic,
            password,
            stakeInfo,
            address,
            mnemonicOption,
            importPassword,
            stakingCode,
            stakingMode
        )
        event.sender.send(
            "receive-key-gen-confirmation",
            standardResultCodes.SUCCESS,
            savePath,
            ""
        )
    } catch (error) {
        logger.error("Error Generating Validator Keys and Encrypting:", error)
        event.sender.send(
            "receive-key-gen-confirmation",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-get-stake-request-on-import-keys", async (event, args) => {
    var [address, keystores, stakeInfo, keystoreNames, password, databasePassword] = args
    try {
        const stakeReqJSON = await generateStakeRequestOnImportKeys(address, keystores, stakeInfo, keystoreNames, password, databasePassword)
        event.sender.send(
            "stake-request-on-import-keys",
            standardResultCodes.SUCCESS,
            stakeReqJSON,
            ""
        )
    } catch (error) {
        logger.error("Error generating stake requests:", error)
        event.sender.send(
            "stake-request-on-import-keys",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

// Return (result, path_to_saved_folder | '', errorMessage| '') to frontend
ipcMain.on("req-decrypt-val-keys", async (event, args) => {
    try {
        const saveFolder = await decryptValidatorKeys(event, args)
        event.sender.send(
            "receive-decrypt-val-keys-report",
            decryptResultCodes.SUCCESS,
            saveFolder,
            ""
        )
    } catch (error) {
        logger.error("Error Decrypting Validator Keys:", error)
        event.sender.send(
            "receive-decrypt-val-keys-result",
            decryptResultCodes.UNKNOWN_ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-stored-mnemonics", async (event, args) => {
    const [address, password] = args
    try {
        let mnemonics = await fetchStoredMnemonics(address, password)
        mnemonics = mnemonics ?? {}
        event.sender.send(
            "receive-req-stored-mnemonics-confirmation",
            standardResultCodes.SUCCESS,
            JSON.stringify(mnemonics),
            ""
        )
    } catch (error) {
        logger.error("Error fetching stored mnemonic: ", error)
        event.sender.send(
            "receive-req-stored-mnemonics-confirmation",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-stored-validators", async (event, args) => {
    const [address, password] = args
    try {
        const validators = await fetchStoredValidators(address, password)
        event.sender.send(
            "receive-stored-validators",
            standardResultCodes.SUCCESS,
            JSON.stringify(validators),
            ""
        )
    } catch (error) {
        logger.error("Error fetching stored validators: ", error)
        event.sender.send(
            "receive-stored-validators",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-get-staker-address", async (event, args) => {
    try {
        const [password] = args
        const stakers = await getStakerAddress(password)
        event.sender.send(
            "receive-get-staker-address",
            standardResultCodes.SUCCESS,
            JSON.stringify(stakers),
            ""
        )
    } catch (error) {
        logger.error("Error getting staker addresses: ", error)
        event.sender.send(
            "receive-get-staker-address",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("stake-request", async (event, stakeRequestJson) => {
    try {
        event.sender.send(
            "stake-request",
            standardResultCodes.SUCCESS,
            stakeRequestJson,
            ""
        )
    } catch (error) {
        logger.error("Error getting stake request: ", error)
        event.sender.send(
            "stake-request",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

/* ------------------------------------------------------------- */
/* ------------ Signed Exit Message Generation ----------------- */
/* ------------------------------------------------------------- */
// Return (result, exitMessageFilePath | '', errorMessage| '') to frontend
ipcMain.on("req-signed-exit-message", async (event, args) => {
    // Get Arguments
    const [
        usingStoredKeys,
        selectedValidator,
        keystorePath,
        keystorePassword,
        validatorIndex,
        epoch,
        saveFolder,
        chain,
        databasePassword,
        address,
    ] = args

    try {
        const exitMessageFilePath = await generateSignedExitMessage(
            usingStoredKeys,
            selectedValidator,
            chain,
            keystorePath,
            keystorePassword,
            validatorIndex,
            epoch,
            saveFolder,
            databasePassword,
            address
        )
        event.sender.send(
            "receive-signed-exit-message-confirmation",
            standardResultCodes.SUCCESS,
            exitMessageFilePath,
            ""
        )
    } catch (error) {
        logger.error("Error Generating Signed Exit Message:", error)
        event.sender.send(
            "receive-signed-exit-message-confirmation",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

/* ------------------------------------------------------------- */
/* ----------------- Validating Files Schemas ------------------ */
/* ------------------------------------------------------------- */
ipcMain.on("req-validate-file", (event, args) => {
    const [path, fileType] = args
    const result = validateJsonFile(path, fileType)
    event.sender.send(`receive-validate-${fileType}-results`, [
        result.isValid,
        result.errors,
    ])
})

/* ------------------------------------------------------------- */
/* ----------------- Selecting Files Handlers ------------------ */
/* ------------------------------------------------------------- */
ipcMain.on("req-select-folder-path", listenSelectFolder)
ipcMain.on("req-select-file-path", listenSelectJsonFile)

/* ------------------------------------------------------------- */
/* ----------------- Miscellaneous  Handlers ------------------- */
/* ------------------------------------------------------------- */
ipcMain.on("copy-to-clipboard", (event, arg) => {
    const text = arg[0]
    clipboard.writeText(text)
})
ipcMain.on("req-open-folder", (event, arg) => {
    const folder = arg[0]
    shell.openPath(folder)
})
ipcMain.on("req-show-file", (event, arg) => {
    const file = arg[0]
    shell.showItemInFolder(file)
})
// Called when the staker presses "Finish" on the finish step.
ipcMain.on("staker-finish", (event, arg) => {
    clipboard.clear()
    app.quit()
})

/* -------------------- DATABASE API ---------------------- */

ipcMain.on("req-set-password", async (event, args) => {
    const [password] = args
    try {
        await setPassword(password)
        event.sender.send(
            "receive-set-password-result",
            standardResultCodes.SUCCESS,
            ""
        )
    } catch (error) {
        logger.error("Error setting password:", error)
        event.sender.send(
            "receive-set-password-result",
            standardResultCodes.ERROR,
            error.message
        )
    }
})

ipcMain.on("req-validate-password", async (event, args) => {
    const [password] = args
    try {
        const valid = await validatePassword(password)
        event.sender.send(
            "receive-validate-password-result",
            standardResultCodes.SUCCESS,
            valid,
            ""
        )
    } catch (error) {
        logger.error("Error validating password:", error)
        event.sender.send(
            "receive-validate-password-result",
            standardResultCodes.ERROR,
            false,
            error.message
        )
    }
})

ipcMain.on("req-is-password-set", async (event, args) => {
    try {
        const passwordSet = await isPasswordSet()
        event.sender.send(
            "receive-is-password-set",
            standardResultCodes.SUCCESS,
            passwordSet,
            ""
        )
    } catch (error) {
        logger.error("Error validating password:", error)
        event.sender.send(
            "receive-is-password-set",
            standardResultCodes.ERROR,
            false,
            error.message
        )
    }
})

ipcMain.on("req-all-staker-addresses", async (event, args) => {
    const [password] = args
    try {
        const stakerAddresses = await getStakerAddress(password)
        event.sender.send(
            "receive-all-staker-addresses",
            standardResultCodes.SUCCESS,
            stakerAddresses,
            ""
        )
    } catch (error) {
        logger.error("Error getAllStakerAddresses:", error)
        event.sender.send(
            "receive-all-staker-addresses",
            standardResultCodes.ERROR,
            {},
            error.message
        )
    }
})

ipcMain.on("req-get-staker-address-list", async (event, args) => {
    try {
        const [dbPassword] = args
        const stakerAddressList = await getStakerAddressList(dbPassword)
        event.sender.send(
            "receive-get-staker-address-list",
            standardResultCodes.SUCCESS,
            stakerAddressList,
            ""
        )
    } catch (error) {
        logger.error("Error getAllStakerAddresses:", error)
        event.sender.send(
            "receive-get-staker-address-list",
            standardResultCodes.ERROR,
            {},
            error.message
        )
    }
})

ipcMain.on("req-decrypt", async (event, args) => {
    try {
        const [cipherText, password] = args
        const decrypted = await storageDecrypt(cipherText, password)
        event.sender.send(
            "receive-decrypt",
            standardResultCodes.SUCCESS,
            decrypted,
            ""
        )
    } catch (error) {
        logger.error("Error decrypting:", error)
        event.sender.send(
            "receive-decrypt",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-is-password-set", async (event, args) => {
    try {
        const passwordSet = await isPasswordSet()
        event.sender.send(
            "receive-is-password-set",
            standardResultCodes.SUCCESS,
            passwordSet,
            ""
        )
    } catch (error) {
        logger.error("Error checking password status", error)
        event.sender.send(
            "receive-is-password-set",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-set-all-staker-addresses", async (event, args) => {
    const [stakerAddresses, dbPassword] = args
    try {
        await setAllStakerAddresses(stakerAddresses, dbPassword)
        event.sender.send(
            "receive-set-all-staker-addresses",
            standardResultCodes.SUCCESS,
            "",
            ""
        )
    } catch (error) {
        logger.error("Error setting all staker addresses", error)
        event.sender.send(
            "receive-set-all-staker-addresses",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-get-password", async (event, args) => {
    const [password] = args
    try {
        const passwordSet = await getValidatorPassword(password)
        event.sender.send(
            "receive-get-password",
            standardResultCodes.SUCCESS,
            passwordSet,
            ""
        )
    } catch (error) {
        logger.error("Error getting password", error)
        event.sender.send(
            "receive-get-password",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-history-page", async (event, args) => {
    const [page, databasePassword] = args
    try {
        const historyRecords = await getHistoryRecordsByPage(page, databasePassword)
        event.sender.send(
            "receive-history-page",
            standardResultCodes.SUCCESS,
            historyRecords,
            ""
        )
    } catch (error) {
        logger.error("Error getting password", error)
        event.sender.send(
            "receive-history-page",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})

ipcMain.on("req-history-page-count", async (event, args) => {
    try {
        const historyPageCount = await getHistoryPageCount()
        event.sender.send(
            "receive-history-page-count",
            standardResultCodes.SUCCESS,
            historyPageCount,
            ""
        )
    } catch (error) {
        logger.error("Error getting password", error)
        event.sender.send(
            "receive-history-page-count",
            standardResultCodes.ERROR,
            "",
            error.message
        )
    }
})
