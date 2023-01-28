import React, {useState} from 'react';
import { Box, Center, ScaleFade, Input, NumberInput, Button, Flex, NumberInputField, VStack } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/raisedWidgetStyle';
import BidInput from '../BidInput';


const NodeOperatorTab = ({ tabIndex }) => {
    const [bidSize, setBidSize] = useState(1);
    const [bidPrice, setBidPrice] = useState(0.01);

    const generateBidRequest = () => {
        // Validate the bid Size and Bid Price values

        // Send Request to backend to make the keys

        // 

    }


  return (
    <Center>
        <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
            
            <ScaleFade initialScale={0.5} in={tabIndex === 1}>
            <VStack
                spacing={4}
                align='stretch'
                >
                <Box>
                    <BidInput placeholder="Bid Size:" value={bidSize}
                            setter={setBidSize} MIN={1} MAX={100}
                            increment={1}
                            preci
                    />
                </Box>
                <Box>
                    <BidInput placeholder="Bid Price:" value={bidPrice}
                            setter={setBidPrice} MIN={0.01} MAX={100}
                            increment={0.01}
                    />
                </Box>
                <Box>
                    <Center>
                    <Button bg="green" color="white" onClick={generateBidRequest}>Generate Bid Request</Button>
                    </Center>
                </Box>
            </VStack>
            </ScaleFade>
        </Box>
    </Center>
  )
}

export default NodeOperatorTab