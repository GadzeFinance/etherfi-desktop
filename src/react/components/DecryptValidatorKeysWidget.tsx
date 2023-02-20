import React, { useState } from 'react';
import { Box, Center, Button, VStack, Text, HStack } from '@chakra-ui/react';
import raisedWidgetStyle from '../styleClasses/widgetBoxStyle';
import darkBoxWithBorderStyle from '../styleClasses/darkBoxWithBorderStyle';
import SelectFile from './SelectFile'
import PasswordInput from './PasswordInput';



const DecryptValidatorKeysWidget: React.FC = () => {
    const [savePath, setSavePath] = useState<string>("")
    const [keysGenerated, setKeysGenerated] = useState<boolean>(false)
    const [encryptedValKeysFilePath, setencryptedValidatorKeysFilePath] = useState<string>("")
    const [privKeysFilePath, setPrivKeysFilePath] = useState<string>("")
    const [privKeysPassword, setPrivKeysPassword] = useState<string>("")
    const [isPrivKeysPasswordValid, setIsPrivKeysPasswordValid] = useState<boolean>(false)

    const selectSavePath = () => {
        window.api.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
            setSavePath(path)
        })
        window.api.reqSelectFolderPath();
    }

    const decryptValidatorKeys = () => {
        window.api.receiveDecryptComplete((event: Electron.IpcMainEvent, path: string) => {
            console.log("DECRYPT COMPLETE!")
            console.log(path)
        })
        window.api.reqDecryptValidatorKeys(encryptedValKeysFilePath, privKeysFilePath, privKeysPassword, savePath);
    }


    return (
        <Center>
            {
                !false && (
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
                                        <SelectFile setFilePath={setencryptedValidatorKeysFilePath} filePath={encryptedValKeysFilePath} />
                                    </Box>
                                    <Box>
                                        <Text fontSize='14px' as='b' color="white">Etherfi Private Keys</Text>
                                        <SelectFile setFilePath={setPrivKeysFilePath} filePath={privKeysFilePath} />
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
        </Center >
    )
}


export default DecryptValidatorKeysWidget
