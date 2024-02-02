import React, { useEffect } from "react"
import { useFormContext, Controller } from "react-hook-form"
import {
    Flex,
    Text,
    Center,
    Select,
    RadioGroup,
    Radio,
    Stack,
} from "@chakra-ui/react"
import WizardNavigator from "../../WizardNavigator"
import AddressInput from "../../../../AddressInput"

import useGetStakerAddresses from "../../../../../hooks/useGetStakerAddress"

interface StepSelectWalletAddressProps {
    goNextStep: () => void
    goBackStep: () => void
    dropWalletAddress: string
    typeWalletAddress: string
    setConfirmedAddress: (address: string) => void
    confirmedAddress: string
    setStakingMode: (mode: "solo" | "bnft") => void
    stakingMode: "solo" | "bnft"
}

const StepSelectWalletAddress: React.FC<StepSelectWalletAddressProps> = (
    props
) => {
    const { addressOptions } = useGetStakerAddresses()
    const [isAddressValid, setIsAddressValid] = React.useState(false)

    const { control, resetField } = useFormContext()

    // If someone goes back, we should clear the fields
    useEffect(() => {
        resetField("dropdownAddress")
        resetField("address")
        props.setConfirmedAddress("")
    }, [])

    const backDetails = {
        text: "back",
        visible: false,
    }

    const backProps = {
        onClick: props.goBackStep,
        variant: "white-button",
    }

    const nextDetails = {
        text: "Proceed",
        visible: true,
    }

    const nextProps = {
        isDisabled:
            !(isAddressValid || props.dropWalletAddress) ||
            !props.confirmedAddress,
        onClick: props.goNextStep,
        variant: "white-button",
    }

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
                {addressOptions?.length ? "Select" : "Enter"} Wallet Address
            </Text>
            <Text color="white" opacity={"0.7"}>
                {addressOptions?.length
                    ? "Pick the wallet address where you want to save your keys."
                    : "Enter the Wallet Address you want associated with your stakes. You can find this address in your connected software or hardware wallet."}
            </Text>
            {addressOptions?.length && (
                <>
                    <Controller
                        control={control}
                        name="dropdownAddress"
                        render={({
                            field: { onChange },
                            fieldState: { error },
                        }) => (
                            <Select
                                color="white"
                                borderColor="purple.light"
                                placeholder="Select Wallet Address"
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                disabled={!addressOptions?.length}
                            >
                                {!error &&
                                    addressOptions?.map((address: string) => (
                                        <option key={address}>{address}</option>
                                    ))}
                            </Select>
                        )}
                    />
                    <Center>
                        <Text
                            color={"white"}
                            fontSize="2xl"
                            fontWeight={"semibold"}
                        >
                            or
                        </Text>
                    </Center>
                </>
            )}
            <AddressInput
                isAddressValid={isAddressValid}
                setIsAddressValid={setIsAddressValid}
                shouldDoValidation={true}
                registerText="address"
            />
            <Text color={"white"} fontSize="2xl" fontWeight={"semibold"}>
                Select Staking Mode
            </Text>
            <RadioGroup
                color="white"
                onChange={props.setStakingMode}
                value={props.stakingMode}
            >
                <Stack direction={"row"} spacing={2}>
                    <Radio value="solo" colorScheme="purple">
                        Solo Staking
                    </Radio>
                    <Radio value="bnft" colorScheme="purple">
                        BNFT
                    </Radio>
                </Stack>
            </RadioGroup>
            <WizardNavigator
                nextProps={nextProps}
                backProps={backProps}
                nextDetails={nextDetails}
                backDetails={backDetails}
            />
        </Flex>
    )
}

export default StepSelectWalletAddress
