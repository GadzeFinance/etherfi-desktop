import React, { useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import UploadFile from '../../../components/UploadFile'

interface StepUploadKeysProps {
  goNextStep: () => void
}

const StepUploadKeys: React.FC<StepUploadKeysProps> = (props) => {
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
        Upload Encrypted Validator Key
      </Text>
      <Text color="white" opacity={'0.7'}>
        Upload the encrypted validator key created in the previous step. Once you submit the
        encrypted validator key your ETH will be staked!
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
          <Button maxWidth={'300px'} bg="red.300" size={'sm'} onClick={props.goNextStep}>
            Proceed
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default StepUploadKeys
