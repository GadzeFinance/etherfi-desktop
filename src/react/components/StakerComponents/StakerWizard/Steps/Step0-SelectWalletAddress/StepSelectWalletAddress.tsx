import React, { useEffect, useState } from "react";
import { Flex, Text, Center, Select } from "@chakra-ui/react";
import WizardNavigator from "../../WizardNavigator";
import AddressInput from "../../../../AddressInput";

import useGetStakerAddresses from "../../../../../hooks/useGetStakerAddress";

interface StepSelectWalletAddressProps {
    goNextStep: () => void;
    goBackStep: () => void;
    setDropWalletAddress: (wallet: string) => void;
    dropWalletAddress: string;
    setTypeWalletAddress: (wallet: string) => void;
    typeWalletAddress: string
}

const StepSelectWalletAddress: React.FC<StepSelectWalletAddressProps> = (
    props
) => {
    const {addressOptions, error} = useGetStakerAddresses();
    const [isAddressValid, setIsAddressValid] = React.useState(false);

    const backDetails = {
        text: "back",
        visible: false,
    };

    const backProps = {
        onClick: props.goBackStep,
        variant: "white-button",
    };

    const nextDetails = {
        text: "Proceed",
        visible: true,
    };

    const nextProps = {
        isDisabled: !(isAddressValid || props.dropWalletAddress),
        onClick: props.goNextStep,
        variant: "white-button",
    };

    useEffect(() => {
        if (props.dropWalletAddress != '') {
            props.setTypeWalletAddress('');
        } else if (props.typeWalletAddress != '') {
            props.setDropWalletAddress('')
        }
    }, [props.dropWalletAddress, props.typeWalletAddress])

    return (
        <Flex
            padding={"24px"}
            direction={"column"}
            gap="16px"
            bgColor="purple.dark"
            height="full"
            width={"full"}
            borderRadius="lg"
        >
            <Text color={"white"} fontSize="2xl" fontWeight={"semibold"}>
                Select Wallet Address
            </Text>
            <Text color="white" opacity={"0.7"}>
                Something about wallet address IDK
            </Text>
            <Select
                color="white"
                borderColor="purple.light"
                placeholder="Select Wallet Address"
                onChange={(e) => {
                    props.setDropWalletAddress(e.target.value)
                    props.setTypeWalletAddress('')
                }}
                value={props.dropWalletAddress}
            >
                {!error && addressOptions?.map((address: string) => (
                    <option key={address}>{address}</option>
                ))}
            </Select>
            <Center>
                <Text color={"white"} fontSize="2xl" fontWeight={"semibold"}>
                    or
                </Text>
            </Center>
            <AddressInput
                address={props.typeWalletAddress}
                setAddress={props.setTypeWalletAddress}
                setDropWalletAddress={props.setDropWalletAddress}
                isAddressValid={isAddressValid}
                setIsAddressValid={setIsAddressValid}
                shouldDoValidation={true}
            />
            <WizardNavigator
                nextProps={nextProps}
                backProps={backProps}
                nextDetails={nextDetails}
                backDetails={backDetails}
            />
        </Flex>
    );
};

export default StepSelectWalletAddress;