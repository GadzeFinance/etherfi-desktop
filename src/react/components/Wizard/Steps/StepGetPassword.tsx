import React from 'react'
import { Button, Flex, Text, InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import WizardNavigator from '../WizardNavigator'
import { COLORS } from '../../../styleClasses/constants'

interface StepGetPasswordProps {
  goNextStep: () => void
  goBackStep: () => void,
  password: string,
  setPassword: (password: string) => void
}

const StepGetPassword: React.FC<StepGetPasswordProps> = (props) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const updatePassword = (newPassword: string) => {
    // TODO: NEED TO VALIDATE PASSWORD
    props.setPassword(newPassword)
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
      <InputGroup>
        <Input borderColor={COLORS.lightPurple} color="white"
          placeholder='Enter password'
          type={showPassword ? 'text' : 'password'}
          value={props.password}
          onChange={(e) => { updatePassword(e.target.value) }}

        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={() => { setShowPassword(!showPassword) }}>
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>

      {/* <WizardNavigator backVisible={true} goBackStep={props.goBackStep} nextVisible={true} goNextStep={props.goNextStep} nextProps={{isDisabled:props.password.length < 8}} nextText="Proceed" backText="Go Back" /> */}

    </Flex>
  )
}

export default StepGetPassword
