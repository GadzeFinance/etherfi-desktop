import React, { useState } from 'react'
import { Button, Flex, Text, Center } from '@chakra-ui/react'
import {COLORS} from '../../../styleClasses/constants'
import WizardNavigator from '../WizardNavigator'

interface StepGenerateValKeysAndEncryptProps {
  goNextStep: () => void,
  goBackStep: () => void,
  savePath: string,
  setSavePath: (path: string) => void,
  mnemonic: string,
  password: string,
  stakeInfoPath: Object,
}

const StepGenerateValKeysAndEncrypt: React.FC<StepGenerateValKeysAndEncryptProps> = (props) => {

  const [generatingKeys, setGeneratingKeys] = useState(false)
  const [keysGenerated, setKeysGenerated] = useState(false)

  const selectSavePath = () => {
    window.api.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
      props.setSavePath(path)
    })
    window.api.reqSelectFolderPath();    
  }

  const generateEncryptedKeys = () => {
    window.api.receiveKeyGenConfirmation((event: Electron.IpcMainEvent, path: string) => {
      console.log("KEY GEN COMPLETE!")
      console.log("Files saved too: " + path)
      setGeneratingKeys(false)
      setKeysGenerated(true)
    })
    window.api.reqGenValidatorKeysAndEncrypt(props.mnemonic, props.password, props.savePath, props.stakeInfoPath);
    setGeneratingKeys(true)
  }

  return (
    <Flex
      padding={'24px'}
      direction={'column'}
      gap="16px"
      bgColor="purple.dark"
      height="full"
      width={'full'}
      borderRadius="lg"
    >
      <Text color={'white'} fontSize="2xl" fontWeight={'semibold'}>
        Create & Encrypt Validator Keys
      </Text>
      {!keysGenerated && (
        <>
        <Text color="white" opacity={'0.7'}>
          Select a folder to save your validator keystores and etherfi encrypted keys.
        </Text>
        <Center mt="5px">
              <Button colorScheme='blue' onClick={selectSavePath}>Select Path</Button>
        </Center>
        {props.savePath &&
          <>
            <Text fontSize='14px' as='b' color="white">Selected Path:</Text>
            <Text fontSize='14px' color={COLORS.textSecondary}>{props.savePath}</Text>
          </>
        }
      <WizardNavigator backVisible={true} goBackStep={props.goBackStep} nextVisible={true} goNextStep={generateEncryptedKeys} backText="Go Back" nextText="Generate & Encrypt Keys" 
                       nextProps={{isLoading:generatingKeys, loadingText:'Generating', variant:"wizard-button-generate", isDisabled:!props.savePath}}/>
      </>
      )
      } {
        keysGenerated && (
          <>
            <Text color="white" opacity={'0.7'}>
              Contragulations Your Validator Keys have been generated and encrypted!
              They are saved at {props.savePath}
            </Text>
          </>
        )
      }


    </Flex>
  )
}

export default StepGenerateValKeysAndEncrypt
