import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Center,
  Input,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
} from "@chakra-ui/react";
import WizardNavigator from "../../WizardNavigator";
import { IconAlertTriangle } from "../../../../Icons";
import EtherFiSpinner from "../../../../EtherFiSpinner";

interface StepGetStakeInfoProps {
  goNextStep: () => void;
  goBackStep: () => void;
  setStakeInfo: (stakeInfo: { [key: string]: string }[]) => void;
}

const StepGetStakeInfo: React.FC<StepGetStakeInfoProps> = (
  props
) => {
  const [staleKeysFound, setStaleKeysFound] = useState<boolean>(false);
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
    setIsLoading(true);
    fetch(`http://localhost:3000/api/stakeInfo/${stakingCode}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Your code is invalid. Check the code in the web app and try again.");
        }
        return res
      })
      .then(res => res.json())
      .then(async (stakeInfo: { [key: string]: string }[]) => {
        // const isValid = await validateStakeInfo(stakeInfo);
        // console.log({ isValid})
        // if (!isValid) {
          // console.log("Invalid stake info");
          // setStaleKeysFound(true);
          // return;
        // }
        props.setStakeInfo(stakeInfo);
        props.goNextStep();
      })
      .catch(err => {
        toast({
          title: "Error fetching stake info",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
        setStakingCode("");
      });
    setStakingCode("");
  }

  const validateStakeInfo = async (stakeInfo: { [key: string]: string }[]): Promise<boolean> => {
    // Check to see if there are any stale keys in the StakeInfo.json file the user selected.
    // (i.e have the keys been used to encrypt Validator Keys by this dekstop app before )
    console.log({ stakeInfo, length: stakeInfo.length })
    return new Promise<boolean>((resolve, reject) => {
      if (!!stakeInfo && stakeInfo.length > 0) {
        window.databaseApi.receiveStaleBidderPublicKeysReport(
          (event: Electron.IpcMainEvent, staleKeys: Array<String>) => {
            if (staleKeys.length > 0) {
              // In the future we may want to show which stale keys were used in the UI instead of just the console
              console.log("Stale keys were found: " + staleKeys);
              // setStaleKeysFound(true);
              resolve(false)
            } else {
              // setStaleKeysFound(false);
              console.log("No stale Keys found!");
              resolve(true)
            }
          }
        );
        // is this still stubbed out?
        // window.databaseApi.reqCheckForStaleBidderPublicKeys(stakeInfo);
      } else {
        // Set stale keys found to false since there is no file selected
        // setStaleKeysFound(false);
        reject('No stake info found')
      }
    })
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
      {staleKeysFound && (
        <Center mt="-10px">
          <IconAlertTriangle stroke="#FFC700" boxSize="7" />
          <Text ml="10px" variant="alert-text">
            This StakeInfo.json file contains bidderPublicKeys that have already
            been used to encrypt Validator Keys. Please make sure this is the
            correct file.
          </Text>
        </Center>
      )}
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
