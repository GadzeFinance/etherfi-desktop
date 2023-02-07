import React, { useEffect, useState } from 'react';
import { Box, Center, ScaleFade, Input, Button, Text } from '@chakra-ui/react'
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle'
import {useGetCompetingBidsQuery, useGetUserBidsQuery, useGetDepositedStakesByAddressQuery, useGetBidByIdQuery, useGetStakesByAddressQuery, useGetAllStakesQuery } from '../../clients/subgraph/generated'
interface TabProps {
  tabIndex: number;
}

const StakerTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
  const [stakerAddress, setStakerAddress] = useState<string>('0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA')
  const [depositedStakes, setDepositedStakes] = useState([])
  const [password, setPassword] = useState('');
  const [validatorKeyFilePaths, setValidatorKeyFilePaths] = useState([])
  const [depositDataFilePath, setDepositDatafilePath] = useState('')
  const { data: userBids, loading: userLoading } = useGetUserBidsQuery({
    variables: { user: "0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA" || '' },
    pollInterval: 2000,
  })
  const { data: notUserBids, loading: competingLoading } = useGetCompetingBidsQuery({
    variables: { user: "" || '' },
    pollInterval: 2000,
  })
  // const user = "0x7631FCf7D45D821cB5FA688fADa7bbc76714B771"
  const { data: stakes, loading: stakesLoading } = useGetDepositedStakesByAddressQuery({
    variables: { stakerAddress: stakerAddress },
    pollInterval: 2000,
  })

  const { data: stakesByAddres } = useGetStakesByAddressQuery({
    variables: { stakerAddress: stakerAddress },
    pollInterval: 2000,
  })
  

  const { data: bid } = useGetBidByIdQuery({
    variables: { bidId: 2 },
    pollInterval: 2000,
  })
  const { data: allStakes } = useGetAllStakesQuery({
    pollInterval: 2000,
  })
  
  const handleStakerAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => setStakerAddress(event.target.value)
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

  const getDepositedStakes = () => {
    // let stakes = Get the list of Stake structs such that 
    // (stake.staker_address == stakerAddress) AND (stake.phase == DEPOSITED)
    
    // For Testing
    let stakes = [...depositedStakes, "Stakes of " + stakerAddress];    

    setDepositedStakes(stakes);
  }

  const selectValidatorKeyFiles = () => {
    window.api.receiveSelectedFilesPaths((event:Electron.IpcMainEvent , files: [string]) => {
      console.log(files)
      setValidatorKeyFilePaths(files)
    })
    window.api.reqSelectFiles();    
  }

  const selectDepositDataFile = () => {
    window.api.receiveSelectedFilesPaths((event: Electron.IpcMainEvent, files: [string]) => {
      console.log(files)
      setDepositDatafilePath(files[0])
    })
    window.api.reqSelectFiles();    
  }

  const buildStakerRequest = () => {
    window.api.receiveKeyGenerationConfirmation((event:Electron.IpcMainEvent , args: [string]) => {
      console.log(args)
    })
    // console.log(validatorKeyFilePaths)
    window.api.reqNewMnemonic("english")
    // console.log("user Bids")
    // console.log(userBids)
    // console.log("Not User Bids")
    // console.log(notUserBids)
    // console.log("stakes by Address and phase == depositied")
    // console.log(stakes)
    // console.log("Stakes by address")
    // console.log(allStakes)
    // console.log("bid id == 2")
    // console.log(bid)
    if (!validatorKeyFilePaths || !depositDataFilePath || !password) {
        console.log("Please enter all the required information")
        return
    }

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
        <Button colorScheme='blue' onClick={selectValidatorKeyFiles}>Select Validator KeyStore File ("keystore-m_...") </Button>
        </Center>

        <Text color="red.500" fontSize='xl'> 3. Input Deposit Data File </Text>
        <Center>
        <Button colorScheme='blue' onClick={selectDepositDataFile}>Select DepositData Files ("deposit_data-...")</Button>
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
          <Button colorScheme='blue' onClick={buildStakerRequest}>Encrypt</Button>
        </Center>

        </ScaleFade>
    </Box>
    </Center>
  )
}

export default StakerTab