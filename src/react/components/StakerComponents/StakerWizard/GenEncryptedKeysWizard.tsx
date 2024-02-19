import React, { useState, useMemo, useEffect } from "react"
import { Box, Center, Flex } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import { useFormContext } from "react-hook-form"
// STEP 1:
import StepSelectWalletAddress from "./Steps/SelectWalletAddress/StepSelectWalletAddress"
// STEP 2:
import StepGetStakeInfo from "./Steps/StepGetStakeInfo/StepGetStakeInfo"
// STEP 3:
import StepGenerateMnemonic from "./Steps/StepGenerateMnemonic/StepGenerateMnemonic"
//STEP 4:
import StepCreateKeys from "./Steps/StepCreateKeys/StepCreateKeys"
//STEP 5:
import StepFinish from "./Steps/StepFinish/StepFinish"
import StepGenerateMnemonicAndKeys from "./Steps/StepGenerateMnemonicAndKeys/StepGenerateMnemonicAndKeys"
import StepImportKeyStoreFiles from "./Steps/StepImportKeyStoreFiles/StepImportKeyStoreFiles"
import PreviewList from "./Steps/PreviewList/PreviewList"

const content = <Flex py={4}></Flex>

const newKeySteps = [
    { label: "Choose Wallet Address", content },
    { label: "Enter Staking Code", content },
    { label: "Generate Mnemonic and Keys", content },
    { label: "Finish", content },
]

const importKeySteps = [
    { label: "Choose Wallet Address", content },
    { label: "Import Keystore Files", content },
    { label: "Preview", content },
    { label: "Finish", content },
]

interface WizardProps {
    navigateTo: (tabIndex: number) => void
    password: string
}

export interface FileMap {
    [key: string]: string
}

export interface StakeInfo {
    [key: string]: any
}

const getMenomicWordsToConfirmIndicies = () => {
    const indexList = Array<number>()

    while (indexList.length < 4) {
        const index = Math.floor(Math.random() * 24)
        if (!indexList.includes(index)) {
            indexList.push(index)
        }
    }
    return indexList.sort((a, b) => a - b)
}

