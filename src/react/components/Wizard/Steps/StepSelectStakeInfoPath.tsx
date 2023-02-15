import React, { useState } from 'react'
import { Button, Flex, Text, Center } from '@chakra-ui/react'
import WizardNavigator from '../WizardNavigator'
import IconFile from '../../icons/IconFile'
import IconTrash from '../../Icons/IconTrash'
import SelectFile from '../../SelectFile'


interface StepSelectStakeInfoPathProps {
  goNextStep: () => void,
  goBackStep: () => void,
  stakeInfoPath: string,
  setStakeInfoPath: (stakeInfoPath: string) => void,
}

const StepSelectStakeInfoPath: React.FC<StepSelectStakeInfoPathProps> = (props) => {

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
        Upload StakeInfo.json file
      </Text>
      <Text color="white" opacity={'0.7'}>
        Upload the StakeInfo.json file you downloaded from the ether.fi webapp to begin the key generation process.
      </Text>
      <Center mt="5px">
        <SelectFile filePath={props.stakeInfoPath} setFilePath={props.setStakeInfoPath} />
      </Center>
      <WizardNavigator nextVisible={props.stakeInfoPath !== ""} goBackStep={props.goBackStep} goNextStep={props.goNextStep} nextText="Proceed" backText="Go Back" />
    </Flex>
  )
}

export default StepSelectStakeInfoPath
