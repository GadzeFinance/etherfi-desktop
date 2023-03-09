import React, { useState } from 'react';
import { Box, Text, GridItem, Grid, HStack, Tooltip, Center, Button } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import IconAlertTriangle from '../../../../Icons/IconAlertTriangle'
import clickableIconStyle from '../../../../../styleClasses/clickableIconStyle'

interface DisplayMnemonicProps {
  mnemonic: string;
}

const DisplayMnemonic: React.FC<DisplayMnemonicProps> = ({ mnemonic }: DisplayMnemonicProps) => {

  const [copied, setCopied] = useState<boolean>(false)
  const [blurred, setBlurred] = useState<boolean>(true)

  const formattedWords = () => {
    const words = mnemonic.split(" ")

    return (
      <Grid
        templateColumns="repeat(4, 1fr)"
        templateRows="repeat(6, 1fr)"
        gap={2}
      >
        {words.map((word, index) => (
          <GridItem key={index} colSpan={1} rowSpan={1} >
            <Box
              borderWidth="1px"
              borderStyle="solid"
              borderColor='purple.light'
              borderRadius="5px"
              bg='purple.darkBackground'
              justifyContent='center'
              alignItems='center'
            >

              <Text ml="5px" color="white" fontSize="12px" as='b' >
                {index + 1}: {<Text ml="5px" color="white" fontSize="12px" as='b' sx={{ filter: `blur(${blurred ? 3 : 0}px)` }}> {word} </Text>}
              </Text>
            </Box>
          </GridItem>
        ))
        }
      </Grid >
    )
  }

  const copyMnemonic = () => {
    window.api.copyToClipBoard(mnemonic)
    setCopied(true)
  }

  return (
    <>
      <Text color={'white'} fontSize="2xl" fontWeight={'semibold'}>
        Your Mnemonic Phrase
      </Text>
      <Grid
        gridTemplateColumns={'50% 25% 25%'}
      >
        <GridItem >
          <HStack >
            <IconAlertTriangle boxSize="3" />
            <Text variant="warning-text">Make sure you save this phrase. It cannot be recovered.</Text>
          </HStack>
        </GridItem >
        <GridItem>
          <Center>
            <Button size='sm' onClick={() => setBlurred(!blurred)} variant='blur-button'>
              {blurred ? 'Unblur' : 'Blur'}
            </Button>
          </Center>
        </GridItem >
        <GridItem sx={{ display: 'flex', justifyContent: 'center' }}>
          <Center >
            <Tooltip label={copied ? 'Copied' : 'Copy'} closeOnClick={false}>
              <CopyIcon sx={clickableIconStyle} onClick={copyMnemonic} boxSize={4} />
            </Tooltip>
          </Center>
        </GridItem >
      </Grid>
      {formattedWords()}
    </>
  )
}

export default DisplayMnemonic