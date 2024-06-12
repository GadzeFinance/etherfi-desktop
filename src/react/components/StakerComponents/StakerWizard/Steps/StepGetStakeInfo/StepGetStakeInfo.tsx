import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Center,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import WizardNavigator from "../../WizardNavigator";
import { IconAlertTriangle } from "../../../../Icons";
import { dappUrl } from "../../../../../../electron/utils/getDappUrl";
import { StakeInfo } from "../../GenEncryptedKeysWizard";

interface StepGetStakeInfoProps {
  goNextStep: () => void;
  goBackStep: () => void;
  setStakeInfo: (stakeInfo: StakeInfo[]) => void;
  setCode: (code: string) => void;
}

const StepGetStakeInfo: React.FC<StepGetStakeInfoProps> = (
  props
) => {
  const [stakingCode, setStakingCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");
  const toast = useToast();

  const backDetails = {
    text: "Back",
    visible: true,
  };

  const backProps = {
    onClick: props.goBackStep,
    variant: "back-button",
  };

  const nextDetails = {
    text: "",
    visible: false,
  };

  const nextProps = {
    isDisabled: true,
    onClick: props.goNextStep,
    variant: "white-button",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStakingCode(e.target.value.toUpperCase());
  }

const generateStakingInfo = (digits: number): { [key: string]: string; }[] => {
    const conf = [{
        bidderPublicKey: "04ecdaf0bae414e21ec59d5d2a2d78bea20d491d8004d51cb39e30a698b533d8d48801edf723983e44af6fc399d2dcde051c1aa6291a7adf294ba000b33cfe94d6",
        etherfiDesktopAppVersion: "1.1.1",
        networkName: "mainnet",
        validatorID: 26894,
        withdrawalSafeAddress: "0x9EfD757A4B0245b47A4d31fB9B09f14e999A7033"
    }];

    const validators: { [key: string]: string; }[] = [];
    let startingValidatorId = 10000;

    console.log(Math.pow(10, digits));

    for (let i = 0; i < Math.pow(10, digits); i++) {
        const startingPubkey = conf[0].bidderPublicKey.slice(0, 130 - digits);
        const startWs = conf[0].withdrawalSafeAddress.slice(0, 42 - digits);
        const endingPubkey = i.toString(16).padStart(digits, '0');
        const endingWs = i.toString(16).padStart(digits, '0');

        console.log(startingPubkey + endingPubkey);
        console.log(startWs + endingWs);
        console.log("newline");

        validators.push({
            "bidderPublicKey": startingPubkey + endingPubkey,
            "etherfiDesktopAppVersion": conf[0].etherfiDesktopAppVersion,
            "networkName": conf[0].networkName,
            "validatorID": (startingValidatorId + i).toString(),
            "withdrawalSafeAddress": startWs + endingWs
        });
    }

    return validators;
};


  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const isTest = false
    e.preventDefault();
    setIsLoading(true);
    fetch(`${dappUrl}/api/stakeInfo/${stakingCode}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Your code is invalid. Check the code in the web app and try again.");
        }
        return res
      })
      .then(res => res.json())
      .then(async (stakeInfo: { [key: string]: string }[]) => {
        if (isTest) {
          stakeInfo = generateStakingInfo(2);
        }
        props.setStakeInfo(stakeInfo);
        props.setCode(stakingCode);
        props.goNextStep();
      })
      .catch(err => {
        toast({
          title: "Error fetching stake info",
          description: 'Unable to fetch stake info. Your country may be blocked.',
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
        setStakingCode("");
      });
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
      <Text textAlign="center" color={"white"} fontSize="2xl" fontWeight={"semibold"}>
        Enter Staking Code
      </Text>
      <Text textAlign="center" color="whiteAlpha.700" fontSize="sm">
        Enter the 4-letter code that you were given from the EtherFi web application
      </Text>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column" align="center">
          <Input
            size="lg"
            value={stakingCode}
            onChange={handleChange}
            color="white"
            placeholder="Staking Code"
            fontWeight="bold"
            fontSize="xl"
            textAlign="center"
            width="170px"
            isDisabled={isLoading}
          />
          <Button isLoading={isLoading} type="submit" mt={4}>Submit</Button>
        </Flex>
      </form>
      {validationError && (
        <Center mt="-10px">
          <IconAlertTriangle stroke="#FFC700" boxSize="7" />
          <Text ml="10px" variant="alert-text">
            {validationError}
          </Text>
        </Center>
      )}
      <WizardNavigator
        nextProps={nextProps}
        backProps={backProps}
        nextDetails={nextDetails}
        backDetails={backDetails}
      />
    </Flex>
  );
};

export default StepGetStakeInfo;
