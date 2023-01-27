import React from 'react'
import { Box, Center, ScaleFade } from '@chakra-ui/react'
import raisedWidget from '../styleClasses/stakeWidgetStyle'


const StakeTab = ({ account, tabIndex, navigateTo }) => {

  return (
    <Center>
    <Box maxW={'800px'}>
      {account && (
        <ScaleFade initialScale={0.5} in={tabIndex === 0}>
          <Center sx={raisedWidget}>
            <Wizard navigateTo={navigateTo} />
          </Center>
        </ScaleFade>
      )}
    </Box>
    </Center>
  )
}

export default StakerTab