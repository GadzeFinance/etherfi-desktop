import React, { useState } from 'react'
import {Flex, Text } from '@chakra-ui/react'
import DisplayMnemonic from '../DisplayMnemonic'
import WizardNavigator from '../WizardNavigator'


interface StepGenerateMnemonicProps {
  goNextStep: () => void
  goBackStep: () => void,
  mnemonic: string, 
  setMnemonic: (mnemonic: string) => void
}

const StepGenerateMnemonic: React.FC<StepGenerateMnemonicProps> = (props) => {

  const [generating, setGenerating] = useState(false);
  const generateMnemonic = () => {
    window.api.receiveNewMnemonic((event:Electron.IpcMainEvent , args: [string]) => {
      const newMnemonic = args[0];
      props.setMnemonic(newMnemonic)
      setGenerating(false)
    })
    window.api.reqNewMnemonic("english");
    setGenerating(true)
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
      <Text color={'white'} fontSize="2xl" fontWeight={'semibold'}>
        Generate Mnemonic
      </Text>
      
    {!props.mnemonic &&
        <>      
      <Text color="white" opacity={'0.7'}>
        We have successfully received your deposit of ___ ETH!
        Click the button below to generate your mnemonic which will be used to generate your validator keys.
      </Text>
        <WizardNavigator backVisible={true} goBackStep={props.goBackStep} nextVisible={true} goNextStep={generateMnemonic}  nextText="Generate Mnemonic" backText="Go Back" 
        nextProps={{isLoading:generating, loadingText:'Generating', variant:"wizard-button-generate"}}/>
        </>
        }
        {props.mnemonic && (
        <>
          <DisplayMnemonic mnemonic={props.mnemonic}/>
          <WizardNavigator backVisible={true} goBackStep={() => {props.setMnemonic("")}} nextVisible={true} goNextStep={props.goNextStep}  nextText="Proceed" backText="Go Back" />
        </>)
        }
    </Flex>
  )
}

export default StepGenerateMnemonic
