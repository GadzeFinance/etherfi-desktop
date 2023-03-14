import React, { useEffect, useState } from 'react'
import { Flex, Text, Center } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import SelectFile from '../../../../SelectFile'
import { IconAlertTriangle } from '../../../../Icons'


interface StepSelectStakeInfoPathProps {
  goNextStep: () => void,
  goBackStep: () => void,
  stakeInfoPath: string,
  setStakeInfoPath: (stakeInfoPath: string) => void,
}

const StepSelectStakeInfoPath: React.FC<StepSelectStakeInfoPathProps> = (props) => {
  const [staleKeysFound, setStaleKeysFound] = useState<Boolean>(false)
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


  useEffect(() => {
    // Check to see if there are any stale keys in the StakeInfo.json file the user selected.
    // (i.e have the keys been used to encrypt Validator Keys by this dekstop app before )
    if (props.stakeInfoPath !== '') {
      window.databaseApi.receiveStaleBidderPublicKeysReport((event: Electron.IpcMainEvent, staleKeys: Array<String>) => {
        if (staleKeys.length > 0) {
          // In the future we may want to show which stale keys were used in the UI instead of just the console
          console.warn("Stale keys were found: " + staleKeys)
          setStaleKeysFound(true)
        } else {
          setStaleKeysFound(false)
          console.log('No stale Keys found!')
        }
      })
      window.databaseApi.reqCheckForStaleBidderPublicKeys(props.stakeInfoPath)
    } else {
      // Set stale keys found to false since there is no file selected
      setStaleKeysFound(false)
    }
  }, [props.stakeInfoPath]);



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
          fileName="StakeInfo"
          reqFileValidaton={window.validateFilesApi.validateStakeInfoJson}
          receiveValidatonResults={window.validateFilesApi.receiveStakeInfoValidationResults}
          filePath={props.stakeInfoPath}
          setFilePath={props.setStakeInfoPath} />
      </Center>
      {
        staleKeysFound && (
          <Center mt='-10px'>
            <IconAlertTriangle stroke="#FFC700" boxSize="7" />
            <Text ml='10px' variant="alert-text">This StakeInfo.json file contains bidderPublicKeys that have already been used to encrypt Validator Keys. Please make sure this is the correct file.</Text>
          </Center>
        )
      }
      <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />
    </Flex>
  )
}

export default StepSelectStakeInfoPath
