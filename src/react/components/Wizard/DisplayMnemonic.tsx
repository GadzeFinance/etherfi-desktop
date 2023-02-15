import React from 'react';
import { Box, Text } from '@chakra-ui/react'


interface DisplayMnemonicProps {
  mnemonic: string;
}

const DisplayMnemonic: React.FC<DisplayMnemonicProps> = ({ mnemonic }: DisplayMnemonicProps) => {

  const formattedWords = () => {
    const words = mnemonic.split("")
  }

  return (
    <Box>
      <Text fontSize='14px' as='b' color="white">Below is your Mnemonic. Make sure you securly back it up. You will need it to withdraw you ETH</Text>


      <Text color="white" opacity={'0.7'}>{mnemonic}</Text>
    </Box>
  )
}

export default DisplayMnemonic
