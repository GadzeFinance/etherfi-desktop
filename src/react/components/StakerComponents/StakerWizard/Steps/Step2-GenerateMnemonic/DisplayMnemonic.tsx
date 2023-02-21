import React, { useState } from 'react';
import { Box, Text, GridItem, Grid, HStack, Tooltip, Center } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import IconAlertTriangle from '../../../../Icons/IconAlertTriangle'
import clickableIconStyle from '../../../../../styleClasses/clickableIconStyle'

interface DisplayMnemonicProps {
  mnemonic: string;
}

const DisplayMnemonic: React.FC<DisplayMnemonicProps> = ({ mnemonic }: DisplayMnemonicProps) => {

  const [copied, setCopied] = useState<boolean>(false)

  const formattedWords = () => {
    const words = mnemonic.split(" ")

    return (
      <Grid
        templateColumns="repeat(4, 1fr)"
        templateRows="repeat(6, 1fr)"
        gap={2}
      >
        {words.map((word, index) => (
          <GridItem key={index} colSpan={1} rowSpan={1}>
            <Box
              borderWidth="1px"
              borderStyle="solid"
              borderColor='purple.light'
              borderRadius="5px"
              bg='purple.darkBackground'
            >

              <Text ml="5px" color="white" fontSize="14px" as='b'>
                {index + 1}: {word}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>
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
        gridTemplateColumns={'75% 25%'}
      >
        <GridItem >
          <HStack >
            <IconAlertTriangle boxSize="3" />
            <Text variant="warning-text">Make sure you save this phrase. It cannot be recovered.</Text>
          </HStack>

        </GridItem >
        <GridItem>
          <Center>
            <Tooltip label={copied ? 'Copied' : 'Copy'} closeOnClick={false}>

              <CopyIcon sx={clickableIconStyle} onClick={copyMnemonic} boxSize={4} />

              {/* <Button fontSize="14" color="blue.secondary" _hover={{ bg: 'blue.light', color: "white" }} bg="transparent" onClick={() => window.api.copyToClipBoard(mnemonic)} rightIcon={<CopyIcon boxSize={4} />}> Copy</Button> */}
            </Tooltip>
          </Center>

        </GridItem >

      </Grid>

      {formattedWords()}
    </>
  )
}

export default DisplayMnemonic
