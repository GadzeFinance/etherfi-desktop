import React, { useState } from 'react'
import { Center, Flex } from '@chakra-ui/react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
// STEP 1:
import StepSelectStakeInfoPath from './Steps/StepSelectStakeInfoPath'
// STEP 2:
import StepGenerateMnemonic from './Steps/StepGenerateMnemonic'
// STEP 3:
import StepGetPassword from './Steps/StepGetPassword'
//STEP 4: 
import StepGenerateValKeysAndEncrypt from './Steps/StepGenerateValKeysAndEncrypt'


const content = <Flex py={4}></Flex>

const steps = [
  { label: 'Upload StakeInfo.json', content },
  { label: 'Generate Mnemonic', content },
  { label: 'Create Password', content },
  { label: 'Create Keys', content },
  { label: 'Download StakeRequest.json', content },
]

interface WizardProps {
  navigateTo: (tabIndex: number) => void
}


const GenEncryptedKeysWizard: React.FC<WizardProps> = (props) => {
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  })
  const [stakeInfoPath, setStakeInfoPath] = React.useState<string>("");
  const [mnemonic, setMnemonic] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [savePath, setSavePath] = React.useState<string>("");

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
          <Steps colorScheme="black-alpha" orientation="vertical" activeStep={activeStep}>
            {steps.map(({ label, content }) => (
              <Step label={label} key={label} color="white">
                {content}
              </Step>
            ))}
          </Steps>
        </Flex>
        <Flex flexDir="column" width="100%">

          {activeStep === 0 && <StepSelectStakeInfoPath goBackStep={prevStep} goNextStep={nextStep} stakeInfoPath={stakeInfoPath} setStakeInfoPath={setStakeInfoPath} />}
          {activeStep === 1 && <StepGenerateMnemonic goBackStep={prevStep} goNextStep={nextStep} mnemonic={mnemonic} setMnemonic={setMnemonic} />}
          {activeStep === 2 && <StepGetPassword goBackStep={prevStep} goNextStep={nextStep} password={password} setPassword={setPassword} />}
          {activeStep === 3 && <StepGenerateValKeysAndEncrypt goBackStep={prevStep} goNextStep={nextStep}
            savePath={savePath} setSavePath={setSavePath}
            stakeInfoPath={stakeInfoPath}
            mnemonic={mnemonic} password={password}
          />}
        </Flex>
      </Flex>
    </Center>
  )
}

export default GenEncryptedKeysWizard
