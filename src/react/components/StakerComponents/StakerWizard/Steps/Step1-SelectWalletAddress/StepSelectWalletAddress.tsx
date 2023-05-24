import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Flex, Text, Center, Select } from "@chakra-ui/react";
import WizardNavigator from "../../WizardNavigator";
import AddressInput from "../../../../AddressInput";

import useGetStakerAddresses from "../../../../../hooks/useGetStakerAddress";

interface StepSelectWalletAddressProps {
    goNextStep: () => void;
    goBackStep: () => void;
    dropWalletAddress: string;
    typeWalletAddress: string
}

const StepSelectWalletAddress: React.FC<StepSelectWalletAddressProps> = (
    props
) => {
    const {addressOptions, error} = useGetStakerAddresses();
    const [isAddressValid, setIsAddressValid] = React.useState(false);

    const { watch, setValue, control } = useFormContext()

    const typedAddress = watch('address')

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
            <Controller
                control={control}
                name="dropdownAddress"
                render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { error }
                  }) => (
                  <Select
                    color="white"
                    borderColor="purple.light"
                    placeholder="Select Wallet Address"
                    onChange={(e) => {
                        onChange(e)
                    }}
                >
                    {!error && addressOptions?.map((address: string) => (
                        <option key={address}>{address}</option>
                    ))}
                </Select>
                )}
            />
            <Center>
                <Text color={"white"} fontSize="2xl" fontWeight={"semibold"}>
                    or
                </Text>
            </Center>
            <AddressInput
                isAddressValid={isAddressValid}
                setIsAddressValid={setIsAddressValid}
                shouldDoValidation={true}
                registerText="address"
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
