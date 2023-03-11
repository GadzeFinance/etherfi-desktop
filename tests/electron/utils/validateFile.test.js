const {validateJsonFile} = require('../../../src/electron/utils/validateFile')
const path = require('path');


describe('Validate StakeInfo.json file', () => {
    const validJsonFiles = ['valid-1.json', 'valid-2.json', 'valid-3.json']
    validJsonFiles.forEach((validFile) => {
        test(`${validFile}: Valid Json & correct Schema - Returns 0`, () => {
            const filePath = path.join(__dirname, `../../mockedData/StakeInfo/${validFile}`);
            const result = validateJsonFile(filePath, 'StakeInfo')
            expect(result.isValid).toBe(true)
          });
    })

    const invalidStakeInfoFiles = ['invalid-1.json', 'invalid-2.json', 'invalid-3.json']
    invalidStakeInfoFiles.forEach((invalidFile) => {
        test(`${invalidFile}: Valid Json & Invalid Schema - Returns 1`, () => {
            const filePath = path.join(__dirname, `../../mockedData/StakeInfo/${invalidFile}`);
            const result = validateJsonFile(filePath, 'StakeInfo')
            expect(result.isValid).toBe(false)
          });
    })
});

describe('Validating Invalid Json Files', () => {
    const invalidJson = ['invalidJson-1.json', 'invalidJson-2.json', 'invalidJson-3.json']
    invalidJson.forEach((invalidJsonFile) => {
        test(`${invalidJsonFile}: Invalid Json - Returns 2`, () => {
            const filePath = path.join(__dirname, `../../mockedData/StakeInfo/${invalidJsonFile}`);
            const result = validateJsonFile(filePath, 'StakeInfo')
            expect(result.isValid).toBe(false)
          });
    })
});

