import React, { useState, useEffect } from 'react'
import { Button, Flex, Text, Center, VStack, Box } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import { IconKey } from '../../../../Icons'
import EtherFiSpinner from '../../../../EtherFiSpinner'
import { useFormContext } from "react-hook-form";


interface StepCreateKeysProps {
  goNextStep: () => void,
  goBackStep: () => void,
  mnemonic: string,
  stakeInfo: { [key: string]: string }[],
  address: string
  importMnemonicPassword: string
  mnemonicOption: string
  code: string
}

const StepCreateKeys: React.FC<StepCreateKeysProps> = (props) => {

  const [generatingKeys, setGeneratingKeys] = useState(false)
  const [keysGenerated, setKeysGenerated] = useState(0);
  const [keysTotal, setKeysTotal] = useState(0);
  const [recentUsedTime, setRecentUsedTime] = useState(-1);
  const { watch, getValues, resetField } = useFormContext();
  const loginPassword = watch("loginPassword")

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
          props.goNextStep()
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
    window.encryptionApi.stakeRequest(
      (event: Electron.IpcMainEvent, stakeRequest: any, errorMessage: string) => {
        console.log("stakeRequest")
        if (stakeRequest) {
          console.log({ stakeRequest })
          const baseURL = process.env.NODE_ENV === 'production'
            ? "https://mainnet.ether.fi"
            : "http://localhost:3000";
          fetch(`${baseURL}/api/stakeRequest/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stakeRequest,
              code: props.code,
            }),
          })
        } else {
          console.error("Error getting stake request")
          console.error(errorMessage)
        }
      }
    )

    const stakeinfo = [
      {
        "validatorID": 9,
        "bidderPublicKey": "04f262c21a97f93bf361645e9bb23b6b36a9bdff68e579f20b6653025ac5edc465005cac64f91ef82a735be8bfe6577e3b400a362b498576c62217c4a513cc8d79",
        "withdrawalSafeAddress": "0x9c31086302ca285da106fe805487920fcb18278e",
        "etherfiDesktopAppVersion": "1.0.0"
      }
    ]
    window.encryptionApi.reqGenValidatorKeysAndEncrypt(props.mnemonic, loginPassword, stakeinfo, getValues('confirmedAddress'), props.mnemonicOption, props.importMnemonicPassword);
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
    onClick: generateEncryptedKeys,
    variant: "white-button",
  }


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
      {!generatingKeys && (
        <>
          <Center>
            <IconKey boxSize='12' />
          </Center>
          <Text color={'white'} fontSize="xl" fontWeight={'semibold'} align="center">
            Create Keys
          </Text>
          <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />
        </>
      )
      }
      {generatingKeys && <EtherFiSpinner loading={generatingKeys} text="Generating & Encrypting Keys..." showProgress={true} keysGenerated={keysGenerated} keysTotal={keysTotal} recentUsedTime={recentUsedTime} />}
    </Flex >
  )
}

export default StepCreateKeys
