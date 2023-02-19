import React from 'react'
import { Flex, Tab, TabList, Image, Center, Grid, GridItem, textDecoration } from '@chakra-ui/react'
import tabButtonStyle from '../../styleClasses/tabButtonStyle'
import EtherFiLogo from '../../assets/geo-logo-colour-landscape.png'
import { useState } from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Box,
    useTab,
    useMultiStyleConfig

} from '@chakra-ui/react';
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
        // 1. Reuse the `useTab` hook
        const isSelected = !!tabProps['aria-selected']

        return (
            <Menu  >
                {({ isOpen }) => (
                    <>
                        <MenuButton fontSize="18px" as={Button} width="10px" sx={tabButtonStyle} {...tabProps} rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}>
                            Node Operator
                        </MenuButton>
                        <MenuList sx={{ border: "0px", width: "10px", bg: COLORS.tabSelectionBlue }} fontSize="16px">
                            <MenuItem bg={COLORS.tabSelectionBlue} color={selectedOption === 0 ? "white" : COLORS.textSecondary} _hover={{ textDecoration: "underline", color: "white" }} onClick={() => handleOptionSelect(dropDownOptions["Generate Keys"])}>
                                Generate keys
                            </MenuItem>
                            <MenuItem bg={COLORS.tabSelectionBlue} color={selectedOption === 1 ? "white" : COLORS.textSecondary} _hover={{ textDecoration: "underline", color: "white" }} onClick={() => handleOptionSelect(dropDownOptions["Decrypt Keys"])}>
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
            <Grid templateColumns="1fr 1fr" gap={6} alignItems="center" >
                <GridItem >
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
