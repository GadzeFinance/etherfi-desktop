import React, { useState } from 'react';
import { Box, Center, Grid, Flex, Button, Text, GridItem, propNames } from '@chakra-ui/react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'

interface buttonDetails {
    text: string,
    visible: boolean
}
interface WizardNavigatorProps {
    backDetails: buttonDetails,
    nextDetails: buttonDetails,
    backProps: object,
    nextProps: object,
}

const WizardNavigator: React.FC<WizardNavigatorProps> = (props: WizardNavigatorProps) => {

    return (
        <>
            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                <GridItem w='100%' h='10'>
                    <Center>
                        {props.backDetails.visible &&
                            <Button {...props.backProps}>
                                {props.backDetails.text}
                            </Button>
                        }
                    </Center>
                </GridItem>
                <GridItem w='100%' h='10'>
                    <Center>
                        {props.nextDetails.visible &&
                            <Button  {...props.nextProps}>
                                {props.nextDetails.text}
                            </Button>
                        }
                    </Center>
                </GridItem>
            </Grid>
        </>
    )

}


export default WizardNavigator
