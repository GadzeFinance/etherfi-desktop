import React, { useEffect, useState } from 'react';
import { Box, Center, ScaleFade, Input } from '@chakra-ui/react'
import raisedWidgetStyle from '../../styleClasses/raisedWidgetStyle'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'


const StakerTab = ({ tabIndex }) => {
  const [stakerAddress, setStakerAddress] = React.useState('')
  const [depositedStakes, setDepositedStakes] = useState([])
  const [password, setPassword] = useState('');
  const [validatorKeyFilePaths, setValidatorKeyFilePaths] = useState([])
  const [depositDataFilePath, setDepositDatafilePath] = useState('')

  const handleStakerAddressChange = (event) => setStakerAddress(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  const getDepositedStakes = () => {
    // let stakes = Get the list of Stake structs such that 
    // (stake.staker_address == stakerAddress) AND (stake.phase == DEPOSITED)
    
    // For Testing
    let stakes = [...depositedStakes, "Stakes of " + stakerAddress];    

    setDepositedStakes(stakes);
  }

  const selectValidatorKeyFiles = () => {
    window.api.receiveSelectedFilesPaths((event, files) => {
      console.log(files)
      setValidatorKeyFilePaths(files)
    })
    window.api.reqSelectFiles();    
  }

  const selectDepositDataFile = () => {
    window.api.receiveSelectedFilesPaths((event, files) => {
      console.log(files)
      setDepositDatafilePath(files[0])
    })
    window.api.reqSelectFiles();    
  }

  const buildStakerFile = () => {
    window.api.reqBuildStakerFile(validatorKeyFilePaths, depositDataFilePath, password);
  }

  return (
    <Center>
    <Box maxW={'800px'} sx={raisedWidgetStyle}>
        <ScaleFade initialScale={0.5} in={tabIndex === 0}>
        <Text color="red.500" fontSize='xl'> 1. See how many validators you can launch! </Text>
        <Center>
          <Input variant='filled' 
            color="red.500"
            value={stakerAddress} 
            onChange={handleStakerAddressChange} 
            placeholder="staker wallet address" 
          />
          <Button colorScheme='blue' onClick={getDepositedStakes}>Enter</Button>
        </Center>

        <Text color="red.500" fontSize='xl'> 
          You have staked {32*depositedStakes.length} (= 32 * {depositedStakes.length}) ETH and can launch {depositedStakes.length} staking nodes!{"\n"}
          Please, use the ETH CLI tool to generate new {depositedStakes.length} validator keys and deposit data. 
        </Text>
        
        <Text color="red.500" fontSize='xl'> 2. Input Validator Key Files </Text>
        <Center>
        <Button colorScheme='blue' align='center' onClick={selectValidatorKeyFiles}>Select Validator KeyStore File ("keystore-m_...") </Button>
        </Center>

        <Text color="red.500" fontSize='xl'> 3. Input Deposit Data File </Text>
        <Center>
        <Button colorScheme='blue' align='center' onClick={selectDepositDataFile}>Select DepositData Files ("deposit_data-...")</Button>
        </Center>

        <Text color="red.500" fontSize='xl'> 4. Input Password used to generate the validator keys and deposit data </Text>
        <Input variant='filled' 
            color="red.500"
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="password" 
        />

        <Text color="red.500" fontSize='xl'> 5. Finally, Encrypt them securely!</Text>
        <Center>
          <Button colorScheme='blue' align='center' onClick={buildStakerFile}>Encrypt</Button>
        </Center>

        </ScaleFade>
    </Box>
    </Center>
  )
}

export default StakerTab