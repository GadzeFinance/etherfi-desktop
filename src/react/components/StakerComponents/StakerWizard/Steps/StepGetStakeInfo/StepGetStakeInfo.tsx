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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    props.setStakeInfo([
      {
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
      }
    ]);
    props.setCode(stakingCode);
    props.goNextStep();
    setStakingCode("");
    // setIsLoading(true);
    // fetch(`${dappUrl}/api/stakeInfo/${stakingCode}`)
    //   .then(res => {
    //     if (!res.ok) {
    //       throw new Error("Your code is invalid. Check the code in the web app and try again.");
    //     }
    //     return res
    //   })
    //   .then(res => res.json())
    //   .then(async (stakeInfo: { [key: string]: string }[]) => {
    //     props.setStakeInfo(stakeInfo);
    //     props.setCode(stakingCode);
    //     props.goNextStep();
    //   })
    //   .catch(err => {
    //     toast({
    //       title: "Error fetching stake info",
    //       description: 'Unable to fetch stake info. Your country may be blocked.',
    //       status: "error",
    //       duration: 5000,
    //       isClosable: true,
    //     });
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //     setStakingCode("");
    //   });
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
