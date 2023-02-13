import React, { useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import UploadFile from '../../UploadFile'

interface StepUploadStakeInfoProps {
  goNextStep: () => void
}

const StepUploadStakeInfo: React.FC<StepUploadStakeInfoProps> = (props) => {
  const [hasFile, setHasFile] = useState(false)
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
      <UploadFile
        notifyFileChange={(files) => {
          if (files.length > 0) {
            setHasFile(true)
          }
        }}
      />
      {hasFile && (
        <Flex justify={'flex-end'} align={'center'} mt="20px">
          <Button variant="wizard-button-proceed" maxWidth={'300px'} size={'sm'} onClick={props.goNextStep}>
            Proceed
          </Button>
        </Flex>
      )}
      {/* Putting this in for now to be able to skip */}
          <Button variant="wizard-button-proceed" maxWidth={'300px'} size={'sm'} onClick={props.goNextStep}>
            Proceed
          </Button>
    </Flex>
  )
}

export default StepUploadStakeInfo
