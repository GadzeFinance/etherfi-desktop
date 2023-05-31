const schema = {
    passwordSet: {
        type: "boolean",
        default: true,
    },
    passwordSalt: {
        type: "string",
        default: "",
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
        default: 1
    }
};

module.export = schema;
