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
  ),

  "ValidatorKeystore": z.object({
     crypto: z.object({
      kdf: z.object({
        function: z.string(),
        params: z.object({
          dklen: z.number(),
          n: z.number(),
          r: z.number(),
          p: z.number(),
          salt: z.string(),
        }),
        message: z.string(),
      }),
      checksum: z.object({
        function: z.string(),
        params: z.object({}),
        message: z.string(),
      }),
      cipher: z.object({
        function: z.string(),
        params: z.object({
          iv: z.string(),
        }),
        message: z.string(),
      })
    }),
    description: z.string(),
    pubkey: z.string(),
    path: z.string(),
    uuid: z.string(),
    version: z.number(),
   }).required()
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
