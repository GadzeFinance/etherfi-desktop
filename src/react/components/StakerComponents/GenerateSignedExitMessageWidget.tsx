import React, { useState } from 'react';
import {
    Box, Center, Button, VStack, Text,
    HStack, NumberInput, NumberInputField,
    InputRightElement, InputGroup, Input,
} from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import successBoxStyle from '../../styleClasses/successBoxStyle';
import darkBoxWithBorderStyle from '../../styleClasses/darkBoxWithBorderStyle';
import { COLORS } from '../../styleClasses/constants';
import SavedFileBox from '../SavedFileBox'
import PasswordInput from '../PasswordInput'
import EtherFiSpinner from '../EtherFiSpinner';
import SelectFile from '../SelectFile';
import SelectSavePathButton from '../SelectSavePathButton';


// THINGS WE NEED: Validator Key
// Password for Validator Key
// Validator Index

const MAX_KEYS = 7000

const GenerateSignedExitMessageWidget: React.FC = () => {
    const [validatorKeyFilePath, setValidatorKeyFilePath] = useState<string>("")
    const [validatorKeyPassword, setValidatorKeyPassword] = useState<string>("")
    const [savePath, setSavePath] = useState<string>("")
    const [validatorIndex, setValidatorIndex] = useState<string>("")

    const selectSavePath = () => {
        window.fileSystemApi.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
            setSavePath(path)
        })
        window.fileSystemApi.reqSelectFolderPath();
    }

    return (
        <Center>
            <Box sx={raisedWidgetStyle} bg="#2b2852">

                <VStack
                    spacing={2}
                    align='stretch'
                >
                    <Box>
                        <Text fontSize='18px' as='b' color="white">Generate Signed Voluntary Exit Message</Text>
                    </Box>

                    <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                        <VStack
                            spacing={4}
                            align='stretch'
                        >
                            <Box>
                                <Text mb="5px" fontSize='14px' as='b' color="white">Validator Key</Text>
                                <SelectFile
                                    fileName="EncryptedValidatorKeys"
                                    reqFileValidaton={window.validateFilesApi.validateEncryptedValidatorKeysJson}
                                    receiveValidatonResults={window.validateFilesApi.receiveEncryptedValidatorKeysValidationResults}
                                    setFilePath={setValidatorKeyFilePath}
                                    filePath={validatorKeyFilePath} />
                            </Box>
                            <Box>
                                <Text fontSize='14px' as='b' color="white"> Validator Key Password</Text>
                                <PasswordInput password={validatorKeyPassword} setPassword={setValidatorKeyPassword} isPasswordValid={false} setIsPasswordValid={() => null} shouldDoValidation={false} />
                            </Box>
                            <Box>
                                <Text fontSize='14px' as='b' color="white"> Validator Index</Text>
                                <InputGroup>
                                    <NumberInput width="100%"
                                        borderColor={COLORS.lightPurple}
                                        color="white"
                                        onChange={(newValStr: React.SetStateAction<string>, _newValuNum: any) => setValidatorIndex(newValStr)}
                                    >
                                        <NumberInputField value={validatorIndex} placeholder="Enter Validator Index" />
                                    </NumberInput>
                                </InputGroup>
                            </Box>
                            <Box>
                                <Text color="white" opacity={'0.7'} align="center">
                                    {savePath}
                                </Text>
                            </Box>
                        </VStack>
                    </Box>
                    <Box>
                        <Center>
                            <HStack spacing='10px' mb="5px">
                                <SelectSavePathButton savePath={savePath} setSavePath={setSavePath}></SelectSavePathButton>
                                <Button variant="white-button"
                                    _disabled={{ bg: "grey.dark", _hover: { bg: "grey.dark" } }}>
                                    Decrypt Validator Keys
                                </Button>
                            </HStack>
                        </Center>
                    </Box>
                </VStack>
            </Box >
        </Center >
    )
}


export default GenerateSignedExitMessageWidget
