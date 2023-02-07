import { z, ZodError } from 'zod'

/*
  the zod schema below should be able to validate most parts of the deposit data
  example deposit data:
  [
    {
        "pubkey": "a25d1301865f2b5423fae053b13e9ea1125b7cfbf4707142cb6e421035a0e0f9728793c6fd069c9eb3aea57bd2e7e405",
        "withdrawal_credentials": "00aca63a0db05a4ccdf329493116d7dd8992ad6443392ad5f8428b190be8220a",
        "amount": 32000000000,
        "signature": "9844faba74db77105495098168a77a58c2a0f53ebc66c63f70dbff777053e98786b6ac063a7756f3ec8e0275fdfb9be10d951d8983007bceff8eaf4a744b672df95f716adfa507609796dc26ff5a81c577557ed9ff881e42a1c16da12ace5ca6",
        "deposit_message_root": "62f2d9d1b9a61c05f9a61d681e674d291c2d4d46bfac1c2afb7bd2f893c9d4ca",
        "deposit_data_root": "fbf0801cfbb330629d7c0df419257199db076a1976479e8a3d43743d6e481ba2",
        "fork_version": "00001020",
        "network_name": "goerli",
        "deposit_cli_version": "2.3.0"
    }
  ]
*/
export const SCHEMAS = {
    "EncryptedValidatorKeys": z.object({
        encryptedValKeysArray: z.string().array().nonempty(),
        stakerPubKeysArray: z.string().array().nonempty(),
    }).required(),

    "NodeOperatorKeys": z.object({
        pubKeyArray: z.string().array().nonempty(),
        privKeyArray: z.string().array().nonempty(),
    }).required()
}

async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      if (event && event.target && typeof event.target.result === 'string') {
        resolve(JSON.parse(event.target.result))
      } else {
        // in the unusual case that this code executes, we send a empty array
        // since that will trigger the validation flow that returns
        // { isValid: false, errors: ['no valid deposit data found'] }
        resolve(JSON.parse(JSON.stringify([])))
      }
    }
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsText(file)
  })
}

export const validateUploadedFiles = async (files, expectedFile, schema) => {
  const [file] = files
  if (!file) {
    return { isValid: false, errors: [`${expectedFile} not found!`] }
  }
  if (file) {
    const parsedJsonFile = await parseJsonFile(file)

    const parseResult = schema.safeParse(parsedJsonFile)
    if (!parseResult.success) {
        const errorsAsArray = convertZodErrors(parseResult.error)
        return { isValid: false, errors: [...errorsAsArray] }
    }
    return { isValid: true, errors: [] }
  }
  return { isValid: false, errors: [] }
}

const convertZodErrors = (error) => {
    return error.issues.map(i => `field=${i.path[0]}, value=${i.message}`)
}
