import React, { useState } from 'react';
import { Box, Center, ScaleFade, Flex, Button, Text } from '@chakra-ui/react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'

interface WizardNavigatorProps {
    goBackStep: () => void,
    backVisible?: boolean,
    backText:string,
    goNextStep: () => void,
    nextVisible?: boolean,
    nextText: string,
}

const WizardNavigator: React.FC<WizardNavigatorProps> = ( props: WizardNavigatorProps) => {

    WizardNavigator.defaultProps = {
        backVisible: true,
        nextVisible: true,
    }
  return (
        <Box>
          <Flex justify={'flex-end'} align={'center'} mt="20px">
            {
                props.backVisible && (
                <Button variant="wizard-nav-button" maxWidth={'300px'} size={'sm'} onClick={props.goBackStep}>
                    {props.backText}
                </Button>
                )
            }
            {
                props.nextVisible && (
                    <Button variant="wizard-nav-button" maxWidth={'300px'} size={'sm'} onClick={props.goNextStep}>
                        {props.nextText}
                    </Button>
                )
            }
          </Flex>
        </Box>
  )
}

export default WizardNavigator
