
const standardResultCodes ={ 
    SUCCESS: 0,
    ERROR: 1, 
}

const decryptResultCodes = {
    SUCCESS: 0,
    BAD_PASSWORD: 1,
    BAD_PRIVATE_KEYS: 2,
    SAVE_FILE_ERROR: 3,
}

module.exports = {standardResultCodes,decryptResultCodes}