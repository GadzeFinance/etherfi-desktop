import React, { useState } from 'react';
import { Box, Center, Grid, Flex, Button, Text, GridItem } from '@chakra-ui/react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'

interface WizardNavigatorProps {
    goBackStep?: () => void,
    backVisible?: boolean,
    backText?:string,
    goNextStep?: () => void,
    nextVisible?: boolean,
    nextText?: string,
    nextProps?: Object,
}

const WizardNavigator: React.FC<WizardNavigatorProps> = ( props: WizardNavigatorProps) => {

    WizardNavigator.defaultProps = {
        goBackStep: () => {},
        backVisible: false,
        backText: "",
        goNextStep: () => {},
        nextText: "",
        nextVisible: false,
        nextProps: {},
    }

  return (
    <Grid templateColumns='repeat(2, 1fr)' gap={6}>
        <GridItem w='100%' h='10'>
        <Center>
            {props.backVisible && (
                <Button variant="wizard-nav-button" maxWidth={'300px'} size={'sm'} onClick={props.goBackStep}>
                    {props.backText}
                </Button>
            )}
        </Center>
        </GridItem>
        <GridItem w='100%' h='10'>
            <Center>
            {props.nextVisible && (
                <Button variant="wizard-nav-button" maxWidth={'300px'} size={'sm'} onClick={props.goNextStep} {...props.nextProps}>
                    {props.nextText}
                </Button>
            )}
            </Center>
        </GridItem>
    </Grid>
  )
}
export default WizardNavigator
