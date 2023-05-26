import React, { useState, useEffect } from 'react'
import { Button, Flex, Text, Center, VStack, Box, HStack } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import { IconKey, IconCheckMark, IconSavedFile } from '../../../../Icons'
import EtherFiSpinner from '../../../../EtherFiSpinner'
import successBoxStyle from '../../../../../styleClasses/successBoxStyle'
import { COLORS } from '../../../../../styleClasses/constants'
import ChainSelectionDropdown from '../../../../ChainSelectionDropdown'
import { useFormContext } from "react-hook-form";


interface StepCreateKeysProps {
  goNextStep: () => void,
  goBackStep: () => void,
  savePath: string,
  setSavePath: (path: string) => void,
  mnemonic: string,
  stakeInfoPath: Object,
  keysGenerated: boolean,
  setKeysGenerated: (generated: boolean) => void,
  filesCreatedPath: string
  setFilesCreatedPath: (path: string) => void,
  address: string
  importMnemonicPassword: string
  mnemonicOption: string
}

const StepCreateKeys: React.FC<StepCreateKeysProps> = (props) => {

  const [generatingKeys, setGeneratingKeys] = useState(false)
  const [chain, setChain] = useState("")
  const [keysGenerated, setKeysGenerated] = useState(0);
  const [keysTotal, setKeysTotal] = useState(0);
  // const [lastTimestamp, setLastTimestamp] = useState(-1);
  const [recentUsedTime, setRecentUsedTime] = useState(-1);
  const { watch, getValues, resetField } = useFormContext();
  const loginPassword = watch("loginPassword")

  const selectSavePath = () => {
    window.fileSystemApi.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
      props.setSavePath(path)
    })
    window.fileSystemApi.reqSelectFolderPath();
  }

  const generateEncryptedKeys = () => {
    window.encryptionApi.receiveGenerateKey(
      (event: Electron.IpcMainEvent, index: number, total: number, usedTime: number) => {
        setKeysGenerated(index + 1)
        setKeysTotal(total)
        setRecentUsedTime(usedTime)
      })
    window.encryptionApi.receiveKeyGenConfirmation(
      (event: Electron.IpcMainEvent, result: number, savePath: string, errorMessage: string) => {
        if (result === 0) {
          props.setFilesCreatedPath(savePath)
          props.setKeysGenerated(true)
          resetField("confirmedAddress")
          resetField("dropdownAddress")
          resetField("address")
        } else {
          console.error("Error generating validator keys")
          console.error(errorMessage)
          // TODO: Show error screen on failure.
        }
        setGeneratingKeys(false)
      })
    window.encryptionApi.reqGenValidatorKeysAndEncrypt(props.mnemonic, loginPassword, props.savePath, props.stakeInfoPath, chain, getValues('confirmedAddress'), props.mnemonicOption, props.importMnemonicPassword);
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
    window.fileSystemApi.reqOpenFolder(props.filesCreatedPath);
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
    isDisabled: !props.savePath || !chain,
    onClick: generateEncryptedKeys,
    variant: "white-button",
  }

  console.log("keys:", keysGenerated, keysTotal)

  return (
    <Flex
      padding={'24px'}
      direction={'column'}
      gap="5px"
      height={'full'}
      width={'full'}
      bgColor="purple.dark"
      borderRadius="lg"
    >
      {!props.keysGenerated && !generatingKeys && (
        <>
          <Center>
            <IconKey boxSize='12' />
          </Center>
          <Text color={'white'} fontSize="xl" fontWeight={'semibold'} align="center">
            Create Keys
          </Text>
          <Text color="white" align="center">
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
          <Text color="white" align="center">
            Choose the chain you want to generate validator keys for
          </Text>
          <Center>
            <ChainSelectionDropdown chain={chain} setChain={setChain} mb="10px" width="300px" />
          </Center>
          <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />
        </>
      )
      }
      {generatingKeys && <EtherFiSpinner loading={generatingKeys} text="Generating & Encrypting Keys..." keysGenerated={keysGenerated} keysTotal={keysTotal} recentUsedTime={recentUsedTime} />}
      {props.keysGenerated && (
        <Box
          padding={'24px'}
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
        </Box>
      )}
    </Flex >
  )
}

export default StepCreateKeys
