const schema = {
    stakers: {
      type: 'object',
      properties: {
        count: { type: 'integer', default: 0 },
        data: {
          type: 'object',
          properties: {
            'id': {
              type: 'object',
              properties: {
                mnemonic: { type: 'string' },
                password: { type: 'string' }
              }
            }
          }
        }
      }
    },
    validators: {
      type: 'object',
      properties: {
        count: { type: 'integer', default: 0 },
        data: {
          type: 'object',
          properties: {
            'id': {
              type: 'object',
              properties: {
                validatorID: { type: 'integer' },
                fileData: { type: 'string' }
              }
            }
          }
        }
      }
    },
    operatorPrivateKeys: {
      type: 'object',
      properties: {
        count: { type: 'integer', default: 0 },
        data: {
          type: 'object',
          properties: {
            'id': {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                privateKey: { type: 'string' }
              }
            }
          }
        }
      }
    },
    importedValidatorKeys: {
      type: 'object',
      properties: {
        count: { type: 'integer', default: 0 },
        data: {
          type: 'object',
          properties: {
            'id': {
              type: 'object',
              properties: {
                validatorID: { type: 'integer' },
                password: { type: 'string' },
                encryptedKeys: { type: 'string' }
              }
            }
          }
        }
      }
    }
};

module.export = schema;

