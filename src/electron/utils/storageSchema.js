const schema = {
    passwordSet: {
        type: "boolean",
        default: true,
    },
    passwordHash: {
        type: "string",
        default: "",
    },
    validatorPassword: {
        type: "string",
        default: "",
    },
    operatorPassword: {
        type: "string",
        default: "",
    },
    stakerAddresses: {
        type: "object",
        properties: {
            stakerAddress: {
                type: "object",
                properties: {
                    mnemonicCount: {
                        type: "integer",
                        default: 1,
                    },
                    mnemonics: {
                        type: "object",
                        properties: {
                            mnemonicID: {
                                // Key is auto increment, value is mnemonic
                                type: "string",
                                default: "",
                            },
                        },
                    },
                    validators: {
                        type: "object",
                        properties: {
                            validatorID: {
                                // Value will be the keystore file
                                type: "string",
                                default: "",
                            },
                        },
                    },
                },
            },
        },
    },
    validatorAddresses: {
        type: "object",
        properties: {
            validatorAddress: {
                type: "object",
                properties: {
                    privateKey: {
                        // Public Key is the Key, private key is the value
                        type: "string",
                        default: "",
                    },
                },
            },
        },
    },
    historyPages: {
        type: "object",
        properties: {
            page: {
                type: "object",
                properties: {
                    recordCount: {
                        type: "number",
                        default: 0
                    },
                    records: {
                        type: "object",
                        properties: {
                            timestamp: {
                                type: "string",
                                default: ""
                            }
                        } 
                    }
                }
            }
        }
    },
    historyPageCount: {
        type: "number",
        default: 0
    }
};

module.export = schema;
