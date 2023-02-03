import React from 'react';
import { NumberInput, Button, Flex, NumberInputField,Text, VStack, Box, StackDivider} from '@chakra-ui/react';
import { COLORS } from '../styleClasses/constants';

interface BidData {
    placeholder: string,
    value: number,
    setter: (value: number) => void,
    increment: number, 
    MIN: number, 
    MAX: number
  }
  

const BidInput: React.FC<BidData> = ({placeholder, value, setter, increment, MIN, MAX} : BidData) => {

    const modifyValue = (newValue: number) => {
        if (value >= MIN && value <= MAX) {
            setter(newValue);
        } else if (value > MAX) {
            setter(MAX)
        } else {
            setter(MIN)
        }

    }

    return (          
        <>
        <VStack
        spacing={0}
        align='stretch'
        >
        <Box h='40px'>
        <Text  as='b' color="white">{placeholder}</Text>
        </Box>
        <Box h='40px'>
        <Flex alignItems="center">
        <NumberInput min={MIN} max={MAX} color="white" value={value} onChange={(valAsString:string, valueAsNumber: number ) => modifyValue(valueAsNumber)}>
                <NumberInputField />
            </NumberInput>
            <Button variant="outline" onClick={() => {if (value > MIN) setter(value-increment)}} color={COLORS.etherFiRed}>-</Button>

            <Button variant="outline" onClick={() => {if (value < MAX) setter(value+increment)}} color="rgb(0, 241, 125)">+</Button>
            </Flex>  
        </Box>
        </VStack>
  

        </>       
    )
}

export default BidInput