import React, { useState } from 'react';
import { Box, Center, ScaleFade, Input, Button, Text } from '@chakra-ui/react'
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle'

interface TabProps {
  tabIndex: number;
}

const StakerTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
  const [connectedWallet, setConnectedWallet] = useState("0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA") // hardcoded for now
  const [mnemonic, setMnemonic] = useState<string>("") // hardcoded for now
  const [password, setPassword] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("")

  const generateMnemonic = () => {
    window.api.receiveNewMnemonic((event:Electron.IpcMainEvent , args: [string]) => {
      const newMnemonic = args[0];
      setMnemonic(newMnemonic)
    })
    window.api.reqNewMnemonic("english");
  }

  const selectSavePath = () => {
    window.api.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
      setSavePath(path)
    })
    window.api.reqSelectFolder();    
  }

  const generateEncryptedKeys = () => {
    window.api.receiveKeyGenConfirmation((event: Electron.IpcMainEvent, path: string) => {
      console.log("KEY GEN COMPLETE!")
      console.log("Files saved too: " + path)
    })
    window.api.reqGenValidatorKeysAndEncrypt(connectedWallet, mnemonic, password, savePath);
  }


  return (
    <Center>
    <ScaleFade initialScale={0.5} in={tabIndex === 0}>
      <Box maxW={'800px'} sx={raisedWidgetStyle}>
      <Text color="White" fontSize='xl'> Step 1: Generate Mnemonic and save it somewhere safe"  </Text>
        <Center>
          <Button colorScheme='blue' onClick={generateMnemonic}>Generate Mnemonic</Button>
        </Center>
        <Center>
          <Text color="white">Mnemonic: {mnemonic}</Text>
        </Center>
      </Box>
      {mnemonic && 
        <Box maxW={'800px'} sx={raisedWidgetStyle}>
          <Text color="White" fontSize='xl'> Step 2: Select Path to save files too"  </Text>
          <Center>
            <Button colorScheme='blue' onClick={selectSavePath}>Select Path</Button>
          </Center>
          <Center>
          <Text color="white">Path: {savePath}</Text>
        </Center>
      </Box>
      }
      {savePath && 
        <Box maxW={'800px'} sx={raisedWidgetStyle}>
          <Text color="White" fontSize='xl'> Step 3: Input password and press "Generate and Encrypt Keys"  </Text>
          <Input variant='filled' 
            color="red.500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="password" 
            />
          <Center>
            <Button isDisabled={password == ""} colorScheme='blue' onClick={generateEncryptedKeys}>Generate and Encrypt Keys</Button>
          </Center>
      </Box>
      }

      </ScaleFade>
    </Center>
  )
}


export default StakerTab
