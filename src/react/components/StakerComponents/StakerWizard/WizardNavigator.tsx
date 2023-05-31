import React from 'react';
import { Center, Grid, Button, GridItem } from '@chakra-ui/react'


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
            <Grid templateColumns='repeat(2, 1fr)' gap={6} mt="auto">
                <GridItem w='100%'>
                    <Center>
                        {props.backDetails.visible &&
                            <Button {...props.backProps}>
                                {props.backDetails.text}
                            </Button>
                        }
                    </Center>
                </GridItem>
                <GridItem w='100%'>
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
