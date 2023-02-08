import React, {useState} from 'react';
import { Box, Center, ScaleFade, Button, VStack } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import EtherFiNumberInput from '../EtherFiNumberInput';
import {validateUploadedFiles, SCHEMAS} from '../../utils/schemaValidations';

interface TabProps {
    tabIndex: number;
  }
  

const NodeOperatorTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
    const [numKeys, setNumKeys] = useState(500);
    const [connectedWallet, setConnectedWallet] = useState("0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA") // hardcoded for now
    const [encryptedValKeysFile, setEncryptedValKeysFile] = useState()
    const [nodeOperatorKeysFile, setNodeOperatorKeysFile] = useState()

    const generateKeys = () => {
        // Send request to backend to make the public and private key files
        console.log(connectedWallet)
        window.api.reqGenNodeOperatorKeys(numKeys, connectedWallet);
    }


  return (
    <Center>
        <ScaleFade initialScale={0.5} in={tabIndex === 1}>

            <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
            <VStack
                spacing={4}
                align='stretch'
            >
             <Box>
                 <Center color="white">
                     Step 1
                 </Center>
                 <EtherFiNumberInput placeholder="Number of Keys:" value={numKeys}
                         setter={setNumKeys} MIN={1} MAX={1000}
                         increment={1}
                 />
             </Box>
             <Box>
             </Box>
             <Box>
                <Center>
                    <Button bg="green" color="white" onClick={generateKeys}>Generate Keystores</Button>
                </Center>
            </Box>
            </VStack>
            </Box>

            {/* THIS IS WHERE THE DECRYPT STEP COULD GO? */}
             {/* <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
             <VStack
                 spacing={4}
                 align='stretch'
             >
            </VStack>
             </Box> */}

            </ScaleFade>
        </Center>
  )

}

export default NodeOperatorTab