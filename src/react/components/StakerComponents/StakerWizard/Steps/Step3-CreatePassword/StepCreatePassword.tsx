import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import PasswordInput from '../../../../PasswordInput'

interface StepCreatePasswordProps {
  goNextStep: () => void
  goBackStep: () => void,
  password: string,
  setPassword: (password: string) => void
}


const StepCreatePassword: React.FC<StepCreatePasswordProps> = (props) => {
  const [isPasswordValid, setIsPasswordValid] = React.useState(false)

  const backDetails = {
    text: "Back",
    visible: true,
  }

  const backProps = {
    onClick: props.goBackStep,
    variant: "back-button",
  }

  const nextDetails = {
    text: "Continue",
    visible: true,
  }

  const nextProps = {
    isDisabled: !isPasswordValid,
    onClick: props.goNextStep,
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
      <Text color={'white'} fontSize="2xl" fontWeight={'semibold'}>
        Enter Password
      </Text>
      <Text color="white" opacity={'0.7'}>
        Please enter a password to create your validator keystores.
      </Text>

      <PasswordInput password={props.password} setPassword={props.setPassword} isPasswordValid={isPasswordValid} setIsPasswordValid={setIsPasswordValid} />
      <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />

    </Flex>
  )
}

export default StepCreatePassword
