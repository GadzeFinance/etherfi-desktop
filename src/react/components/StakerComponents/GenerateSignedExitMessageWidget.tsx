import React, { useState } from 'react';
import {
    Box, Center, Button, VStack, Text,
    HStack, NumberInput, NumberInputField,
    InputGroup,
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


const GenerateSignedExitMessageWidget: React.FC = () => {
    const [validatorKeyFilePath, setValidatorKeyFilePath] = useState<string>("")
    const [validatorKeyPassword, setValidatorKeyPassword] = useState<string>("")
    const [validatorIndex, setValidatorIndex] = useState<string>("")
    const [exitEpoch, setExitEpoch] = useState<string>("")
    const [savePath, setSavePath] = useState<string>("")
    const [exitMessageFilePath, setExitMessageFilePath] = useState<string>("")

    // UI State Variables
    const [messageGenerating, setMessageGenerating] = useState<boolean>(false)
    const [messageGenerated, setMessageGenerated] = useState<boolean>(false)

    // TODO: MAKE ERROR MESSAGES BETTER!! I.E See if password is wrong for keystore
    // Right now we just show that a general error occured if the message generation fails
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)

    const clearState = () => {
        setValidatorKeyFilePath("")
        setValidatorKeyPassword("")
        setValidatorIndex("")
        setExitEpoch("")
        setSavePath("")
        setExitMessageFilePath("")
        setMessageGenerating(false)
        setMessageGenerated(false)
        setShowErrorMessage(false)
    }

    const requestSignedExitMessage = () => {
        window.exitMessageApi.receiveSignedExitMessageConfirmation((event: Electron.IpcMainEvent, result: number, path: string, errorMessage: string) => {
            console.log(`signedExitMessageGeneration Result: ${result}`)
            if (result === 0) {
                console.log("Signed Exit Message Gen Complete. Files saved too: " + path)
                setExitMessageFilePath(path)
                setMessageGenerated(true)
                setShowErrorMessage(false)
            } else {
                console.error("Error Generating Exit Message")
                console.error(errorMessage)
                setShowErrorMessage(true)
            }
            setMessageGenerating(false)
        })
        setMessageGenerating(true)
        window.exitMessageApi.reqGenSignedExitMessage(validatorKeyFilePath, validatorKeyPassword, validatorIndex, exitEpoch, savePath)

    }

    return (
        <Center>
            <Box sx={raisedWidgetStyle} bg="#2b2852">
                {/* Widget Data Input Screen */}
                {!messageGenerating && !messageGenerated && (
                    <Box sx={raisedWidgetStyle} bg="#2b2852">
                        <VStack
                            spacing={2}
                            align='stretch'
                        >
                            {showErrorMessage && (
                                <Text fontSize="12px" ml="5px" color="red.warning">Generating Exit Message Failed. Make sure the information you have entered into the fields below is correct.</Text>
                            )}
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
                                            reqFileValidaton={window.validateFilesApi.validateKeystoreJson}
                                            receiveValidatonResults={window.validateFilesApi.receiveKeystoreValidationResults}
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
                                                value={validatorIndex}
                                                onChange={(newValStr: React.SetStateAction<string>, _newValuNum: any) => setValidatorIndex(newValStr)}
                                            >
                                                <NumberInputField value={validatorIndex} placeholder="Enter Validator Index" />
                                            </NumberInput>
                                        </InputGroup>
                                    </Box>
                                    <Box>
                                        <HStack>
                                            <Text fontSize='14px' as='b' color="white"> Exit Epoch</Text>
                                            <Text fontSize='14px' color={COLORS.textSecondary}>The epoch you want the Validator to exit in</Text>
                                        </HStack>

                                        <InputGroup>
                                            <NumberInput width="100%"
                                                borderColor={COLORS.lightPurple}
                                                color="white"
                                                value={exitEpoch}
                                                onChange={(newValStr: React.SetStateAction<string>, _newValuNum: any) => setExitEpoch(newValStr)}
                                            >
                                                <NumberInputField value={validatorIndex} placeholder="Enter Epoch" />
                                            </NumberInput>
                                        </InputGroup>
                                    </Box>

                                    <Box>
                                        {savePath &&
                                            <VStack
                                                mt="10px"
                                                spacing={1}
                                                align='stretch'
                                            >
                                                <Text fontSize='14px' as='b' color="white">Selected Folder:</Text>
                                                <Text fontSize='11px' color={COLORS.textSecondary} maxW="400px" ml={2}>{savePath}</Text>
                                            </VStack>
                                        }
                                    </Box>
                                </VStack>
                            </Box>
                            <Box>
                                <Center>
                                    <HStack spacing='10px' mb="5px">
                                        <SelectSavePathButton savePath={savePath} setSavePath={setSavePath}></SelectSavePathButton>
                                        <Button variant="white-button"
                                            onClick={requestSignedExitMessage}
                                            isDisabled={!validatorKeyFilePath || !validatorKeyPassword || !validatorIndex || !exitEpoch || !savePath}
                                            _disabled={{ bg: "grey.dark", _hover: { bg: "grey.dark" } }}>
                                            Generate Exit Message
                                        </Button>
                                    </HStack>
                                </Center>
                            </Box>
                        </VStack>
                    </Box>
                )}

                {/* Spinner When Exit Message is Loading */}
                <EtherFiSpinner text="Generating Voluntary Exit Message" loading={messageGenerating} />

                {/* Widget Success Screen */}
                {messageGenerated && !messageGenerating && (
                    <Box sx={successBoxStyle} bg="#2b2852">
                        <VStack
                            spacing={3}
                            align='stretch'
                        >
                            <Box p='10px'>
                                <HStack spacing='10px'>
                                    <Text fontSize='18px' as='b' color="white">Saved</Text>
                                    <Text fontSize='14px' color={COLORS.textSecondary}>The signedExitMessage.json has been saved to your machine</Text>
                                </HStack>
                            </Box>

                            <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                                <HStack spacing='5px' mb="5px">
                                    <Text fontSize='14px' as='b' color="white">Folder: </Text>
                                    <Text fontSize='11px' color={COLORS.textSecondary}>{savePath}</Text>
                                </HStack>
                                <SavedFileBox filePath={exitMessageFilePath} />
                            </Box>
                            <Box>
                                <Center>
                                    <Button variant="white-button" onClick={clearState}>Finish</Button>
                                </Center>
                            </Box>
                        </VStack>
                    </Box>
                )}
            </Box >
        </Center >
    )
}


export default GenerateSignedExitMessageWidget
