import React, { useState } from 'react'
import { Flex, Text, Center } from '@chakra-ui/react'
import DisplayMnemonic from './DisplayMnemonic'
import WizardNavigator from '../../WizardNavigator'
import IconLockFile from '../../../../Icons/IconLockFile'
import EtherFiSpinner from '../../../../EtherFiSpinner'


interface StepGenerateMnemonicProps {
  goNextStep: () => void
  goBackStep: () => void,
  mnemonic: string,
  setMnemonic: (mnemonic: string) => void
}

const StepGenerateMnemonic: React.FC<StepGenerateMnemonicProps> = (props) => {

  const [generating, setGenerating] = useState(false);
  const generateMnemonic = () => {
    window.api.receiveNewMnemonic((event: Electron.IpcMainEvent, args: [string]) => {
      const newMnemonic = args[0];
      props.setMnemonic(newMnemonic)
      setGenerating(false)
    })
    window.api.reqNewMnemonic("english");
    setGenerating(true)
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
    onClick: !props.mnemonic ? props.goBackStep : resetState,
    variant: "back-button",
  }

  const nextDetails = {
    text: !props.mnemonic ? "Generate Mnemonic" : "Continue",
    visible: true,
  }

  const nextProps = {
    // isDisabled: !props.stakeInfoPath,
    onClick: !props.mnemonic ? generateMnemonic : props.goNextStep,
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
            We have successfully received your deposit of ___ ETH!
            Now its time to generate
          </Text>

          {/* <WizardNavigator backDetails={backDetails} backVisible={true} goBackStep={props.goBackStep} nextVisible={true} goNextStep={generateMnemonic} nextText="Generate Mnemonic" backText="Go Back"
            nextProps={{ isLoading: generating, loadingText: 'Generating', variant: "white-button-generate" }} /> */}
        </>
      )}

      {props.mnemonic && (<DisplayMnemonic mnemonic={props.mnemonic} />)}
      {!generating && <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />}
      <EtherFiSpinner loading={generating} text={"Generating Mnemonic..."} />
    </Flex >
  )
}

export default StepGenerateMnemonic