const GenEncryptedKeysWizard: React.FC<WizardProps> = (props) => {
    const { nextStep, prevStep, activeStep, setStep } = useSteps({
        initialStep: 0,
    })
    const { nextStep: nextStepImport, prevStep: prevStepImport, activeStep: activeStepImport, setStep: setStepImport } = useSteps({
        initialStep: 0,
    })
    const [stakeInfo, setStakeInfo] = React.useState<StakeInfo[]>([{
        "bidderPublicKey": "049d526be3f1ad95a964a80f08eb975cbc8f3cec871142470bf0f1ab083af5d832030c2fac0c75add2a58d72470f3d0548a99cfb3ec8d51895fc0b2e5a4e48edad",
        "etherfiDesktopAppVersion": "1.1.1",
        "networkName": "mainnet",
        "validatorID": 12669,
        "withdrawalSafeAddress": "0x392B611423edBbe3BC76fca433c623c487fC7462"
      },
      {
        "bidderPublicKey": "04a8fc872c630dc37a0d6e9e315c2ccd22138aa01640f50de830384f610dda91924adb230d31244fb8beab9cee2d07435d1b44bd7a2f8ade19a6bc23f3e034f7aa",
        "etherfiDesktopAppVersion": "1.1.1",
        "networkName": "mainnet",
        "validatorID": 12670,
        "withdrawalSafeAddress": "0x5B2e386E99dB63EC80185450a25a0ed6b4056016"
      }])
    const [mnemonic, setMnemonic] = useState<string>("")
    const [code, setCode] = useState<string>("")
    const [stakingMode, setStakingMode] = useState<"solo" | "bnft">("bnft")
    const [operationType, setOperationType] = useState<"new" | "import">("import")
    const [files, setFiles] = useState<FileMap>({})
    const [password, setPassword] = useState<string>("")

    const [importMnemonicPassword, setImportMnemonicPassword] =
        useState<string>("")
    const [mnemonicOption, setMnemonicOption] = useState("generate")

    const [confirmedAddress, setConfirmedAddress] = useState<string>("")
    const { watch, setValue } = useFormContext()

    const typeWalletAddress = watch("address")
    const dropWalletAddress = watch("dropdownAddress")

    const resetAllStates = () => {
        setStakeInfo([])
        setMnemonic("")
        setCode("")
        setImportMnemonicPassword("")
        setMnemonicOption("generate")
        setConfirmedAddress("")
        setValue("address", "")
        setValue("dropdownAddress", "")

        setStep(0)
    }

    useEffect(() => {
        if (!typeWalletAddress) {
            setValue("confirmedAddress", dropWalletAddress)
            setConfirmedAddress(() => dropWalletAddress)
        } else if (!dropWalletAddress) {
            setValue("confirmedAddress", typeWalletAddress)
            setConfirmedAddress(() => typeWalletAddress)
        }
    }, [typeWalletAddress, dropWalletAddress])

    const wordsToConfirmIndicies = useMemo(
        () => getMenomicWordsToConfirmIndicies(),
        [mnemonic]
    )

    // const makePreviewList = (files: FileMap, stakeInfo: StakeInfo[]) => {
    //     return Object.keys(files).map((key, i) => {
    //         return {
    //             validatorKey: JSON.parse(files[key]),
    //             keyFileName: key,
    //             stakeInfo: stakeInfo[i]
    //         }
    //     })
    // }

    return (
        <Center>
            <Flex
                width={"905px"}
                height={"500px"}
                sx={{
                    border: "1px solid",
                    borderColor: "purple.light",
                    padding: "24px",
                    borderRadius: "16px",
                }}
            >
                { operationType === "new" && <Flex flexDir="column" width="600px" height="450px">
                    <Steps
                        colorScheme="black-alpha"
                        orientation="vertical"
                        activeStep={activeStep}
                        sx={{
                            "& .cui-steps__vertical-step": {
                                flex: 1,
                            },
                        }}
                    >
                        {newKeySteps.map(({ label, content }) => (
                            <Step label={label} key={label} color="white">
                                {content}
                            </Step>
                        ))}
                    </Steps>
                </Flex> }
                { operationType === "import" && <Flex flexDir="column" width="600px" height="450px">
                    <Steps
                        colorScheme="black-alpha"
                        orientation="vertical"
                        activeStep={activeStep}
                        sx={{
                            "& .cui-steps__vertical-step": {
                                flex: 1,
                            },
                        }}
                    >
                        {importKeySteps.map(({ label, content }) => (
                            <Step label={label} key={label} color="white">
                                {content}
                            </Step>
                        ))}
                    </Steps>
                </Flex> }                
                <Flex flexDir="column" width="100%">
                    {activeStep === 0 && (
                        <StepSelectWalletAddress
                            goBackStep={prevStep}
                            goNextStep={nextStep}
                            dropWalletAddress={dropWalletAddress}
                            typeWalletAddress={typeWalletAddress}
                            confirmedAddress={confirmedAddress}
                            setConfirmedAddress={setConfirmedAddress}
                            setStakingMode={setStakingMode}
                            stakingMode={stakingMode}
                            operationType={operationType}
                            setOperationType={setOperationType}
                        />
                    )}
                    {
                        operationType === "new" &&
                        <>
                        {activeStep === 1 && (
                            <StepGetStakeInfo
                                goBackStep={prevStep}
                                goNextStep={nextStep}
                                setStakeInfo={setStakeInfo}
                                setCode={setCode}
                            />
                        )}
                        {activeStep === 2 && (
                            <StepGenerateMnemonicAndKeys
                                goBackStep={prevStep}
                                goNextStep={nextStep}
                                stakeInfo={stakeInfo}
                                mnemonic={mnemonic}
                                setMnemonic={setMnemonic}
                                address={confirmedAddress}
                                importMnemonicPassword={importMnemonicPassword}
                                mnemonicOption={mnemonicOption}
                                code={code}
                                setStakingMode={setStakingMode}
                                stakingMode={stakingMode}
                            />
                        )}
                        {activeStep === 3 && (
                            <StepFinish
                                goBackStep={prevStep}
                                resetAllStates={resetAllStates}
                            />
                        )}
                        </>
                    }
                    {
                        operationType === "import" &&
                        <>
                        {activeStep === 1 && (
                            <StepImportKeyStoreFiles
                                goBackStep={prevStep}
                                goNextStep={nextStep}
                                stakeInfoList={stakeInfo}
                                files={files}
                                setFiles={setFiles}
                                password={password}
                                setPassword={setPassword}
                            />
                        )}
                        
                        {activeStep === 3 && (
                            <StepFinish
                                goBackStep={prevStep}
                                resetAllStates={resetAllStates}
                            />
                        )}
                        </>
                    }
                </Flex>
            </Flex>
        </Center>
    )
}

export default GenEncryptedKeysWizard
