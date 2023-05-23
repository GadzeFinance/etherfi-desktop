import React from 'react';
import { Flex, Text, VStack, Box, keyframes } from '@chakra-ui/react';
import { COLORS } from '../styleClasses/constants';
import { ClockWiseElipse, CounterClockWiseElipse } from './Icons/Elipses';
import { time } from 'console';


interface SpinnerData {
    text: string,
    loading: boolean,
    keysGenerated?: number,
    keysTotal?: number,
    recentUsedTime?: number
}

const EtherFiSpinner: React.FC<SpinnerData> = (props: SpinnerData) => {
    const Spinner = () => {
        const clockWise = keyframes`
            from {transform: rotate(0deg);} 
            to {transform: rotate(360deg)},
            `;
        const counterClockWise = keyframes`
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          `;
        return (
            <>
                <Box>
                    <Flex align="center" justify="center" height="100%" width="100%">
                        <Box position="relative" width="200px" height="200px">
                            <Box position="absolute" top="25px" left="25px" width="40px" height="40px" zIndex="1">
                                <ClockWiseElipse fadestyle="largeRed" boxSize={"150px"} sx={{ animation: `${clockWise} infinite 3s linear`, transformOrigin: 'center' }} />
                            </Box>
                            <Box position="absolute" top="50px" left="50px" width="40px" height="40px" zIndex="2">
                                <CounterClockWiseElipse fadestyle="mediumBlue" color={COLORS.primaryBlue} id="medium" boxSize={"100px"} sx={{ animation: `${counterClockWise} infinite 4s linear`, transformOrigin: 'center' }} />
                            </Box>
                            <Box position="absolute" top="65px" left="65px" width="40px" height="40px" zIndex="2">
                                <ClockWiseElipse fadestyle="smallRed" boxSize={"70px"} sx={{ animation: `${clockWise} infinite 5s linear`, transformOrigin: 'center' }} />
                            </Box>
                            <Box position="absolute" top="80px" left="80px" width="40px" height="40px" zIndex="2">
                                <CounterClockWiseElipse fadestyle="smallBlue" color={COLORS.primaryBlue} id="medium" boxSize={"40px"} sx={{ animation: `${counterClockWise} infinite 6s linear`, transformOrigin: 'center' }} />
                            </Box>
                        </Box>
                    </Flex>
                </Box>
            </>
        )
    }

    return (
        <>
            {props.loading && (
                <VStack
                    spacing={5}>
                    <Spinner />
                    <Text color={'white'} fontSize="2xl" fontWeight={'semibold'} align="center">
                        {props.text}
                    </Text>
                    { props.keysGenerated && props.keysTotal && (
                        <Box>
                            <Text fontSize="xl" color="white">
                                {props.keysGenerated} / {props.keysTotal} Estimated Time: {`${Math.floor(props.recentUsedTime * (props.keysTotal - props.keysGenerated))}s`}
                            </Text>
                        </Box>) }
                </VStack>
                
            )}

        </>
    )
}


export default EtherFiSpinner
