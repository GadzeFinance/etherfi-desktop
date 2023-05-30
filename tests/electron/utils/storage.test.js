const { Database } = require("../../../src/electron/utils/storage")
const Store = require("electron-store");
const schema = require("../../../src/electron/utils/storageSchema")

describe("Test Basic Flow", () => {


    const store = new Store({ schema });
    const db = new Database(store)
    const dbPassword = "abc"

    test("set and test password", () => {
        db.setPassword(dbPassword);
        expect (db.isPasswordSet()).toBe(true)
        expect(db.validatePassword("abc")).toBe(true)
        expect(db.validatePassword("xyz")).toBe(false)
    })

    test("add and get staker", () => {
        db.addStakerAddress("0xABC")
        db.addStakerAddress("0xDEF")

        const arrayOfStakers = Object.keys(db.getAllStakerAddresses())
        expect(arrayOfStakers).toContain("0xABC")
    })

    test("add mnemonic", () => {
        db.addMnemonic("0xABC", "Apple Bull Cat", "Password123", dbPassword)
        db.addMnemonic("0xDEF", "Dog Elephant Fox", "Password321", dbPassword)

        abcMnemonics = db.getMnemonics("0xABC", dbPassword)
        defMnemonics = db.getMnemonics("0xDEF", dbPassword)

        

    })



})
