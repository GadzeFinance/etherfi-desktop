const { z, ZodError } = require('zod')
const  { readFileSync } = require ('fs')
const logger = require('./logger')

const SCHEMAS = {
  "EncryptedValidatorKeys": z.array( 
    z.object({
      encryptedKeystoreName: z.string(),
      encryptedValidatorKey: z.string(),
      encryptedPassword: z.string(),
      stakerPublicKey: z.string().length(130),
      nodeOperatorPublicKey: z.string().length(130),
      etherfiDesktopAppVersion: z.string().length(5),
    }).required().strict(),
  ),

  "NodeOperatorPrivateKeystore": z.object({
      iv: z.string().length(32),
      salt: z.string(),
      data: z.string(),
      etherfiDesktopAppVersion: z.string().length(5),
    }).required().strict(),

  "StakeInfo": z.array(
     z.object({
      validatorID: z.number().min(0),
      bidderPublicKey: z.string().length(130),
      withdrawalSafeAddress: z.string().length(42),
      etherfiDesktopAppVersion: z.string().length(5),
    }).required().strict(),
  )
}

function validateJsonFile(path, schema) {
  logger.info(`'validateJsonFile': Validating ${path}, against Schema ${schema}`)
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
      logger.error(`'validateJsonFile' Error parsing ${JSON.stringify(errorsAsArray)}`)
      return { isValid: false, errors: [...errorsAsArray] }
    }
  } catch (error) {
    logger.error(`'validateJsonFile' Error parsing ${JSON.stringify(errorsAsArray)}`)
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
