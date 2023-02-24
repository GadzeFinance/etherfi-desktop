import React from 'react'
import {
    Tab, TabList, Image, Center, Grid, GridItem,
    Menu, MenuButton, MenuList, MenuItem, Button, useTab
} from '@chakra-ui/react'
import tabButtonStyle from '../../styleClasses/tabButtonStyle'
import { dropDownItemStyle, dropDownMenuStyle } from '../../styleClasses/nodeOperatorDropDownStyles'
import EtherFiLogo from '../../assets/Logo.png'
import { COLORS } from '../../styleClasses/constants'


import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'

interface NavBarProps {
    setNodeOperatorOption: (option: number) => void,
    selectedOption: number
}


const dropDownOptions = {
    "Generate Keys": 0,
    "Decrypt Keys": 1
}

const NavBar: React.FC<NavBarProps> = ({ setNodeOperatorOption, selectedOption }: NavBarProps) => {

    const NodeOperatorTab = React.forwardRef((props, ref: any) => {
        const tabProps = useTab({ ...props, ref })

        const handleOptionSelect = (option: number) => {
            setNodeOperatorOption(option);
        };

        return (
            <Menu  >
                {({ isOpen }) => (
                    <>
                        <MenuButton fontSize="18px" as={Button} width="10px" sx={tabButtonStyle} {...tabProps} rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}>
                            Node Operator
                        </MenuButton>
                        <MenuList sx={dropDownMenuStyle}>
                            <MenuItem sx={dropDownItemStyle} color={selectedOption === 0 ? "white" : COLORS.textSecondary}
                                onClick={() => handleOptionSelect(dropDownOptions["Generate Keys"])}>
                                Generate keys
                            </MenuItem>
                            <MenuItem sx={dropDownItemStyle} color={selectedOption === 1 ? "white" : COLORS.textSecondary}
                                onClick={() => handleOptionSelect(dropDownOptions["Decrypt Keys"])}>
                                Decrypt
                            </MenuItem>
                        </MenuList>
                    </>
                )
                }
            </Menu >
        )
    })

    return (
        <nav>
            <Grid templateColumns="1fr 1fr" gap={6} alignItems="center" justifyContent="center" mt="10px">
                <GridItem ml="30px">
                    <Center height={'full'} width={'200px'}>
                        <Image src={EtherFiLogo} />
                    </Center>
                </GridItem>
                <GridItem>
                    <TabList color='white' gap={4} justifyContent="flex-end" mr="30px">
                        <Tab sx={tabButtonStyle}>Staker</Tab>
                        <NodeOperatorTab />
                    </TabList>
                </GridItem>
            </Grid>
        </nav >
    )
}


export default NavBar
