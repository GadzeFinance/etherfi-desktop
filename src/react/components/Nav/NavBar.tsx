import React from 'react'
import isDev from 'react-is-dev'
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
    setNodeOperatorOperation: (operation: number) => void,
    selectedNodeOperatorOperation: number
    setStakerOperation: (operation: number) => void,
    selectedStakerOperation: number
    setSelectedDBOperation: (operation: number) => void,
    selectedDBOperation: number
}


const NodeOperatorDropDownOptions = {
    "Generate Keys": 0,
    "Decrypt Keys": 1
}

const StakerDropDownOptions = {
    "Generate & Encrypt Validator Keys": 0,
    "Generate Exit Request": 1
}

const DBDropDownOptions = {
    "Saved Mnemonics & Validator keys": 0,
    "Recent Activity": 1
}

const NavBar: React.FC<NavBarProps> = ({ 
    setNodeOperatorOperation, 
    selectedNodeOperatorOperation, 
    setStakerOperation, 
    selectedStakerOperation,
    setSelectedDBOperation,
    selectedDBOperation
}: NavBarProps) => {

    // TODO: MAKE THIS INTO A NICE COMPONENT!!! 
    const NodeOperatorTabDropDown = React.forwardRef((props, ref: any) => {
        const tabProps = useTab({ ...props, ref })

        const handleOptionSelect = (option: number) => {
            setNodeOperatorOperation(option);
        };

        // TODO: MAKE THIS have more options that are dynamic if you add an element to Node OperatorDrowDownOptions 
        return (
            <Menu  >
                {({ isOpen }) => (
                    <>
                        <MenuButton fontSize="18px" as={Button} width="10px" sx={tabButtonStyle} {...tabProps} rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}>
                            Node Operator
                        </MenuButton>
                        <MenuList sx={dropDownMenuStyle}>
                            <MenuItem sx={dropDownItemStyle} color={selectedNodeOperatorOperation === 0 ? "white" : COLORS.textSecondary}
                                onClick={() => handleOptionSelect(NodeOperatorDropDownOptions["Generate Keys"])}>
                                Generate keys
                            </MenuItem>
                            <MenuItem sx={dropDownItemStyle} color={selectedNodeOperatorOperation === 1 ? "white" : COLORS.textSecondary}
                                onClick={() => handleOptionSelect(NodeOperatorDropDownOptions["Decrypt Keys"])}>
                                Decrypt
                            </MenuItem>
                        </MenuList>
                    </>
                )
                }
            </Menu >
        )
    })

    const StakerTabDropDown = React.forwardRef((props, ref: any) => {
        const tabProps = useTab({ ...props, ref })

        const handleStakerOptionSelect = (option: number) => {
            setStakerOperation(option);
        };
        return (
            <Menu  >
                {({ isOpen }) => (
                    <>
                        <MenuButton fontSize="18px" as={Button} width="10px" sx={tabButtonStyle} {...tabProps} rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}>
                            Staker
                        </MenuButton>
                        <MenuList sx={dropDownMenuStyle}>
                            <MenuItem sx={dropDownItemStyle} color={selectedStakerOperation === 0 ? "white" : COLORS.textSecondary}
                                onClick={() => handleStakerOptionSelect(StakerDropDownOptions["Generate & Encrypt Validator Keys"])}>
                                Generate & Encrypt Validator Keys
                            </MenuItem>
                            <MenuItem sx={dropDownItemStyle} color={selectedStakerOperation === 1 ? "white" : COLORS.textSecondary}
                                onClick={() => handleStakerOptionSelect(StakerDropDownOptions["Generate Exit Request"])}>
                                Generate Exit Request
                            </MenuItem>
                        </MenuList>
                    </>
                )
                }
            </Menu >
        )
    })

    const DBExplorerDropdown = React.forwardRef((props, ref: any) => {
        const tabProps = useTab({ ...props, ref })

        const handleDBOptionSelect = (option: number) => {
            setSelectedDBOperation(option);
        };

        return (
            <Menu>
                {({ isOpen }) => (
                    <>
                    <MenuButton fontSize="18px" as={Button} width="10px" sx={tabButtonStyle} {...tabProps} rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} >
                        Admin
                    </MenuButton>
                    <MenuList sx={dropDownMenuStyle}>
                        <MenuItem sx={dropDownItemStyle} color={selectedDBOperation === 0 ? "white" : COLORS.textSecondary}
                            onClick={() => handleDBOptionSelect(DBDropDownOptions["Saved Mnemonics & Validator keys"])}>
                            Saved Mnemonics & Validator keys
                        </MenuItem>
                        <MenuItem sx={dropDownItemStyle} color={selectedDBOperation === 1 ? "white" : COLORS.textSecondary}
                            onClick={() => handleDBOptionSelect(DBDropDownOptions["Recent Activity"])}>
                            Recent Activity
                        </MenuItem>
                    </MenuList>
                    </>
                )}
            </Menu>
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
                        <StakerTabDropDown />
                        <NodeOperatorTabDropDown />
                        {isDev(React) && <DBExplorerDropdown/>}
                    </TabList>
                </GridItem>
            </Grid>
        </nav >
    )
}


export default NavBar
