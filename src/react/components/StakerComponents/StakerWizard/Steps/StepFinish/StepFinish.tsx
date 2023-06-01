import React from 'react'
import { Flex, Text, Center, VStack } from '@chakra-ui/react'
import WizardNavigator from '../../WizardNavigator'
import { IconCheckMark } from '../../../../Icons'
import { COLORS } from '../../../../../styleClasses/constants';


interface StepFinishProps {
    goBackStep: () => void,
}

const StepFinish: React.FC<StepFinishProps> = (props) => {

    const backDetails = {
        text: "Back",
        visible: true,
    }

    const backProps = {
        onClick: props.goBackStep,
        variant: "back-button",
    }

    const nextDetails = {
        text: "Close",
        visible: true,
    }

    const nextProps = {
        isDisabled: false,
        onClick: window.utilsApi.stakerFinish,
        variant: "white-button",
    }
    return (
        <>
            <Flex
                padding={'24px'}
                direction={'column'}
                gap="16px"
                bgColor="purple.dark"
                height="full"
                width={'full'}
                borderRadius="lg"
                justify="center"
            >
                <VStack spacing={5}>
                    <IconCheckMark boxSize='100' />
                    <Text color={'white'} fontSize="2xl" fontWeight={'semibold'} align="center">
                        Congrats, all the steps completed!
                    </Text>
                    <Center width='75%'>
                        <Text fontSize="14px" color={COLORS.textSecondary} align="center">
                            Go back to the {<Text color='white' as='b'>web dApp</Text>} and continue the staking process.
                        </Text>
                    </Center>

                    <WizardNavigator nextProps={nextProps} backProps={backProps} nextDetails={nextDetails} backDetails={backDetails} />

                    <Text fontSize="14px" color={COLORS.textSecondary} align="center">
                        {<Text as='b' color='white'>Note:</Text>} Pressing 'Close' will clear your clipboard and quit the app.
                    </Text>
                </VStack>

            </Flex>
        </>
    )
}

export default StepFinish