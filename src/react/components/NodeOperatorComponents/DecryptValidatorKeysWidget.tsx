import React, { useState } from 'react';
import { Box, Center, Button, VStack, Text, HStack, Flex } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import darkBoxWithBorderStyle from '../../styleClasses/darkBoxWithBorderStyle';
import SelectFile from '../SelectFile'
import PasswordInput from '../PasswordInput';
import { IconSavedFile, IconCheckMark } from '../Icons';
import { COLORS } from '../../styleClasses/constants'
import successBoxStyle from '../../styleClasses/successBoxStyle';
import { useFormContext } from 'react-hook-form';


const DecryptValidatorKeysWidget: React.FC = () => {
    const [savePath, setSavePath] = useState<string>("")
    const [encryptedValKeysFilePath, setEncryptedValidatorKeysFilePath] = useState<string>("")
    const [privKeysFilePath, setPrivKeysFilePath] = useState<string>("")
    const [privKeysPassword, setPrivKeysPassword] = useState<string>("")
    const [isPrivKeysPasswordValid, setIsPrivKeysPasswordValid] = useState<boolean>(false)
    const [filesCreatedPath, setFilesCreatedPath] = useState<string>("");

    const [keysDecrypted, setKeysDecrypted] = useState<boolean>(false)
    const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false)
    const [incorrectPrivKeys, setIncorrectPrivKeys] = useState<boolean>(false)

    const { watch } = useFormContext()
    const { decryptKeysPassword } = watch()

    // Select path to save the decrypted keys too.
    const selectSavePath = () => {
        window.fileSystemApi.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
            setSavePath(path)
        })
        window.fileSystemApi.reqSelectFolderPath();
    }

    const decryptValidatorKeys = () => {
        window.encryptionApi.receiveDecryptReport(
            (event: Electron.IpcMainEvent, result: number, path: string, errorMessage: string) => {
                switch (result) {
                    // Error codes are defined in src/electron/constants.js 
                    // Decrypt Success
                    case 0: {
                        setFilesCreatedPath(path)
                        setKeysDecrypted(true)
                        console.log("Decrypt Completed Successfully!")
                        break;
                    }
                    // Incorrect Password
                    case 1: {
                        setIncorrectPassword(true)
                        console.error("Incorrect Password")
                        console.error(errorMessage)
                        break;
                    }
                    // Incorrect Private Keys
                    case 2: {
                        setIncorrectPrivKeys(true)
                        setIncorrectPassword(false)
                        console.error("Incorrect Private Keys")
                        console.error(errorMessage)
                        break;
                    }
                    // Could Not Save Files
                    case 3: {
                        // We should never really end up here
                        console.error("Could note save files to keys")
                        console.error(errorMessage)
                        break;
                    }
                    // Unknown Error 
                    case 4: {
                        console.error("Unknown Error")
                        console.error(errorMessage)

                    }
                }
            })
        window.encryptionApi.reqDecryptValidatorKeys(encryptedValKeysFilePath, privKeysFilePath, decryptKeysPassword, savePath);
    }

    const clearState = () => {
        setSavePath("")
        setEncryptedValidatorKeysFilePath("")
        setPrivKeysFilePath("")
        setPrivKeysPassword("")
        setIsPrivKeysPasswordValid(false)

        setKeysDecrypted(false)
        setIncorrectPassword(false)
        setIncorrectPrivKeys(false)
    }

    const openFilesCreatedFolder = () => {
        window.fileSystemApi.reqOpenFolder(filesCreatedPath);
    }

    return (
        <Center>
            {
                !keysDecrypted && (
                    <Box sx={raisedWidgetStyle} bg="#2b2852">

                        <VStack
                            spacing={2}
                            align='stretch'
                        >
                            <Box>
                                <Text fontSize='18px' as='b' color="white">Decrypt Validator Keys</Text>
                            </Box>

                            <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                                <VStack
                                    spacing={4}
                                    align='stretch'
                                >
                                    <Box>
                                        <Text mb="5px" fontSize='14px' as='b' color="white">Encrypted Validator Keys</Text>
                                        <SelectFile
                                            fileName="EncryptedValidatorKeys"
                                            reqFileValidaton={window.validateFilesApi.validateEncryptedValidatorKeysJson}
                                            receiveValidatonResults={window.validateFilesApi.receiveEncryptedValidatorKeysValidationResults}
                                            setFilePath={setEncryptedValidatorKeysFilePath}
                                            filePath={encryptedValKeysFilePath} />
                                    </Box>
                                    <Box>
                                        <Text fontSize='14px' as='b' color="white">Etherfi Private Keys</Text>
                                        <SelectFile
                                            fileName="privateEtherFiKeystore"
                                            reqFileValidaton={window.validateFilesApi.validateNodeOperatorPrivateKeystoreJson}
                                            receiveValidatonResults={window.validateFilesApi.receiveNodeOperatorPrivateKeystoreValidationResults}
                                            setFilePath={setPrivKeysFilePath}
                                            filePath={privKeysFilePath}
                                        />
                                        {incorrectPrivKeys && (<Text color='red.warning' fontSize="12px">Incorrect Private Keys: The private keys you selected cannot decrypt these validator keys. Are you using the correct private key file?</Text>)}

                                    </Box>
                                    <Box>
                                        <PasswordInput isPasswordValid={isPrivKeysPasswordValid} setIsPasswordValid={setIsPrivKeysPasswordValid} shouldDoValidation={true} registerText='decryptKeysPassword'/>
                                        {incorrectPassword && (<Text color='red.warning' fontSize="12px">Incorrect Password: Please enter the password you entered when you generated the privateEtherfiKeystore file.</Text>)}
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
                                        <Button variant="white-button" onClick={selectSavePath}>{savePath ? "Change Path" : "Select Save Path"}</Button>
                                        <Button variant="white-button" isDisabled={!savePath || !encryptedValKeysFilePath || !privKeysFilePath || !isPrivKeysPasswordValid}
                                            onClick={decryptValidatorKeys}>
                                            Decrypt Validator Keys
                                        </Button>
                                    </HStack>
                                </Center>
                            </Box>
                        </VStack>
                    </Box >
                )
            }
            {
                keysDecrypted && (
                    <Box sx={successBoxStyle} bg="#2b2852">
                        <Flex
                            padding={'24px'}
                            direction={'column'}
                            gap="16px"
                            bgColor="purple.dark"
                            height="full"
                            width={'full'}
                            borderRadius="lg"
                        >
                            <VStack spacing={3}>
                                <Text color={'white'} fontSize="large" fontWeight={'semibold'} align="center">
                                    Congrats! Your validator keys have been successfully decrypted!
                                </Text>
                                <Box sx={darkBoxWithBorderStyle} bg="#2b2852">

                                    <Text fontSize="14px" color={COLORS.textSecondary}>
                                        Your validator keys are located here:
                                    </Text>

                                    <Box sx={successBoxStyle}>
                                        <HStack>
                                            <IconSavedFile boxSize="8" />
                                            <Text _hover={{ textDecoration: 'underline' }} fontSize='14px' flex="auto" color='white' onClick={openFilesCreatedFolder}>
                                                {filesCreatedPath}
                                            </Text>
                                            <IconCheckMark boxSize="5" />
                                        </HStack>
                                    </Box>
                                </Box>
                                <Center>
                                    <Button variant='white-button' onClick={clearState}>Finish</Button>
                                </Center>
                            </VStack>

                        </Flex>
                    </Box>

                )
            }

        </Center >
    )
}


export default DecryptValidatorKeysWidget
