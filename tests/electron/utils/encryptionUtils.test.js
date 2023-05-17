const crypto = require("crypto")
const {
  encrypt,
  decrypt,
  encryptPrivateKeys,
  decryptPrivateKeys,
} = require("../../../src/electron/utils/encryptionUtils")

describe("Encryption", () => {
  const ENCRYPTION_KEY = crypto.randomBytes(32)
  const PASSWORD = "test_password"

  describe("encrypt & decrypt", () => {
    it("should encrypt and decrypt text correctly", () => {
      const text = "This is a sample text"
      const encryptedText = encrypt(text, ENCRYPTION_KEY)
      const decryptedText = decrypt(encryptedText, ENCRYPTION_KEY)

      expect(decryptedText).toBe(text)
    })

    it("should not decrypt with incorrect encryption key", () => {
      const text = "This is another sample text"
      const encryptedText = encrypt(text, ENCRYPTION_KEY)
      const incorrectKey = crypto.randomBytes(32).toString("hex")
      const decryptedText = () => decrypt(encryptedText, incorrectKey)

      expect(decryptedText).toThrow()
    })
  })

  describe("encryptPrivateKeys & decryptPrivateKeys", () => {
    const jsonData = {
      key1: "value1",
      key2: "value2",
    }

    it("should encrypt and decrypt JSON data correctly", () => {
      const encryptedJSON = encryptPrivateKeys(jsonData, PASSWORD)
      const decryptedJSON = decryptPrivateKeys(encryptedJSON, PASSWORD)

      expect(decryptedJSON).toEqual(jsonData)
    })

    it("should not decrypt with incorrect password", () => {
      const encryptedJSON = encryptPrivateKeys(jsonData, PASSWORD)
      const incorrectPassword = "wrong_password"
      const decryptWithWrongPassword = () =>
        decryptPrivateKeys(encryptedJSON, incorrectPassword)

      expect(decryptWithWrongPassword).toThrow()
    })
  })
})
