import React, { useState } from 'react'
import { Button, Flex, Text, Center } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import DisplayMnemonic from '../DisplayMnemonic'
import WizardNavigatorProps from '../WizardNavigator'

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
        <Center>
        <Button variant="wizard-button-generate"
           maxWidth={'300px'} 
           size={'sm'} onClick={generateMnemonic}
           isLoading={generating}
           loadingText='Generating'>
          Generete Mnemonic
        </Button>
        </Center>
        <WizardNavigatorProps goBackStep={props.goBackStep} goNextStep={props.goNextStep} nextText="Proceed" backText="Go Back" />
        </>
        }
        {props.mnemonic && (
        <>
          <DisplayMnemonic mnemonic={props.mnemonic}/>
          <WizardNavigatorProps goBackStep={props.goBackStep} goNextStep={props.goNextStep} nextText="next" backText="back" />
        </>)
        }
    </Flex>
  )
}

export default StepGenerateMnemonic

