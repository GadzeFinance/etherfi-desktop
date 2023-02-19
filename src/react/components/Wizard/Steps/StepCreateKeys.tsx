import React, { useState } from 'react'
import { Button, Flex, Text, Center } from '@chakra-ui/react'
import WizardNavigator from '../WizardNavigator'
import IconKey from '../../Icons/IconKey'
import EtherFiSpinner from '../../EtherFiSpinner'



interface StepCreateKeysProps {
  goNextStep: () => void,
  goBackStep: () => void,
  savePath: string,
  setSavePath: (path: string) => void,
  mnemonic: string,
  password: string,
  stakeInfoPath: Object,
}

const StepCreateKeys: React.FC<StepCreateKeysProps> = (props) => {

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
      props.goNextStep()
    })
    window.api.reqGenValidatorKeysAndEncrypt(props.mnemonic, props.password, props.savePath, props.stakeInfoPath);
    setGeneratingKeys(true)
  }

  const backDetails = {
    text: "Back",
    visible: true,
  }

  const backProps = {
    onClick: props.goBackStep,
    variant: "back-button",
  }

  const nextDetails = {
    text: "Create Keys",
    visible: true,
  }

  const nextProps = {
    isDisabled: !props.savePath,
    onClick: generateEncryptedKeys,
    variant: "white-button",
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
      {!keysGenerated && !generatingKeys && (
        <>
          <Center>
            <IconKey boxSize='100' />
          </Center>
          <Text color={'white'} fontSize="2xl" fontWeight={'semibold'} align="center">
            Create Keys
          </Text>
          <Text color="white" opacity={'0.7'} align="center">
            Choose a folder where we should save your keys
          </Text>
          <Center>
            <Button variant="browse-folder-button" onClick={selectSavePath}>
              {!props.savePath ? "Browse Folders" : "Change Folder"}
            </Button>
          </Center>
          <Text color="white" opacity={'0.7'} align="center">
            Folder: {props.savePath}
          </Text>
          <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />
        </>
      )
      }
      <EtherFiSpinner loading={generatingKeys} text="Generating & Encrypting Keys..." />

    </Flex>
  )
}

export default StepCreateKeys

// {
//   keysGenerated && (
//     <>
//       <Text color="white" opacity={'0.7'}>
//         Contragulations Your Validator Keys have been generated and encrypted!
//         They are saved at {props.savePath}
//       </Text>
//     </>
//   )
// }