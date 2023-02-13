import React, { useState } from 'react';
import { Box, Center, ScaleFade, Input, Button, Text } from '@chakra-ui/react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'

interface DisplayMnemonicProps {
    mnemonic: string;
}

const DisplayMnemonic: React.FC<DisplayMnemonicProps> = ({ mnemonic }: DisplayMnemonicProps) => {

  return (

        <Box>
            <Text fontSize='18px' as='b' color="white">Below is your Mnemonc. Make sure you securly back it up. You will need it to withdraw you ETH</Text>
            <Text color="white" opacity={'0.7'}>{mnemonic}</Text>
        </Box>
  )
}

export default DisplayMnemonic
