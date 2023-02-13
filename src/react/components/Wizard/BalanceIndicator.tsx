import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import IconFaceFrown from '../Icons/IconFaceFrown'
import IconFaceSmile from '../Icons/IconFaceSmile'

interface BalanceIndicatorProps {
  hasEnoughFunds: boolean
  balance: string
}

const BalanceIndicator: React.FC<BalanceIndicatorProps> = (props) => {
  const colorForFundState = props.hasEnoughFunds ? '#00F17D' : '#F94545'
  return (
    <Flex
      gap={'10px'}
      justify={'space-between'}
      align={'center'}
      bg={'rgba(0, 241, 125, 0.1)'}
      border="1px solid rgba(0, 241, 125, 0.44)"
      borderRadius="12px"
      height={'40px'}
      padding={'10px'}
    >
      <Flex gap="11px" justify={'center'} align={'center'}>
        {props.hasEnoughFunds ? (
          <IconFaceSmile height={'20px'} width={'20px'} color="rgba(0, 241, 125, 0.1)" />
        ) : (
          <IconFaceFrown height={'20px'} width={'20px'} color="rgba(0, 241, 125, 0.1)" />
        )}
        <Text color={colorForFundState} opacity="0.7">
          Your current balance
        </Text>
      </Flex>
      <Text color={colorForFundState} fontWeight="extrabold">
        {props.balance} ETH
      </Text>
    </Flex>
  )
}

export default BalanceIndicator
