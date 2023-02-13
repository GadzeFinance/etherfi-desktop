import React from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, Flex, Link, Text } from '@chakra-ui/react'

interface StepGenerateKeysProps {
  goNextStep: () => void
}

const StepGenerateKeys: React.FC<StepGenerateKeysProps> = (props) => {
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
        Generate Deposit Data
      </Text>
      <Text color="white" opacity={'0.7'}>
        In order to stake you will need to use the CLI tool provided by the ethereum foundation to
        generate your validator key & deposit data with a new mnemonic you should store safely. Once
        you have your validator key & deposit data files ready, continue to the next step.
      </Text>
      // <Link
        color="blue.main"
        href="https://github.com/ethereum/staking-deposit-cli/releases/"
        isExternal
      >
        Download CLI <ExternalLinkIcon mx="2px" />
      </Link>
      <Flex justify={'flex-end'} align={'center'} mt="20px">
        <Button bg="red.300" size={'sm'} width="150px" onClick={props.goNextStep}>
          Proceed
        </Button>
      </Flex>
    </Flex>
  )
}

export default StepGenerateKeys
