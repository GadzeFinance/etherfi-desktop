import React, {useState} from 'react';
import { Box, Center, ScaleFade, Button, VStack } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import EtherFiNumberInput from '../EtherFiNumberInput';
import GenerateKeysWidget from '../GenerateKeysWidget';

interface TabProps {
    tabIndex: number;
  }
  

const NodeOperatorTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
    const [numKeys, setNumKeys] = useState(500);
    const [connectedWallet, setConnectedWallet] = useState("0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA") // hardcoded for now
    const [savePath, setSavePath] = useState<string>("")
    const [encryptedValKeysFile, setEncryptedValKeysFile] = useState()
    const [nodeOperatorKeysFile, setNodeOperatorKeysFile] = useState()

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
    <>
        <GenerateKeysWidget/>
       
    
    </>
        
  )
}


export default NodeOperatorTab

            {/* THIS IS WHERE THE DECRYPT STEP COULD GO? */}
             {/* <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
             <VStack
                 spacing={4}
                 align='stretch'
             >
            </VStack>
             </Box> */}