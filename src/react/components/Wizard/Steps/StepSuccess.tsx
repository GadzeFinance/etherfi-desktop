import React from 'react'
import { Flex, Link, Text } from '@chakra-ui/react'

interface StepSuccessProps {
  navigateTo: (tabIndex: number) => void
}

const StepSuccess: React.FC<StepSuccessProps> = (props) => {
  return (
    <Flex
      padding={'24px'}
      direction={'column'}
      gap="16px"
      bgColor="purple.dark"
      height="full"
      width={'full'}
      borderRadius="lg"
    >
      <Text color={'white'} fontSize="2xl" fontWeight={'semibold'}>
        Stake Success 🎉
      </Text>
      <Text color="white" opacity={'0.7'}>
        The node operator will be notified of the successful bid, and should start validating in the
        next 24h! View your pending validator on the dashboard linked below.
      </Text>
      <Link
        color="blue.main"
        onClick={(e) => {
          e.preventDefault()
          props.navigateTo(2)
        }}
      >
        Go to dashboard
      </Link>
    </Flex>
  )
}

export default StepSuccess
