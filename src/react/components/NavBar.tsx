import React from 'react'
import { Flex, Tab, TabList, Image, Center, Grid, GridItem } from '@chakra-ui/react'
import tabButtonStyle from '../styleClasses/tabButtonStyle'
import EtherFiLogo from '../assets/geo-logo-colour-landscape.png'


const NavBar: React.FC = () => {
    return (
        <nav>
            <Flex height={'54px'} mx='40px'>
                <Center height={'full'} width={'200px'}>
                    <Image src={EtherFiLogo} />
                </Center>
                <Center height={'full'} flex='auto'>
                    <TabList color='white'>
                        <Tab sx={tabButtonStyle}>Staker</Tab>
                        <Tab sx={tabButtonStyle}> Node Operator</Tab>
                    </TabList>
                </Center>
            </Flex>
        </nav>
    )
}


export default NavBar


{/* <Grid templateColumns='repeat(5, 1fr)' gap={6}>
<GridItem w='100%' h='10' bg='blue.500'>
    <Tab sx={tabButtonStyle}>Encrypt Validator Keys</Tab>
</GridItem>
<GridItem w='100%' h='10' bg='blue.500'>
    <Tab sx={tabButtonStyle}>Generate Encryption Keys</Tab>
</GridItem>
<GridItem w='100%' h='10' bg='blue.500'>
    <Tab sx={tabButtonStyle}> Decrypt Validator Keys</Tab>
</GridItem>
</Grid> */}