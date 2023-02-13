import React, {useState} from 'react';
import { Box, Center, ScaleFade, Button, VStack, Text, HStack, Flex, NumberInput, NumberInputField, InputRightElement,
    InputGroup,InputLeftAddon, Input, InputRightAddon, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper


} from '@chakra-ui/react';
import raisedWidgetStyle from '../styleClasses/widgetBoxStyle';
import darkBoxWithBorderStyle from '../styleClasses/darkBoxWithBorderStyle';

import EtherFiNumberInput from './EtherFiNumberInput';
import { COLORS } from '../styleClasses/constants';


const MAX_KEYS = "10000"

const GenerateKeysWidget: React.FC = () => {
    const [numKeys, setNumKeys] = useState<string>("500");
    const [connectedWallet, setConnectedWallet] = useState("0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA") // hardcoded for now
    const [savePath, setSavePath] = useState<string>("")

    const generateKeys = () => {
        // Send request to backend to make the public and private key files
        console.log(`connectedWallet: ${connectedWallet}`)
        window.api.reqGenNodeOperatorKeys(numKeys, connectedWallet);
    }

    const selectSavePath = () => {
        window.api.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
          setSavePath(path)
        })
        window.api.reqSelectFolder();    
      }

  return (
    <Center>
        <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
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

        <Box maxW={'800px'} sx={darkBoxWithBorderStyle} bg="#2b2852">
        <HStack spacing='5px'mb="5px">
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
        <NumberInputField  color="#A3A3A3" width="422px" height="48px" placeholder="Enter Amount"/>
        <InputRightElement  children={<Box height="32px" width="50px" mr="44px" onClick={() => setNumKeys(MAX_KEYS)}><Button bg={COLORS.primaryBlue}>Max</Button></Box>} />
        </NumberInput>
        </InputGroup>
        <Center mt="5px">
            <Button colorScheme='blue' onClick={selectSavePath}>Select Path</Button>
        </Center>
        {savePath &&
            <HStack spacing='10px'>
            <Text fontSize='18px' as='b' color="white">Path:</Text>
            <Text fontSize='14px' color={COLORS.textSecondary}>{savePath}</Text>
            </HStack>
        }

        </Box>
            <Box>
            <Center>
                <Button isDisabled={Number(numKeys) < 1 || Number(numKeys) > Number(MAX_KEYS) || savePath == ""} bg="white" color="black" onClick={generateKeys}>Generate Keys</Button>
            </Center>
        </Box>
        </VStack>
        </Box>
    </Center>
  )
}


export default GenerateKeysWidget
