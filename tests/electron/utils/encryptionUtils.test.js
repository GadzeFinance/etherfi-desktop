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

  // This function generates a random hexDigit other than the given digit
  const randomHexDigit = (digit) => {
    const hexDigits = "0123456789abcdef".split("")
    const randomPos = crypto.randomInt(0, 16)
    const randomDigit = hexDigits[randomPos]
    return randomDigit === digit ? hexDigits[(randomPos + 1) % 16] : randomDigit;
  }

  // This function modifies a random digit in the given hex string
  const modifyDigit = (hexString) => {
    const randomPos = crypto.randomInt(0, hexString.length)
    const modifyTo = randomHexDigit(hexString[randomPos])
    const modifiedHexString = hexString.slice(0, randomPos) + modifyTo + hexString.slice(randomPos + 1)
    return modifiedHexString; 
  }

  // This function modifies a random digit in the cipher text
  const modifyCipherText = (data) => {
    const parts = data.split(":")
    const [iv, cipherText, authTag] = parts;
    const modifiedCiphertext = modifyDigit(cipherText)
    return iv + modifiedCiphertext + authTag; 
  }

  // This function modifies a random digit in the auth tag
  const modifyAuthTag = (data) => {
    const parts = data.split(":")
    const [iv, cipherText, authTag] = parts;
    const modifiedAuthTag = modifyDigit(authTag)
    return iv + cipherText + modifiedAuthTag; 
  }

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

    it("should encrypt and decrypt validator key (json string) correctly", () => {
      const validatorKey = `{"crypto":{"kdf":{"function":"scrypt","params":{"dklen":32,"n":262144,"r":8,"p":1,"salt":"0463d22d68366006c3e61d551255d49cc16339d5445bdaa1a59f5dae30dac3e7"},"message":""},"checksum":{"function":"sha256","params":{},"message":"cd87b4b75a340239782919e7d81bf253dd9c7fd7d8956e83436b0e48ea8301dc"},"cipher":{"function":"aes-128-ctr","params":{"iv":"9ad66f5a200048b7c1933dc0a39adcc9"},"message":"c469bf7d17899947ec78c4fe31676f3814a7bf696a85384aff4f0f7b4fbc9945"}},"description":"","pubkey":"96cadf6d4ff420ffd36c6f3d389564ad8f64a42c3c8e6b9ad7ef119b245248cef57ae4191f4c91163c23d79f4e77c275","path":"m/12381/3600/1/0/0","uuid":"61504df3-f306-4b65-ab7b-726ffa73bcbe","version":4}`
      const encryptedData = encrypt(validatorKey, ENCRYPTION_KEY)
      const decryptedData = decrypt(encryptedData, ENCRYPTION_KEY)
      
      expect(decryptedData).toBe(validatorKey)
    })

    it("should not accept modified encrypted data (fails authentication)", () => {
      const validatorKey = `{"crypto":{"kdf":{"function":"scrypt","params":{"dklen":32,"n":262144,"r":8,"p":1,"salt":"0463d22d68366006c3e61d551255d49cc16339d5445bdaa1a59f5dae30dac3e7"},"message":""},"checksum":{"function":"sha256","params":{},"message":"cd87b4b75a340239782919e7d81bf253dd9c7fd7d8956e83436b0e48ea8301dc"},"cipher":{"function":"aes-128-ctr","params":{"iv":"9ad66f5a200048b7c1933dc0a39adcc9"},"message":"c469bf7d17899947ec78c4fe31676f3814a7bf696a85384aff4f0f7b4fbc9945"}},"description":"","pubkey":"96cadf6d4ff420ffd36c6f3d389564ad8f64a42c3c8e6b9ad7ef119b245248cef57ae4191f4c91163c23d79f4e77c275","path":"m/12381/3600/1/0/0","uuid":"61504df3-f306-4b65-ab7b-726ffa73bcbe","version":4}`
      const encryptedData = encrypt(validatorKey, ENCRYPTION_KEY)
      const modifiedEncryptedData = modifyCipherText(encryptedData);
      const decryptedData = () => decrypt(modifiedEncryptedData, ENCRYPTION_KEY)
    
      expect(decryptedData).toThrow()
    })


    it("should not accept encrypted data with incorrect authTag", () => {
      const validatorKey = `{"crypto":{"kdf":{"function":"scrypt","params":{"dklen":32,"n":262144,"r":8,"p":1,"salt":"0463d22d68366006c3e61d551255d49cc16339d5445bdaa1a59f5dae30dac3e7"},"message":""},"checksum":{"function":"sha256","params":{},"message":"cd87b4b75a340239782919e7d81bf253dd9c7fd7d8956e83436b0e48ea8301dc"},"cipher":{"function":"aes-128-ctr","params":{"iv":"9ad66f5a200048b7c1933dc0a39adcc9"},"message":"c469bf7d17899947ec78c4fe31676f3814a7bf696a85384aff4f0f7b4fbc9945"}},"description":"","pubkey":"96cadf6d4ff420ffd36c6f3d389564ad8f64a42c3c8e6b9ad7ef119b245248cef57ae4191f4c91163c23d79f4e77c275","path":"m/12381/3600/1/0/0","uuid":"61504df3-f306-4b65-ab7b-726ffa73bcbe","version":4}`
      const encryptedData = encrypt(validatorKey, ENCRYPTION_KEY)
      const modifiedEncryptedData = modifyAuthTag(encryptedData);
      const decryptedData = () => decrypt(modifiedEncryptedData, ENCRYPTION_KEY)
    
      expect(decryptedData).toThrow()
    })

    it("should not accept encrypted data with no authTag", () => {
      const validatorKey = `{"crypto":{"kdf":{"function":"scrypt","params":{"dklen":32,"n":262144,"r":8,"p":1,"salt":"0463d22d68366006c3e61d551255d49cc16339d5445bdaa1a59f5dae30dac3e7"},"message":""},"checksum":{"function":"sha256","params":{},"message":"cd87b4b75a340239782919e7d81bf253dd9c7fd7d8956e83436b0e48ea8301dc"},"cipher":{"function":"aes-128-ctr","params":{"iv":"9ad66f5a200048b7c1933dc0a39adcc9"},"message":"c469bf7d17899947ec78c4fe31676f3814a7bf696a85384aff4f0f7b4fbc9945"}},"description":"","pubkey":"96cadf6d4ff420ffd36c6f3d389564ad8f64a42c3c8e6b9ad7ef119b245248cef57ae4191f4c91163c23d79f4e77c275","path":"m/12381/3600/1/0/0","uuid":"61504df3-f306-4b65-ab7b-726ffa73bcbe","version":4}`
      const encryptedData = encrypt(validatorKey, ENCRYPTION_KEY)
      const removeAuthTag = (data) => {
        const parts = data.split(":")
        const [iv, cipherText, authTag] = parts;
        return iv + cipherText; 
      }
      const modifiedEncryptedData = removeAuthTag(encryptedData);
      const decryptedData = () => decrypt(modifiedEncryptedData, ENCRYPTION_KEY)
    
      expect(decryptedData).toThrow()
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

    it("should not accept modified encrypted data (fails authentication)", () => {
      const encryptedJSON = encryptPrivateKeys(jsonData, PASSWORD)
      const modifiedData = modifyDigit(encryptedJSON.data)
      encryptedJSON.data = modifiedData
      const decryptWithModifiedData = () =>
        decryptPrivateKeys(encryptedJSON, PASSWORD)
    
      expect(decryptWithModifiedData).toThrow()
    })

    it("should not accept json with no auth tag", () => {
      const encryptedJSON = encryptPrivateKeys(jsonData, PASSWORD)
      delete encryptedJSON.authTag
      const decryptWithNoTag = () =>
        decryptPrivateKeys(encryptedJSON, PASSWORD)
    
      expect(decryptWithNoTag).toThrow()
    })


  })

})
