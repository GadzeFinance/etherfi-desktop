import React, { useState } from 'react'
import { Flex, Text, Center } from '@chakra-ui/react'
import DisplayMnemonic from './DisplayMnemonic'
import ConfirmMnemonic from './ConfimMnemonic'
import WizardNavigator from '../../WizardNavigator'
import EtherFiSpinner from '../../../../EtherFiSpinner'
import { IconLockFile } from '../../../../Icons'



interface StepGenerateMnemonicProps {
  goNextStep: () => void,
  goBackStep: () => void,
  mnemonic: string,
  setMnemonic: (mnemonic: string) => void,
  wordsToConfirmIndicies: Array<number>,
}

const StepGenerateMnemonic: React.FC<StepGenerateMnemonicProps> = (props) => {

  const [generating, setGenerating] = useState(false);
  // This is a hacky way to determine if we should show ConfirmMnemonic or DisplayMnemonic compoennts when this renders.
  const [confirmMnemonic, setConfirmMnemonic] = useState(props.mnemonic !== '')
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false)
  const generateMnemonic = () => {
    window.encryptionApi.receiveNewMnemonic((event: Electron.IpcMainEvent, results: Array<any>) => {
      const [result, newMnemonic, errorMessage] = results
      if (result === 0) {
        props.setMnemonic(newMnemonic)
      } else {
        console.error("Error generating mnemonic")
        console.error(errorMessage)
        // TODO: Show error screen on failure.
      }
      setGenerating(false)
    })
    window.encryptionApi.reqNewMnemonic("english");
    setGenerating(true)
  }

  const nextAction = () => {
    // No Mneomoic Generated
    if (!props.mnemonic) return generateMnemonic
    // Mneomoic Generated and viewing the whole mnemonic screen
    if (props.mnemonic && !confirmMnemonic) return () => setConfirmMnemonic(true)
    // Mneomoic Generated and viewing the Confirm Mnemonic screen
    if (props.mnemonic && confirmMnemonic) return () => {
      setConfirmMnemonic(false);
      props.goNextStep()
    }
  }

  const backAction = () => {
    // No Mneomoic Generated
    if (!props.mnemonic) return props.goBackStep
    // Viewing whole mnemonic screen
    if (props.mnemonic && !confirmMnemonic) return resetState
    // Viewing Confirm Mnemonic Screen
    if (props.mnemonic && confirmMnemonic) return () => setConfirmMnemonic(false)
  }

  const resetState = () => {
    props.setMnemonic("")
    setGenerating(false)
  }

  const backDetails = {
    text: "Back",
    visible: true,
  }

  const backProps = {
    onClick: backAction(),
    variant: "back-button",
  }

  const nextDetails = {
    text: !props.mnemonic ? "Generate Mnemonic" : "Continue",
    visible: true,
  }

  const nextProps = {
    // isDisabled: !props.stakeInfoPath,
    // If confrimMnemonc is show then check if the user has entered all the words. 
    // Otherwise the button is not disabled
    isDisabled: confirmMnemonic ? !mnemonicConfirmed : false,
    onClick: nextAction(),
    variant: "white-button",
  }


  return (
    <Flex
      padding={'24px'}
      direction={'column'}
      gap="12px"
      bgColor="purple.dark"
      height="full"
      width={'full'}
      borderRadius="lg"
    >
      {!props.mnemonic && !generating && (
        <>
          <Center>
            <IconLockFile boxSize='100' />
          </Center>
          <Text color={'white'} fontSize="2xl" fontWeight='semibold' align="center">
            Generate Mnemonic
          </Text>


          <Text color="white" opacity={'0.7'} align="center">
            To generate and encrypt your validator keys. First you need to generate a mnemonic.
          </Text>
        </>
      )}
      {props.mnemonic && !confirmMnemonic && (<DisplayMnemonic mnemonic={props.mnemonic} />)}
      {props.mnemonic && confirmMnemonic && (
        <ConfirmMnemonic mnemonic={props.mnemonic}
          wordsToConfirmIndicies={props.wordsToConfirmIndicies}
          setMnemonicConfirmed={setMnemonicConfirmed}
        />
      )}

      {!generating && <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />}
      <EtherFiSpinner loading={generating} text={"Generating Mnemonic..."} />
    </Flex >
  )
}

export default StepGenerateMnemonic
