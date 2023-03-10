import React from 'react'
import { Flex, Text, Center } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import SelectFile from '../../../../SelectFile'


interface StepSelectStakeInfoPathProps {
  goNextStep: () => void,
  goBackStep: () => void,
  stakeInfoPath: string,
  setStakeInfoPath: (stakeInfoPath: string) => void,
}

const StepSelectStakeInfoPath: React.FC<StepSelectStakeInfoPathProps> = (props) => {

  const backDetails = {
    text: "back",
    visible: false,
  }

  const backProps = {
    onClick: props.goBackStep,
    variant: "white-button",
  }

  const nextDetails = {
    text: "Proceed",
    visible: true,
  }

  const nextProps = {
    isDisabled: !props.stakeInfoPath,
    onClick: props.goNextStep,
    variant: "white-button",
  }


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
        <SelectFile
          reqFileValidaton={window.validateFilesApi.validateStakeInfoJson}
          receiveValidatonResults={window.validateFilesApi.receiveStakeInfoValidationResults}
          filePath={props.stakeInfoPath}
          setFilePath={props.setStakeInfoPath} />
      </Center>
      <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />
    </Flex>
  )
}

export default StepSelectStakeInfoPath
