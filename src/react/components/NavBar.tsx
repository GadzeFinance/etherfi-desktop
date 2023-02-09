import React from 'react'
import { Flex, Tab, TabList, Image, Center } from '@chakra-ui/react'
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
                        <Tab sx={tabButtonStyle}>Staker!</Tab>
                        <Tab sx={tabButtonStyle}> Node Operator!</Tab>
                    </TabList>
                </Center>
            </Flex>
        </nav>
    )
}


export default NavBar
