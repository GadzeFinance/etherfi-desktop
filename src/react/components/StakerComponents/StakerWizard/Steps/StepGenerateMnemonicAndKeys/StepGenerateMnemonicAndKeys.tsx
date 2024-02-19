import React, { useState, useEffect } from "react"
import { Flex, Text, Center, Spinner, Progress } from "@chakra-ui/react"
import WizardNavigator from "../../WizardNavigator"
import { IconKey } from "../../../../Icons"
import { useFormContext } from "react-hook-form"
import { InfoPanels } from "../../../../InfoPanels"
import { dappUrl } from "../../../../../../electron/utils/getDappUrl"

interface StepCreateKeysProps {
    goNextStep: () => void
    goBackStep: () => void
    mnemonic: string
    setMnemonic: (mnemonic: string) => void
    stakeInfo: { [key: string]: string }[]
    address: string
    importMnemonicPassword: string
    mnemonicOption: string
    code: string
    setStakingMode: (mode: "solo" | "bnft") => void
    stakingMode: "solo" | "bnft"
}

const StepGenerateMnemonicAndKeys: React.FC<StepCreateKeysProps> = (props) => {
    const [generating, setGenerating] = useState(true)
    const [generated, setGenerated] = useState(false)
    const [keysGenerated, setKeysGenerated] = useState(0)
    const [keysTotal, setKeysTotal] = useState(0)
    const { watch, getValues, resetField } = useFormContext()
    const loginPassword = watch("loginPassword")

    const generateEncryptedKeys = (mnemonic: string) => {
        window.encryptionApi.receiveGenerateKey(
            (
                event: Electron.IpcMainEvent,
                index: number,
                total: number,
                usedTime: number
            ) => {
                setKeysGenerated(index + 1)
                setKeysTotal(total)
            }
        )
        window.encryptionApi.receiveKeyGenConfirmation(
            (
                event: Electron.IpcMainEvent,
                result: number,
                savePath: string,
                errorMessage: string
            ) => {
                if (result === 0) {
                    props.goNextStep()
                    resetField("confirmedAddress")
                    resetField("dropdownAddress")
                    resetField("address")
                    setGenerated(true)
                } else {
                    console.error("Error generating validator keys")
                    console.error(errorMessage)
                    // TODO: Show error screen on failure.
                }
                setGenerating(false)
            }
        )
        window.encryptionApi.stakeRequest(
            (
                event: Electron.IpcMainEvent,
                stakeRequest: any,
                errorMessage: string
            ) => {
                if (stakeRequest) {
                    console.log("generating flow")
                    console.log({
                        stakeRequest,
                        code: props.code
                    })
                    fetch(`${dappUrl}/api/stakeRequest/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            stakeRequest,
                            code: props.code,
                        }),
                    })
                } else {
                    console.error("Error getting stake request")
                    console.error(errorMessage)
                }
            }
        )

        window.encryptionApi.reqGenValidatorKeysAndEncrypt(
            mnemonic,
            loginPassword,
            props.stakeInfo,
            getValues("confirmedAddress"),
            props.mnemonicOption,
            props.importMnemonicPassword,
            props.code,
            props.stakingMode
        )
    }

    const generateMnemonic = () => {
        window.encryptionApi.receiveNewMnemonic(
            (
                event: Electron.IpcMainEvent,
                result: number,
                newMnemonic: string,
                errorMessage: string
            ) => {
                if (result === 0) {
                    props.setMnemonic(newMnemonic)
                    generateEncryptedKeys(newMnemonic)
                } else {
                    console.error("Error generating mnemonic")
                    console.error(errorMessage)
                    // TODO: Show error screen on failure.
                }
            }
        )
        window.encryptionApi.reqNewMnemonic("english")
        setGenerating(true)
    }

    useEffect(() => {
        if (!generated) generateMnemonic()
    }, [])

    const backDetails = {
        text: "Back",
        visible: true,
    }

    const backProps = {
        onClick: props.goBackStep,
        variant: "back-button",
    }

    const nextDetails = {
        text: "Creating Keys",
        visible: true,
    }

    const nextProps = {
        onClick: generateEncryptedKeys,
        variant: "white-button",
    }

    return (
        <Flex
            padding={"24px"}
            direction={"column"}
            gap="5px"
            height={"full"}
            width={"full"}
            bgColor="purple.dark"
            borderRadius="lg"
        >
            {!generating && (
                <>
                    <Center>
                        <IconKey boxSize="12" />
                    </Center>
                    <Text
                        color={"white"}
                        fontSize="xl"
                        fontWeight={"semibold"}
                        align="center"
                    >
                        Creating Keys
                    </Text>
                    <WizardNavigator
                        nextProps={nextProps}
                        backProps={backProps}
                        nextDetails={nextDetails}
                        backDetails={backDetails}
                    />
                </>
            )}
            {generating && (
                <>
                    <Text textAlign="center" fontSize="xs" color="white">
                        Generating Mnemonic and Keys
                    </Text>
                    <Progress
                        mb={1}
                        colorScheme="purple"
                        size="xs"
                        isIndeterminate
                    />
                    <InfoPanels />
                </>
            )}
        </Flex>
    )
}

export default StepGenerateMnemonicAndKeys
