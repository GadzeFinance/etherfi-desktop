import React, { useState } from 'react';
import {
    Box, Center, Button, VStack, Text,
    HStack, NumberInput, NumberInputField,
    InputRightElement, InputGroup,
} from '@chakra-ui/react';
import raisedWidgetStyle from '../styleClasses/widgetBoxStyle';
import successBoxStyle from '../styleClasses/successBoxStyle';
import darkBoxWithBorderStyle from '../styleClasses/darkBoxWithBorderStyle';
import { COLORS } from '../styleClasses/constants';
import SavedFileBox from './SavedFileBox'


const MAX_KEYS = "10000"

const GenerateKeysWidget: React.FC = () => {
    const [numKeys, setNumKeys] = useState<string>("500");
    const [savePath, setSavePath] = useState<string>("")
    const [keysGenerated, setKeysGenerated] = useState<boolean>(false)
    const [pubKeysFilePath, setPubKeysFilePath] = useState<string>("")
    const [privKeysFilePath, setPrivKeysFilePath] = useState<string>("")



    const generateKeys = () => {
        window.api.receiveNOKeysConfirmation((event: Electron.IpcMainEvent, filePaths: Array<string>) => {
            setPubKeysFilePath(filePaths[0])
            setPrivKeysFilePath(filePaths[1])
            setKeysGenerated(true)
        })
        // Send request to backend to make the public and private key files
        window.api.reqGenNodeOperatorKeys(numKeys, savePath);
    }

    const selectSavePath = () => {
        window.api.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
            setSavePath(path)
        })
        window.api.reqSelectFolderPath();
    }

    const clearState = () => {
        setNumKeys("500")
        setSavePath("")
        setKeysGenerated(false)
        setPubKeysFilePath("")
        setPrivKeysFilePath("")
    }

    return (
        <Center>
            {!keysGenerated && (
                <Box sx={raisedWidgetStyle} bg="#2b2852">
                    <VStack
                        spacing={4}
                        align='stretch'
                    >
                        <Box>
                            <HStack spacing='10px'>
                                <Text fontSize='18px' as='b' color="white">Generate Keys</Text>
                                <Text fontSize='14px' color={COLORS.textSecondary}>Can be done once per wallet</Text>
                            </HStack>
                        </Box>

                        <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                            <HStack spacing='5px' mb="5px">
                                <Text fontSize='14px' as='b' color="white">Number of Keys</Text>
                                <Text fontSize='11px' color={COLORS.textSecondary}>(10000 max)</Text>
                            </HStack>

                            <InputGroup>
                                <NumberInput borderColor={COLORS.lightPurple} color="white" placeholder="Enter Amount"
                                    min={1} max={10000} value={numKeys}
                                    onChange={(newValStr, newValuNum) => setNumKeys(newValStr)}
                                    keepWithinRange={false}
                                    clampValueOnBlur={false}
                                >
                                    <NumberInputField color="#A3A3A3" width="422px" height="48px" placeholder="Enter Amount" />
                                    <InputRightElement children={<Box height="32px" width="50px" mr="44px" onClick={() => setNumKeys(MAX_KEYS)}><Button bg={COLORS.primaryBlue}>Max</Button></Box>} />
                                </NumberInput>
                            </InputGroup>
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
                        <Box>
                            <Center>
                                <HStack spacing='10px' mb="5px">
                                    <Button variant="white-button" onClick={selectSavePath}>{savePath ? "Change Path" : "Select Save Path"}</Button>
                                    <Button variant="white-button-generate" isDisabled={Number(numKeys) < 1 || Number(numKeys) > Number(MAX_KEYS) || savePath == ""}
                                        _disabled={{ bg: "grey.dark", _hover: { bg: "grey.dark" } }} onClick={generateKeys}>
                                        Generate Keys
                                    </Button>
                                </HStack>
                            </Center>
                        </Box>
                    </VStack>
                </Box>

            )}
            {keysGenerated && (
                <Box sx={successBoxStyle} bg="#2b2852">
                    <VStack
                        spacing={4}
                        align='stretch'
                    >
                        <Box>
                            <HStack spacing='10px'>
                                <Text fontSize='18px' as='b' color="white">Saved</Text>
                                <Text fontSize='14px' color={COLORS.textSecondary}>The key files have been saved to your machine</Text>
                            </HStack>
                        </Box>

                        <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                            <HStack spacing='5px' mb="5px">
                                <Text fontSize='14px' as='b' color="white">Folder: </Text>
                                <Text fontSize='11px' color={COLORS.textSecondary}>{savePath}</Text>
                            </HStack>
                            <SavedFileBox filePath={pubKeysFilePath} />
                            <SavedFileBox filePath={privKeysFilePath} />
                        </Box>
                        <Box>
                            <Center>
                                <Button variant="white-button" onClick={clearState}>Finish</Button>
                            </Center>
                        </Box>
                    </VStack>
                </Box>

            )}
        </Center>
    )
}


export default GenerateKeysWidget
