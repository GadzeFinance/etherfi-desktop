import React, { useEffect, useState } from 'react';
import { Box, Center, ScaleFade, Input } from '@chakra-ui/react'
import raisedWidgetStyle from '../../styleClasses/raisedWidgetStyle'
import UploadFile from '../UploadFile';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'



const StakerTab = ({ tabIndex }) => {
  const [numValidatorKeyFiles, setNumValidatorKeyFiles] = useState(0);
  const [numDepositDataFiles, setNumDepositDataFiles] = useState(0);
  const [stakerAddress, setStakerAddress] = React.useState('')
  const [depositedStakes, setDepositedStakes] = useState([])
  const [password, setPassword] = useState('');

  const handleStakerAddressChange = (event) => setStakerAddress(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  const getDepositedStakes = () => {
    // let stakes = Get the list of Stake structs such that 
    // (stake.staker_address == stakerAddress) AND (stake.phase == DEPOSITED)
    
    // For Testing
    let stakes = [...depositedStakes, "Stakes of " + stakerAddress];    

    setDepositedStakes(stakes);
  }

  const generateKeys = () => {

  }

  const exportStakeRequest = () => {

  }

  const exportStakePrivate = () => {
    
  }


  return (
    <Center>
    <Box maxW={'800px'} sx={raisedWidgetStyle}>
        <ScaleFade initialScale={0.5} in={tabIndex === 0}>
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
          Please, use the ETH CLI tool to generate the validator keys and deposit data and submit them. 
        </Text>
        
        <Text color="red.500" fontSize='xl'> 1. Validator Key Files </Text>
        <UploadFile notifyFileChange={setNumValidatorKeyFiles}/>

        <Text color="red.500" fontSize='xl'> 2. Deposit Data File </Text>
        <UploadFile notifyFileChange={setNumDepositDataFiles}/>

        <Text color="red.500" fontSize='xl'> 3. Password used to generate the validator keys and deposit data</Text>
        <Input variant='filled' 
            color="red.500"
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="password" 
          />

        <Center>
          <Button colorScheme='blue' align='center' onClick={generateKeys}>Generate Keys</Button>
        </Center>

        <Center>
          <Button colorScheme='blue' align='center' onClick={generateKeys}>Export stakeRequest.json</Button>
          <Button colorScheme='blue' align='center' onClick={generateKeys}>Export stakePrivate.json</Button>
        </Center>

        </ScaleFade>
    </Box>
    </Center>
  )
}

export default StakerTab