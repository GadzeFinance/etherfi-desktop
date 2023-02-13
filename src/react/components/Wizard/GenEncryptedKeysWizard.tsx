import React, {useState} from 'react'
import { Center, Flex } from '@chakra-ui/react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import StepUploadStakeInfo from './Steps/StepUploadStakeInfo'
import StepGenerateMnemonic from './Steps/StepGenerateMnemonic'
import StepGenerateKeys from './Steps/StepGenerateKeys'
import StepSuccess from './Steps/StepSuccess'
import StepUploadKeys from './Steps/StepUploadKeys'

const content = <Flex py={4}></Flex>

const steps = [
  { label: 'Upload StakeInfo.json', content },
  { label: 'Generate Mnemonic', content },
  { label: 'Step 3', content },
  { label: 'Step 4', content },
  // { label: 'Deposit ETH', content },
  // { label: 'Encrypt Validator Key', content },
  // { label: 'Upload Encrypted Key', content },
]

interface WizardProps {
  navigateTo: (tabIndex: number) => void
}


const GenEncryptedKeysWizard: React.FC<WizardProps> = (props) => {
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  })
  const [mnemonic, setMnemonic] = React.useState<string>("");

  return (
    <Center>
    <Flex
      width={'905px'}
      height={'450px'}
      sx={{
        border: '1px solid',
        borderColor: 'purple.light',
        padding: '24px',
        borderRadius: '16px',
      }}
    >
      <Flex flexDir="column" width="600px" height="350px">
      <Steps colorScheme={'whiteAlpha'} orientation="vertical" activeStep={activeStep}>
          {steps.map(({ label, content }) => (
            <Step label={label} key={label} color="white">
              {content}
            </Step>
          ))}
        </Steps>
      </Flex>
      <Flex flexDir="column" width="100%">
        {activeStep === 0 && <StepUploadStakeInfo goNextStep={nextStep} />}
        {activeStep === 1 && <StepGenerateMnemonic goBackStep={prevStep} goNextStep={nextStep} mnemonic={mnemonic} setMnemonic={setMnemonic} />}
        {activeStep === 3 && <StepUploadKeys goNextStep={nextStep} />}
        {activeStep === 4 && <StepSuccess navigateTo={props.navigateTo} />}
      </Flex>
    </Flex>
    </Center>
  ) 
}

export default GenEncryptedKeysWizard
