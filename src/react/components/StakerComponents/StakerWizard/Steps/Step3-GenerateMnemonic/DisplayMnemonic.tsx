import React, { useState } from 'react';
import { Box, Text, GridItem, Grid, HStack, Tooltip, Center, Button, VStack } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { IconAlertTriangle } from '../../../../Icons'
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
    window.utilsApi.copyToClipBoard(mnemonic)
    setCopied(true)
  }

  return (
    <>
      <Text mb="-20px" color={'white'} fontSize="2xl" fontWeight={'semibold'}>
        Your Mnemonic Phrase
      </Text>
      <Grid
        gridTemplateColumns={'75% 25%'}
      >
        <GridItem sx={{ display: 'flex', justifyContent: 'center' }}>
          <HStack >
            <IconAlertTriangle stroke="#FFC700" boxSize="4" />
            <Text variant="alert-text">Make sure you save this phrase. It cannot be recovered.</Text>
          </HStack>
        </GridItem >
        <GridItem sx={{ display: 'flex', justifyContent: 'center' }}>
          <Center>
            <VStack>
              <Tooltip label={copied ? 'Copied' : 'Copy'} closeOnClick={false}>
                <Button size='sm' variant='blur-button' onClick={copyMnemonic} rightIcon={<CopyIcon boxSize={4} />}> Copy</Button>
              </Tooltip>
              <Button size='sm' onClick={() => setBlurred(!blurred)} variant='blur-button'>
                {blurred ? 'Unblur' : 'Blur'}
              </Button>
            </VStack>
          </Center>
        </GridItem >
      </Grid>
      {formattedWords()}
    </>
  )
}

export default DisplayMnemonic
