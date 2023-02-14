import React, { useState } from 'react'
import { Button, Flex, Text, Center } from '@chakra-ui/react'
import WizardNavigator from '../WizardNavigator'
import IconFile from '../../icons/IconFile'
import IconTrash from '../../Icons/IconTrash'


interface StepSelectStakeInfoPathProps {
  goNextStep: () => void,
  goBackStep: () => void,
  stakeInfoPath: string,
  setStakeInfoPath: (stakeInfoPath: string) => void,
}

const StepSelectStakeInfoPath: React.FC<StepSelectStakeInfoPathProps> = (props) => {
  const [stakeInfoFileName, setStakeInfoFileName] = useState<string>("")
  const selectStakeInfoPath = () => {
    window.api.receiveSelectedFilePath((event: Electron.IpcMainEvent, path: string) => {
      props.setStakeInfoPath(path)
      setStakeInfoFileName(path.split("/").pop())
    })
    window.api.reqSelectFilePath();
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
            <Button colorScheme='blue' onClick={selectStakeInfoPath}>Select Path</Button>
      </Center>
      {props.stakeInfoPath && (
        <Flex
          gap="20px"
          padding="20px"
          justify={'center'}
          align={'center'}
          background={'#474276'}
          borderRadius="xl"
          height={'56px'}
        >
          <IconFile />
          <Text flex="auto" color={'#FFF'}>
            {stakeInfoFileName}
          </Text>
          <IconTrash
            onClick={() => {
              props.setStakeInfoPath("")
              setStakeInfoFileName("")
            }}
          />
        </Flex>
      )}

        <WizardNavigator nextVisible={props.stakeInfoPath !== ""} goBackStep={props.goBackStep} goNextStep={props.goNextStep} nextText="Proceed" backText="Go Back" />  
    </Flex>
  )
}

export default StepSelectStakeInfoPath
