import React, { useEffect, useState } from 'react';
import { Box, Center, ScaleFade, Input, Button, Text } from '@chakra-ui/react'
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle'
import {useGetCompetingBidsQuery, useGetUserBidsQuery, useGetDepositedStakesByAddressQuery, useGetBidByIdQuery, useGetStakesByAddressQuery, useGetAllStakesQuery } from '../../clients/subgraph/generated'
interface TabProps {
  tabIndex: number;
}

const StakerTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
  const [connectedWallet, setConnectedWallet] = useState("0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA") // hardcoded for now
  const [mnemonic, setMnemonic] = useState("") // hardcoded for now
  const [password, setPassword] = useState('');

  // Might need this in future...
  const [validatorKeyFilePaths, setValidatorKeyFilePaths] = useState([])
  const [depositDataFilePath, setDepositDatafilePath] = useState('')


  const generateMnemonic = () => {
    window.api.receiveNewMnemonic((event:Electron.IpcMainEvent , args: [string]) => {
      const newMnemonic = args[0];
      setMnemonic(newMnemonic)
    })
    window.api.reqNewMnemonic("english");
  }

  return (
    <Center>
    <ScaleFade initialScale={0.5} in={tabIndex === 0}>
      <Box maxW={'800px'} sx={raisedWidgetStyle}>
        <Center>
          <Button colorScheme='blue' onClick={generateMnemonic}>Generate Mnemonic</Button>
        </Center>
        <Center>
          <Text color="white">Mnemonic: {mnemonic}</Text>
        </Center>
      </Box>
      </ScaleFade>
    </Center>
  )
}

export default StakerTab

// APPOLOO QUERIES..

// const { data: userBids, loading: userLoading } = useGetUserBidsQuery({
//   variables: { user: "0x2Fc348E6505BA471EB21bFe7a50298fd1f02DBEA" || '' },
//   pollInterval: 2000,
// })
// const { data: notUserBids, loading: competingLoading } = useGetCompetingBidsQuery({
//   variables: { user: "" || '' },
//   pollInterval: 2000,
// })
// // const user = "0x7631FCf7D45D821cB5FA688fADa7bbc76714B771"
// const { data: stakes, loading: stakesLoading } = useGetDepositedStakesByAddressQuery({
//   variables: { stakerAddress: stakerAddress },
//   pollInterval: 2000,
// })

// const { data: stakesByAddres } = useGetStakesByAddressQuery({
//   variables: { stakerAddress: stakerAddress },
//   pollInterval: 2000,
// })


// const { data: bid } = useGetBidByIdQuery({
//   variables: { bidId: 2 },
//   pollInterval: 2000,
// })
// const { data: allStakes } = useGetAllStakesQuery({
//   pollInterval: 2000,
// })


        // <Text color="red.500" fontSize='xl'> 1. See how many validators you can launch! </Text>


        // <Text color="red.500" fontSize='xl'> 
        //   You have staked {32*depositedStakes.length} (= 32 * {depositedStakes.length}) ETH and can launch {depositedStakes.length} staking nodes!{"\n"}
        //   Please, use the ETH CLI tool to generate new {depositedStakes.length} validator keys and deposit data. 
        // </Text>
        
        // <Text color="red.500" fontSize='xl'> 2. Input Validator Key Files </Text>
        // <Center>
        // <Button colorScheme='blue' onClick={selectValidatorKeyFiles}>Select Validator KeyStore File ("keystore-m_...") </Button>
        // </Center>

        // <Text color="red.500" fontSize='xl'> 3. Input Deposit Data File </Text>
        // <Center>
        // <Button colorScheme='blue' onClick={selectDepositDataFile}>Select DepositData Files ("deposit_data-...")</Button>
        // </Center>

        // <Text color="red.500" fontSize='xl'> 4. Input Password used to generate the validator keys and deposit data </Text>
        // <Input variant='filled' 
        // color="red.500"
        // value={password} 
        // onChange={handlePasswordChange} 
        // placeholder="password" /{'>'}
        //

        // <Text color="red.500" fontSize='xl'> 5. Finally, Encrypt them securely!</Text>

        // const handleStakerAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => setStakerAddress(event.target.value)
        // const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)


        // const getDepositedStakes = () => {
        //   // let stakes = Get the list of Stake structs such that 
        //   // (stake.staker_address == stakerAddress) AND (stake.phase == DEPOSITED)
          
        //   // For Testing
        //   let stakes = [...depositedStakes, "Stakes of " + connectedWallet];    
      
        //   setDepositedStakes(stakes);
        // }

          // const selectValidatorKeyFiles = () => {
  //   window.api.receiveSelectedFilesPaths((event:Electron.IpcMainEvent , files: [string]) => {
  //     console.log(files)
  //     setValidatorKeyFilePaths(files)
  //   })
  //   window.api.reqSelectFiles();    
  // }


  // const selectDepositDataFile = () => {
  //   window.api.receiveSelectedFilesPaths((event: Electron.IpcMainEvent, files: [string]) => {
  //     console.log(files)
  //     setDepositDatafilePath(files[0])
  //   })
  //   window.api.reqSelectFiles();    
  // }