import React, { useState } from 'react';
import { Box, Center, Button, VStack, Text, HStack, Flex } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import darkBoxWithBorderStyle from '../../styleClasses/darkBoxWithBorderStyle';
import SelectFile from '../SelectFile'
import PasswordInput from '../PasswordInput';
import { IconSavedFile, IconCheckMark } from '../Icons';
import { COLORS } from '../../styleClasses/constants'
import successBoxStyle from '../../styleClasses/successBoxStyle';


const DecryptValidatorKeysWidget: React.FC = () => {
    const [savePath, setSavePath] = useState<string>("")
    const [keysDecrypted, setKeysDecrypted] = useState<boolean>(false)
    const [encryptedValKeysFilePath, setEncryptedValidatorKeysFilePath] = useState<string>("")
    const [privKeysFilePath, setPrivKeysFilePath] = useState<string>("")
    const [privKeysPassword, setPrivKeysPassword] = useState<string>("")
    const [isPrivKeysPasswordValid, setIsPrivKeysPasswordValid] = useState<boolean>(false)
    const [filesCreatedPath, setFilesCreatedPath] = useState<string>("");

    const selectSavePath = () => {
        window.api.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
            setSavePath(path)
        })
        window.api.reqSelectFolderPath();
    }

    const decryptValidatorKeys = () => {
        window.api.receiveDecryptComplete((event: Electron.IpcMainEvent, path: string) => {
            console.log("DECRYPT COMPLETE!")
            setFilesCreatedPath(path[0])
            setKeysDecrypted(true)
        })
        window.api.reqDecryptValidatorKeys(encryptedValKeysFilePath, privKeysFilePath, privKeysPassword, savePath);
    }

    const clearState = () => {
        setSavePath("")
        setKeysDecrypted(false)
        setEncryptedValidatorKeysFilePath("")
        setPrivKeysFilePath("")
        setPrivKeysPassword("")
        setIsPrivKeysPasswordValid(false)
    }

    const openFilesCreatedFolder = () => {
        console.log(filesCreatedPath)
        window.api.reqOpenFolder(filesCreatedPath);
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
                                            filePath={privKeysFilePath} />
                                    </Box>
                                    <Box>
                                        <PasswordInput password={privKeysPassword} setPassword={setPrivKeysPassword} isPasswordValid={isPrivKeysPasswordValid} setIsPasswordValid={setIsPrivKeysPasswordValid} />

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
                                        <Button variant="white-button" onClick={selectSavePath}>{savePath ? "Change Path" : "Select Save Path"}</Button>
                                        <Button variant="white-button" isDisabled={!savePath || !encryptedValKeysFilePath || !privKeysFilePath || !isPrivKeysPasswordValid}
                                            _disabled={{ bg: "grey.dark", _hover: { bg: "grey.dark" } }} onClick={decryptValidatorKeys}>
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
