import React, { useState, useEffect } from 'react'
import { Flex, Text, Center, Spinner, Progress } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import { IconKey } from '../../../../Icons'
import { useFormContext } from "react-hook-form";
import { InfoPanels } from '../../../../InfoPanels'
import { dappUrl } from '../../../../../../electron/utils/getDappUrl';


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

  const [generatingKeys, setGeneratingKeys] = useState(true)
  const [generated, setGenerated] = useState(false)
  const [keysGenerated, setKeysGenerated] = useState(0);
  const [keysTotal, setKeysTotal] = useState(0);
  const { watch, getValues, resetField } = useFormContext();
  const loginPassword = watch("loginPassword")

  const generateEncryptedKeys = () => {
    window.encryptionApi.receiveGenerateKey(
      (event: Electron.IpcMainEvent, index: number, total: number, usedTime: number) => {
        setKeysGenerated(index + 1)
        setKeysTotal(total)
      })
    window.encryptionApi.receiveKeyGenConfirmation(
      (event: Electron.IpcMainEvent, result: number, savePath: string, errorMessage: string) => {
        if (result === 0) {
          props.goNextStep()
          resetField("confirmedAddress")
          resetField("dropdownAddress")
          resetField("address")
          setGenerated(true)
        } else {
          console.error("Error generating validator keys")
          console.error(errorMessage)
          // TODO: Show error screen on failure.
        }
        setGeneratingKeys(false)
      })
    window.encryptionApi.stakeRequest(
      (event: Electron.IpcMainEvent, stakeRequest: any, errorMessage: string) => {
        if (stakeRequest) {
          fetch(`${dappUrl}/api/stakeRequest/upload`, {
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

    
    window.encryptionApi.reqGenValidatorKeysAndEncrypt(props.mnemonic, loginPassword, props.stakeInfo, getValues('confirmedAddress'), props.mnemonicOption, props.importMnemonicPassword, props.code);
    setGeneratingKeys(true)
  }

  useEffect(() => {
    if (!generated) generateEncryptedKeys()
  }, [])


  const backDetails = {
    text: "Back",
    visible: true,
  }

  const backProps = {
    onClick: props.goBackStep,
    variant: "back-button",
  }

  const nextDetails = {
    text: "Creating Keys",
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
            Creating Keys
          </Text>
          <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />
        </>
      )
      }
      {generatingKeys && (
        <>
          <Text textAlign="center" fontSize="xs" color="white">Generating Keys</Text>
          <Progress mb={1} colorScheme="purple" size="xs" value={(keysGenerated / keysTotal) * 100} hasStripe />
          <InfoPanels />
        </>
      )}
    </Flex >
  )
}

export default StepCreateKeys
