import React, { useState, useEffect } from 'react'
import { Button, Flex, Text, Center, VStack, Box, HStack } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import IconKey from '../../../../Icons/IconKey'
import EtherFiSpinner from '../../../../EtherFiSpinner'
import IconCheckMark from '../../../../Icons/IconCheckMark'
import IconSavedFile from '../../../../Icons/IconSavedFile'
import successBoxStyle from '../../../../../styleClasses/successBoxStyle'
import { COLORS } from '../../../../../styleClasses/constants'


interface StepCreateKeysProps {
  goNextStep: () => void,
  goBackStep: () => void,
  savePath: string,
  setSavePath: (path: string) => void,
  mnemonic: string,
  password: string,
  stakeInfoPath: Object,
  keysGenerated: boolean,
  setKeysGenerated: (generated: boolean) => void,
  filesCreatedPath: string
  setFilesCreatedPath: (path: string) => void,
}

const StepCreateKeys: React.FC<StepCreateKeysProps> = (props) => {

  const [generatingKeys, setGeneratingKeys] = useState(false)

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
      props.setFilesCreatedPath(path[0])
      setGeneratingKeys(false)
      props.setKeysGenerated(true)
    })
    window.api.reqGenValidatorKeysAndEncrypt(props.mnemonic, props.password, props.savePath, props.stakeInfoPath);
    setGeneratingKeys(true)
  }

  useEffect(() => {
    // Check to see if there are any stale keys in the StakeInfo.json file the user selected.
    // (i.e have the keys been used to encrypt Validator Keys by this dekstop app before )
    if (props.keysGenerated) {
      window.databaseApi.receiveUpdateStaleKeysResult((event: Electron.IpcMainEvent, result: boolean) => {
        if (result) {
          console.log("Update Stale Keys DB successfully")
        } else {
          console.warn("Could not update Stale Keys DB")
        }
      })
      window.databaseApi.reqUpdateStaleKeys(props.stakeInfoPath)
    }
  }, [props.keysGenerated]);

  const openFilesCreatedFolder = () => {
    console.log(props.filesCreatedPath)
    window.api.reqOpenFolder(props.filesCreatedPath);
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
      {!props.keysGenerated && !generatingKeys && (
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
      {generatingKeys && <EtherFiSpinner loading={generatingKeys} text="Generating & Encrypting Keys..." />}
      {props.keysGenerated && (
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
              Congrats! Your keys have been successfully generated and encrypted!
            </Text>
            <Text fontSize="14px" color={COLORS.textSecondary}>
              Your files have been created here:
            </Text>

            <Box sx={successBoxStyle}>
              <HStack>
                <IconSavedFile boxSize="8" />
                <Text _hover={{ textDecoration: 'underline' }} fontSize='14px' flex="auto" color='white' onClick={openFilesCreatedFolder}>
                  {props.filesCreatedPath}
                </Text>
                <IconCheckMark boxSize="5" />
              </HStack>
            </Box>
            <Center>
              <Button variant='white-button' onClick={props.goNextStep}>Continue</Button>
            </Center>
          </VStack>

        </Flex>
      )
      }

    </Flex >
  )
}

export default StepCreateKeys
