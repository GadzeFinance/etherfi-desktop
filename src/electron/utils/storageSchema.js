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
    stakerAddress: {
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
                                type: "object",
                                properties: {
                                    mnemonic: {
                                        type: "string",
                                        default: ""
                                    },
                                    password: {
                                        type: "string",
                                        default: ""
                                    }
                                }
                            },
                        },
                    },
                    validators: {
                        type: "object",
                        properties: {
                            validatorID: {
                                // Value will be the keystore file
                                type: "object",
                                properties: {
                                    keystore: {
                                        type: "string",
                                        default: ""
                                    },
                                    password: {
                                        type: "string",
                                        default: ""
                                    }
                                }
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
};

module.export = schema;
