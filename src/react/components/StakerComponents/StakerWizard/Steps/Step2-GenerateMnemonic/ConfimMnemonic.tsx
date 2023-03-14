import React, { useState, useEffect } from 'react';
import { Box, Text, GridItem, Grid, VStack, Input, UnorderedList, ListItem } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import IconAlertTriangle from '../../../../Icons/IconAlertTriangle'
import clickableIconStyle from '../../../../../styleClasses/clickableIconStyle'

interface ConfirmMnemonicProps {
    mnemonic: string,
    wordsToConfirmIndicies: Array<number>,
    setMnemonicConfirmed: (confirmed: boolean) => void;
}


const ConfirmMnemonic: React.FC<ConfirmMnemonicProps> = ({ mnemonic, wordsToConfirmIndicies, setMnemonicConfirmed, }:
    ConfirmMnemonicProps) => {

    const words = mnemonic.split(" ")
    const [enteredConfirmationWords, setEnteredConfirmationWords] = useState<string[]>(['', '', '', ''])
    // Initialize entered words as '' so we can choose the correct variant for the input box
    const wordsToConfirm = wordsToConfirmIndicies.map(index => (words[index]))
    const correctWords = wordsToConfirm.map((word, index) => enteredConfirmationWords[index] === word)

    const [showErrorMessage, setShowErrorMessage] = useState(false);
    useEffect(() => {
        // Not all empty or not all correct show error message
        if (correctWords.every(correct => correct)) {
            setMnemonicConfirmed(true)
        } else {
            setMnemonicConfirmed(false)
        }

        if (enteredConfirmationWords.every(enteredWord => (enteredWord === '')) || correctWords.every(correct => correct)) {
            setShowErrorMessage(false)
        } else {
            setShowErrorMessage(true)
        }

    }, [enteredConfirmationWords]);

    const getInputVariant = (wordIndex: number) => {
        if (enteredConfirmationWords[wordIndex] === '') return 'confirm-mnemonic'
        if (correctWords[wordIndex]) return 'correct-mnemonic'
        else return 'wrong-mnemonic'
    }
    return (
        <>
            <Text color={'white'} fontSize="2xl" fontWeight={'semibold'}>
                Confirm Your Mnemonic Phrase
            </Text>
            <Grid
                templateColumns="repeat(2, 1fr)"
                templateRows="repeat(2, 1fr)"
                gap={4}
            >
                {wordsToConfirmIndicies.map((wordNum, index) => (
                    <GridItem key={index} colSpan={1} rowSpan={1} >
                        <VStack alignItems="left">
                            <Text mb="-5px" sx={{ fontSize: '10px', color: '#EEF0FF' }}>WORD: {wordNum + 1}</Text>
                            <Input placeholder='Type here' color="#CED0DD" variant={getInputVariant(index)} onChange={(e) => {
                                const newEnteredWords = [...enteredConfirmationWords];
                                newEnteredWords[index] = e.target.value;
                                setEnteredConfirmationWords(newEnteredWords);
                            }}></Input>
                        </VStack>
                    </GridItem>
                ))
                }
            </Grid >
            {showErrorMessage && (
                <UnorderedList>
                    <ListItem fontSize="12px" color="red.warning">
                        One or more of your words are wrong.
                    </ListItem>
                </UnorderedList>
            )}
        </>
    )
}

export default ConfirmMnemonic
