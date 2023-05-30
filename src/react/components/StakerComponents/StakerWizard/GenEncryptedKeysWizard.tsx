import React, { useState, useMemo, useEffect } from "react";
import { Center, Flex } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useFormContext } from "react-hook-form";
// STEP 1:
import StepSelectWalletAddress from "./Steps/Step1-SelectWalletAddress/StepSelectWalletAddress";
// STEP 2:
import StepSelectStakeInfoPath from "./Steps/Step2-SelectStakeInfoPath/StepSelectStakeInfoPath";
// STEP 3:
import StepGenerateMnemonic from "./Steps/Step3-GenerateMnemonic/StepGenerateMnemonic";
//STEP 4:
import StepCreateKeys from "./Steps/Step4-CreateKeys/StepCreateKeys";
//STEP 5:
import StepFinish from "./Steps/Step5-StepFinish/StepFinish";

const content = <Flex py={4}></Flex>;

const steps = [
    { label: "Choose Wallet Address", content },
    { label: "Upload StakeInfo.json", content },
    { label: "Generate Mnemonic", content },
    { label: "Create Keys", content },
    { label: "Finish", content },
];

interface WizardProps {
    navigateTo: (tabIndex: number) => void;
    password: string;
}

const getMenomicWordsToConfirmIndicies = () => {
    const indexList = Array<number>();

    while (indexList.length < 4) {
        const index = Math.floor(Math.random() * 24);
        if (!indexList.includes(index)) {
            indexList.push(index);
        }
    }
    return indexList.sort((a, b) => a - b);
};

const GenEncryptedKeysWizard: React.FC<WizardProps> = (props) => {
    const { nextStep, prevStep, activeStep } = useSteps({
        initialStep: 0,
    });
    const [stakeInfoPath, setStakeInfoPath] = React.useState<string>("");
    const [mnemonic, setMnemonic] = useState<string>("");
    const [savePath, setSavePath] = useState<string>("");

    const [importMnemonicPassword, setImportMnemonicPassword] = useState<string>("")
    const [mnemonicOption, setMnemonicOption] = useState("generate");

    const [confirmedAddress, setConfirmedAddress] = useState<string>("");
    const [keysGenerated, setKeysGenerated] = useState<boolean>(false);
    const [filesCreatedPath, setFilesCreatedPath] = useState<string>("");
    const {watch, setValue} = useFormContext()

    const typeWalletAddress = watch("address")
    const dropWalletAddress = watch("dropdownAddress")

    useEffect(() => {
        if (!typeWalletAddress) {
            setValue('confirmedAddress', dropWalletAddress)
            setConfirmedAddress(() => dropWalletAddress)
        } else if (!dropWalletAddress) {
            setValue('confirmedAddress', typeWalletAddress)
            setConfirmedAddress(() => typeWalletAddress)
        }

    }, [typeWalletAddress, dropWalletAddress])


    const wordsToConfirmIndicies = useMemo(
        () => getMenomicWordsToConfirmIndicies(),
        [mnemonic]
    );
    return (
        <Center>
            <Flex
                width={"905px"}
                height={"450px"}
                sx={{
                    border: "1px solid",
                    borderColor: "purple.light",
                    padding: "24px",
                    borderRadius: "16px",
                }}
            >
                <Flex flexDir="column" width="600px" height="350px">
                    <Steps
                        colorScheme="black-alpha"
                        orientation="vertical"
                        activeStep={activeStep}
                    >
                        {steps.map(({ label, content }) => (
                            <Step label={label} key={label} color="white">
                                {content}
                            </Step>
                        ))}
                    </Steps>
                </Flex>
                <Flex flexDir="column" width="100%">
                    {activeStep === 0 && (
                        <StepSelectWalletAddress
                            goBackStep={prevStep}
                            goNextStep={nextStep}
                            dropWalletAddress={dropWalletAddress}
                            typeWalletAddress={typeWalletAddress}
                        />
                    )}
                    {activeStep === 1 && (
                        <StepSelectStakeInfoPath
                            goBackStep={prevStep}
                            goNextStep={nextStep}
                            stakeInfoPath={stakeInfoPath}
                            setStakeInfoPath={setStakeInfoPath}
                        />
                    )}
                    {activeStep === 2 && (
                        <StepGenerateMnemonic
                            goBackStep={prevStep}
                            goNextStep={nextStep}
                            mnemonic={mnemonic}
                            setMnemonic={setMnemonic}
                            wordsToConfirmIndicies={wordsToConfirmIndicies}
                            walletAddress={confirmedAddress}
                            setImportMnemonicPassword={setImportMnemonicPassword}
                            importMnemonicPassword={importMnemonicPassword}
                            mnemonicOption={mnemonicOption}
                            setMnemonicOption={setMnemonicOption}
                        />
                    )}
                    {activeStep === 3 && (
                        <StepCreateKeys
                            goBackStep={prevStep}
                            goNextStep={nextStep}
                            savePath={savePath}
                            setSavePath={setSavePath}
                            keysGenerated={keysGenerated}
                            setKeysGenerated={setKeysGenerated}
                            filesCreatedPath={filesCreatedPath}
                            setFilesCreatedPath={setFilesCreatedPath}
                            stakeInfoPath={stakeInfoPath}
                            mnemonic={mnemonic}
                            address={confirmedAddress}
                            importMnemonicPassword={importMnemonicPassword}
                            mnemonicOption={mnemonicOption}

                        />
                    )}
                    {activeStep === 4 && <StepFinish goBackStep={prevStep} />}
                </Flex>
            </Flex>
        </Center>
    );
};

export default GenEncryptedKeysWizard;
