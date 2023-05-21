import React, { useState, useEffect } from "react";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import {
  Button,
  Center,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface AddressSelectProps {
  currAddress: string
  setCurrAddress: (addr: string) => void
  addressList: string[]
}

const AddressSelect = (props: AddressSelectProps) => {

  const menuOnClick = (address: string) => {
    props.setCurrAddress(address)
  }

  return (
    <Menu>
      <Center>
        <MenuButton
            w="450px !important" mt="12px" mb="16px" pt="23px" pb="23px"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            disabled={props.addressList?.length === 0}
        >
          { props.addressList?.length > 0 ? props.currAddress : "There is no address stored." }
        </MenuButton>
        <MenuList w="450px !important">
            { props.addressList?.map((address: string) => (
                <MenuItem onClick={() => menuOnClick(address)} key={address}>
                    <Box w="100%">
                      <Text>{address}</Text>
                    </Box>
                </MenuItem>
            ))}
        </MenuList>
        </Center>
    </Menu>
  )

};

export default AddressSelect;