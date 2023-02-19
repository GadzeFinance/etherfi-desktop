import React from 'react'
import { Button, Flex, Text, InputGroup, Input, InputRightElement, UnorderedList, ListItem } from '@chakra-ui/react'
import WizardNavigator from '../WizardNavigator'
import { COLORS } from '../../../styleClasses/constants'
import IconEyeSlash from '../../Icons/IconEyeSlash'
import clickableIconStyle from '../../../styleClasses/clickableIconStyle'

interface StepCreatePasswordProps {
  goNextStep: () => void
  goBackStep: () => void,
  password: string,
  setPassword: (password: string) => void
}


const StepCreatePassword: React.FC<StepCreatePasswordProps> = (props) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [passwordResults, setPasswordResults] = React.useState([])
  const [isPasswordValid, setIsPasswordValid] = React.useState(false)

  const updatePassword = (newPassword: string) => {
    validatePassword(newPassword)
    props.setPassword(newPassword)
  }

  function validatePassword(password: string) {
    const tests = [
      {
        passed: password.length >= 8,
        message: 'password should be at least 8 characters long'
      },
      {
        passed: /[A-Z]/.test(password),
        message: 'password should contain at least one uppercase letter'
      },
      {
        passed: /[a-z]/.test(password),
        message: 'password should contain at least one lowercase letter'
      },
      {
        passed: /[\W_]/.test(password),
        message: 'password should contain at least one special character'
      },
      {
        passed: /\d/.test(password),
        message: 'password should contain at least one number'
      },
      {
        passed: !/\s/.test(password),
        message: 'password should not contain any spaces'
      }
    ];
    setPasswordResults(tests)
    setIsPasswordValid(tests.every(test => test.passed))

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
      <>
        <Text mt="10px" color="white" opacity={'0.7'} fontSize="11px">Password*</Text>
        <InputGroup>
          <Input
            isRequired={true}
            isInvalid={!isPasswordValid && props.password.length > 1}
            borderColor={isPasswordValid ? 'green.main' : COLORS.lightPurple}
            errorBorderColor='red.warning'
            focusBorderColor={isPasswordValid ? 'green.main' : 'blue.secondary'}
            color="white"
            placeholder='Enter password'
            type={showPassword ? 'text' : 'password'}
            value={props.password}
            onChange={(e) => { updatePassword(e.target.value) }
            }

          />

          <InputRightElement width='4.5rem'>
            <IconEyeSlash sx={clickableIconStyle} boxSize={6} onClick={() => { setShowPassword(!showPassword) }} />
          </InputRightElement>
        </InputGroup>
      </>
      <UnorderedList>
        {passwordResults.map((passwordRequirement, index) => (!passwordRequirement.passed && <ListItem key={index} fontSize="12px" color="red.warning">{passwordRequirement.message}</ListItem>))}

      </UnorderedList>

      <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />

    </Flex>
  )
}

export default StepCreatePassword
