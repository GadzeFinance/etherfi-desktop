import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Center,
  Select,
  Input,
  InputGroup
} from "@chakra-ui/react";

import DisplayMnemonic from "./DisplayMnemonic";
import ConfirmMnemonic from "./ConfimMnemonic";
import WizardNavigator from "../../WizardNavigator";
import EtherFiSpinner from "../../../../EtherFiSpinner";
import { IconLockFile } from "../../../../Icons";
import StoredMnemonicSelect from "./StoredMnemonicSelect";

interface StepGenerateMnemonicProps {
  goNextStep: () => void;
  goBackStep: () => void;
  mnemonic: string;
  setMnemonic: (mnemonic: string) => void;
  wordsToConfirmIndicies: Array<number>;
  walletAddress: string;
  setImportMnemonicPassword: (password: string) => void;
  importMnemonicPassword: string;
  setMnemonicOption: (mnemonic: string) => void;
  mnemonicOption: string;
}

const StepGenerateMnemonic: React.FC<StepGenerateMnemonicProps> = (props) => {
  const [generating, setGenerating] = useState(false);
  // This is a hacky way to determine if we should show ConfirmMnemonic or DisplayMnemonic compoennts when this renders.
  const [confirmMnemonic, setConfirmMnemonic] = useState(props.mnemonic !== "");
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false);
  const [storedMnemonics, setStoredMnemonic] = useState(undefined);
  const [importMnemonic, setImportMnemonic] = useState("")
  const [nextText, setNextText] = useState("")

  const generateMnemonic = () => {
    window.encryptionApi.receiveNewMnemonic(
      (
        event: Electron.IpcMainEvent,
        result: number,
        newMnemonic: string,
        errorMessage: string
      ) => {
        if (result === 0) {
          props.setMnemonic(newMnemonic);
        } else {
          console.error("Error generating mnemonic");
          console.error(errorMessage);
          // TODO: Show error screen on failure.
        }
        setGenerating(false);
      }
    );
    window.encryptionApi.reqNewMnemonic("english");
    setGenerating(true);
  };

  const nextAction = () => {
    // No Mneomoic Generated
    if (!props.mnemonic) {
      if (props.mnemonicOption == "import") {
        props.setMnemonic(importMnemonic)
        props.goNextStep()
      } else if (props.mnemonicOption == "generate") {
        return generateMnemonic
      }
    };
    // Mneomoic Generated and viewing the whole mnemonic screen
    if (props.mnemonic && !confirmMnemonic)
      return () => setConfirmMnemonic(true);
    // Mneomoic Generated and viewing the Confirm Mnemonic screen
    if (props.mnemonic && confirmMnemonic)
      return () => {
        setConfirmMnemonic(false);
        props.goNextStep();
      };
  };

  const backAction = () => {
    // No Mneomoic Generated
    if (!props.mnemonic) return props.goBackStep;
    // Viewing whole mnemonic screen
    if (props.mnemonic && !confirmMnemonic) return resetState;
    // Viewing Confirm Mnemonic Screen
    if (props.mnemonic && confirmMnemonic)
      return () => setConfirmMnemonic(false);
  };

  const resetState = () => {
    props.setMnemonic("");
    setGenerating(false);
  };

  const backDetails = {
    text: "Back",
    visible: true,
  };

  const backProps = {
    onClick: backAction(),
    variant: "back-button",
  };

  useEffect(() => {
    if (props.mnemonic) setNextText("Continue")
    if (props.mnemonicOption == "import") setNextText("Import")
    if (props.mnemonicOption == "generate") setNextText("Generate")
  }, [props.mnemonicOption, props.mnemonic])

  const nextDetails = {
    text: nextText,
    visible: props.mnemonicOption != "stored",
  };

  const nextProps = {
    isDisabled: confirmMnemonic ? !mnemonicConfirmed : false,
    onClick: () => nextAction(),
    variant: "white-button",
  };


  return (
    <Flex
      padding={"24px"}
      direction={"column"}
      gap="12px"
      bgColor="purple.dark"
      height="full"
      width={"full"}
      borderRadius="lg"
    >
      {!props.mnemonic && !generating && (
        <>
          <Center>
            <IconLockFile boxSize="100" />
          </Center>
          <Text
            color={"white"}
            fontSize="2xl"
            fontWeight="semibold"
            align="center"
          >
            Generate Mnemonic
          </Text>

          <Text color="white" opacity={"0.7"} align="center">
            To generate and encrypt your validator keys. First you need to
            generate a mnemonic.
          </Text>
        </>
      )}
      {props.mnemonic && !confirmMnemonic && (
        <DisplayMnemonic mnemonic={props.mnemonic} />
      )}
      {props.mnemonic && confirmMnemonic && (
        <ConfirmMnemonic
          mnemonic={props.mnemonic}
          wordsToConfirmIndicies={props.wordsToConfirmIndicies}
          setMnemonicConfirmed={setMnemonicConfirmed}
        />
      )}
      {!props.mnemonic && !generating && (
        <>
          <Select color="white" borderColor="purple.light" onChange={(e) => props.setMnemonicOption(e.target.value)}>
            <option value="generate">Generate mnemonic</option>
            <option value="stored">Use stored mnemonic</option>
            <option value="import">Import mnemonic</option>
          </Select>
        </>
      )}
      {!props.mnemonic && !generating && props.mnemonicOption == "stored" && (
        <>
          <StoredMnemonicSelect
            setStoredMnemonic={setStoredMnemonic} 
            storedMnemonics={storedMnemonics}
            goNextStep={props.goNextStep}
            setMnemonic={props.setMnemonic}
            walletAddress={props.walletAddress}
          />
        </>
      )}
      {!props.mnemonic && !generating && props.mnemonicOption == "import" && (
        <>
        <InputGroup>
          <Input
            isRequired={true}
            color="white"
            placeholder="Enter Mnemonic"
            type={"password"}
            margin="5px"
            value={importMnemonic}
            onChange={(e) => setImportMnemonic(e.target.value)}
          />
          <Input
            isRequired={true}
            color="white"
            placeholder="Enter Password"
            type={"password"}
            margin="5px"
            onChange={(e) => props.setImportMnemonicPassword(e.target.value)}
            value={props.importMnemonicPassword}
          />
        </InputGroup>
        </>
      )}

      {!generating && (
        <WizardNavigator
          nextProps={nextProps}
          backProps={backProps}
          nextDetails={nextDetails}
          backDetails={backDetails}
        />
      )}
      <EtherFiSpinner loading={generating} text={"Generating Mnemonic..."} />
    </Flex>
  );
};

export default StepGenerateMnemonic;
