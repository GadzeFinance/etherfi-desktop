const { Database } = require("../../../src/electron/utils/storage")
const Store = require("electron-store");
const schema = require("../../../src/electron/utils/storageSchema")

describe("Test Basic Flow", () => {


    const store = new Store({ schema });
    const db = new Database(store)
    const dbPassword = "abc"

    test("set and test password", () => {
        db.setPassword(dbPassword);
        expect(db.isPasswordSet()).toBe(true)
        expect(db.validatePassword("abc")).toBe(true)
        expect(db.validatePassword("xyz")).toBe(false)
    })

    test("add and get staker", () => {
        db.addStakerAddress("0xABC")
        db.addStakerAddress("0xDEF")

        const arrayOfStakers = Object.keys(db.getAllStakerAddresses(dbPassword))
        expect(arrayOfStakers).toContain("0xABC")
    })

    test("add mnemonic", () => {
        db.addMnemonic("0xABC", "Apple Bull Cat", "Password123", dbPassword)
        db.addMnemonic("0xABC", "Angle Back Curl", "Passwordabc", dbPassword)
        db.addMnemonic("0xDEF", "Dog Elephant Fox", "Password321", dbPassword)

        abcMnemonics = db.getMnemonics("0xABC", dbPassword)
        defMnemonics = db.getMnemonics("0xDEF", dbPassword)

        expect(abcMnemonics["Apple Bull Cat"]["mnemonic"]).toBe("Apple Bull Cat")
        expect(abcMnemonics["Apple Bull Cat"]["password"]).toBe("Password123")
        expect(abcMnemonics["Angle Back Curl"]["mnemonic"]).toBe("Angle Back Curl")
        expect(abcMnemonics["Angle Back Curl"]["password"]).toBe("Passwordabc")
        expect(defMnemonics["Dog Elephant Fox"]["mnemonic"]).toBe("Dog Elephant Fox")
        expect(defMnemonics["Dog Elephant Fox"]["password"]).toBe("Password321")
        expect(Object.keys(abcMnemonics).length).toBe(2)
        expect(Object.keys(defMnemonics).length).toBe(1)

    })

    test("add validator", () => {
        const stakerOneAddress = "0xd3F9bdF051CBaC21EB267e6542a47374bE4DDcAa"
        db.addStakerAddress(stakerOneAddress)
        const keyStoreFile = {
            "crypto": {
                "kdf": {
                    "function": "scrypt",
                    "params": {
                        "dklen": 32,
                        "n": 262144,
                        "r": 8,
                        "p": 1,
                        "salt": "af70cf08778b0875d0f58e934f67a5f1384c458a7be34a09d4f3f780cc379806"
                    },
                    "message": ""
                },
                "checksum": {
                    "function": "sha256",
                    "params": {},
                    "message": "ea286911d8036023dd1bf626127bd69c16de2657a2f00292187e6c8eef2d0614"
                },
                "cipher": {
                    "function": "aes-128-ctr",
                    "params": {
                        "iv": "aee77c2fc9547496a479767d3baac326"
                    },
                    "message": "cfbd6846793fa05578f7231f793f7b8b97d6132ee336be3af1e31ec1655d983a"
                }
            },
            "description": "",
            "pubkey": "99930bb6bda6889331dd71291a0050b44828dc48952992197548550e18ea479c373664b1b4b6714fec0b24f21a2af190",
            "path": "m/12381/3600/0/0/0",
            "uuid": "808fe096-c580-4199-a6fb-a056dd1e5470",
            "version": 4
        }
        const keyStoreFileString = JSON.stringify(keyStoreFile)
        const keyStorePassword = "EncryptionIsFun"
        db.addValidators(stakerOneAddress, 26894, keyStoreFileString, keyStorePassword, dbPassword)
        const returnedValidator = db.getValidators(stakerOneAddress, dbPassword)
        expect(returnedValidator["26894"]).toBeDefined()
        expect(returnedValidator["26895"]).toBeUndefined()
        expect(returnedValidator["26894"]["keystore"]).toBe(keyStoreFileString)
        expect(returnedValidator["26894"]["password"]).toBe(keyStorePassword)
    })
})
