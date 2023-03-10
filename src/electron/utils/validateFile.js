const { z, ZodError } = require('zod')
const  { readFileSync } = require ('fs')

const SCHEMAS = {
  "EncryptedValidatorKeys": z.array( 
    z.object({
      encryptedKeystoreName: z.string(),
      encryptedValidatorKey: z.string(),
      encryptedPassword: z.string(),
      stakerPublicKey: z.string().length(130),
      nodeOperatorPublicKey: z.string().length(130),
    }).required()
  ),

  "NodeOperatorPrivateKeystore": z.object({
      iv: z.string().length(32),
      salt: z.string(),
      data: z.string(),
    }).required(),

  "StakeInfo": z.array(
     z.object({
      validatorID: z.number().min(0),
      bidderPublicKey: z.string().length(130),
      withdrawalSafeAddress: z.string().length(42),
    }).required()
  )
}

function validateJsonFile(path, schema) {
  var json;
  var parseResult
  try {
    const rawData = readFileSync(path)
    json = JSON.parse(rawData)
  } catch (error) {
    return { isValid: false, errors: [`Could Not Read Path ${path}`, error] }
  }
  try {
    parseResult = SCHEMAS[schema].safeParse(json)
    if (!parseResult.success) {
      const errorsAsArray = convertZodErrors(parseResult.error)
      return { isValid: false, errors: [...errorsAsArray] }
    }
  } catch (error) {
    return { isValid: false, errors: [`safeParse Failed for path: ${path}`, error] }
  }
  return { isValid: true, errors: [] }
}

const convertZodErrors = (error) => {
    return error.issues.map(i => `field=${i.path[0]}, value=${i.message}`)
}

module.exports = { 
  validateJsonFile,
};
