import React, { useState } from "react";
import {
  Box,
  Center,
  Button,
  VStack,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import successBoxStyle from "../../styleClasses/successBoxStyle";
import darkBoxWithBorderStyle from "../../styleClasses/darkBoxWithBorderStyle";
import { COLORS } from "../../styleClasses/constants";
import SavedFileBox from "../SavedFileBox";
import EtherFiSpinner from "../EtherFiSpinner";
import SelectSavePathButton from "../SelectSavePathButton";
import ChainSelectionDropdown from "../ChainSelectionDropdown";
import AddressInput from "../AddressInput";
import useGetStakerAddresses from "../../hooks/useGetStakerAddress";
import useGetValidators from "../../hooks/useGetValidators";
import useEpoch from "../../hooks/useEpoch";
import ImportValidatorTabs from "./ImportValidatorTabs";


const GenerateSignedExitMessageWidget = () => {

  const [validatorKeyFilePath, setValidatorKeyFilePath] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("");
  const [exitMessageFilePath, setExitMessageFilePath] = useState<string>("");
  const [chain, setChain] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedValidator, setSelectedValidator] = useState("");
  const [isAddressValid, setIsAddressValid] = React.useState(false);

  // UI State Variables
  const [messageGenerating, setMessageGenerating] = useState<boolean>(false);
  const [messageGenerated, setMessageGenerated] = useState<boolean>(false);

  const { watch, register, control, getValues, resetField } = useFormContext();
  const { loginPassword, exitEpoch, validatorIndex, validatorKeysPassword } = watch();

  const { addressOptions } = useGetStakerAddresses();
  const { data: epoch } = useEpoch(chain);
  // TODO: MAKE ERROR MESSAGES BETTER!! I.E See if password is wrong for keystore
  // Right now we just show that a general error occured if the message generation fails
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  const getFinalAddress = () => {
    const finalDrop = getValues("dropdownAddress")
    const finalType = getValues("exitAddress")
    if (finalDrop == "" || finalDrop == undefined) {
      return finalType
    } else if (finalType == "" || finalType == undefined) {
      return finalDrop
    }
  }

  const {fetchedValidators, loading} = useGetValidators(getFinalAddress(), loginPassword)

  const clearState = () => {
    setValidatorKeyFilePath("");
    setSavePath("");
    setExitMessageFilePath("");
    setMessageGenerating(false);
    setMessageGenerated(false);
    setShowErrorMessage(false);
    setSelectedValidator("");
    setChain("")
    resetField("dropdownAddress");
    resetField("exitAddress");
    resetField("exitEpoch");
    resetField("validatorKeysPassword");
  };

  const requestSignedExitMessage = () => {

    window.exitMessageApi.receiveSignedExitMessageConfirmation(
      (
        event: Electron.IpcMainEvent,
        result: number,
        path: string,
        errorMessage: string
      ) => {
        console.log(`signedExitMessageGeneration Result: ${result}`);
        if (result === 0) {
          console.log(
            "Signed Exit Message Gen Complete. Files saved too: " + path
          );
          setExitMessageFilePath(path);
          setMessageGenerated(true);
          setShowErrorMessage(false);
        } else {
          console.error("Error Generating Exit Message");
          console.error(errorMessage);
          setShowErrorMessage(true);
        }
        setMessageGenerating(false);
      }
    );
    setMessageGenerating(true);

    window.exitMessageApi.reqGenSignedExitMessage(
        selectedTab ? true : false,
        selectedValidator,
        validatorKeyFilePath,
        validatorKeysPassword,
        validatorIndex,
        exitEpoch,
        savePath,
        chain,
        loginPassword,
        getFinalAddress()
    );
  };

  return (
    <>
      <Center>
        <Box sx={raisedWidgetStyle} bg="#2b2852">
          {/* Widget Data Input Screen */}
          {!messageGenerating && !messageGenerated && (
            <Box sx={raisedWidgetStyle} bg="#2b2852">
              <VStack spacing={2} align="stretch">
                {showErrorMessage && (
                  <Text fontSize="12px" ml="5px" color="red.warning">
                    Generating Exit Message Failed. Make sure the information you
                    have entered into the fields below is correct.
                  </Text>
                )}
                <Box>
                  <Text fontSize="18px" as="b" color="white">
                    Generate Signed Voluntary Exit Message
                  </Text>
                </Box>
                <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                  <VStack spacing={4} align="stretch">
                    {addressOptions?.length && (
                      <>
                        <Controller
                          control={control}
                          name="dropdownAddress"
                          render={({
                              field: { onChange },
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
                      </>
                    )}
                    <AddressInput
                      isAddressValid={isAddressValid}
                      setIsAddressValid={setIsAddressValid}
                      shouldDoValidation
                      registerText="exitAddress"
                    />
                      <ImportValidatorTabs
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        setValidatorKeyFilePath={setValidatorKeyFilePath}
                        validatorKeyFilePath={validatorKeyFilePath}
                      >
                        <Box width="100%">
                          <Select
                            color="white"
                            borderColor="purple.light"
                            placeholder={loading ? "Fetching Validator IDs" : "Validator ID"}
                            value={selectedValidator}
                            disabled={loading}
                            onChange={(e) => {
                              setSelectedValidator((e.target.value))
                            }}
                          >
                            {fetchedValidators && Object.entries(fetchedValidators).map(([key, value]: [any, any], i) => (
                              <option value={JSON.stringify(value)} key={key}>{value.beaconID}</option>
                            ))}
                          </Select>
                        </Box>
                      </ImportValidatorTabs>
                    <Box>
                      <Text fontSize="14px" as="b" color="white">
                        Chain
                      </Text>
                      <ChainSelectionDropdown chain={chain} setChain={setChain} />
                    </Box>
                    <Box>
                      <HStack>
                        <Text fontSize="14px" as="b" color="white">
                          {" "}
                          Exit Epoch
                        </Text>
                        <Text fontSize="14px" color={COLORS.textSecondary}>
                          The epoch you want the Validator to exit in
                        </Text>
                      </HStack>
                      <InputGroup>
                        <NumberInput
                          width="100%"
                          borderColor={COLORS.lightPurple}
                          color="white"
                        >
                          <NumberInputField
                            {...register('exitEpoch', {valueAsNumber: true})}
                            placeholder="Enter Epoch"
                          />
                        </NumberInput>
                      </InputGroup>
                      { epoch && (
                        <HStack my="5px">
                          <Text fontSize="14px" as="b" color="white">
                            {" "}
                          Current Epoch
                          </Text>
                          <Text fontSize="14px" color={COLORS.textSecondary}>
                            {epoch}
                          </Text>
                        </HStack>
                      )}
                    </Box>

                    <Box>
                      {savePath && (
                        <VStack mt="10px" spacing={1} align="stretch">
                          <Text fontSize="14px" as="b" color="white">
                            Selected Folder:
                          </Text>
                          <Text
                            fontSize="11px"
                            color={COLORS.textSecondary}
                            maxW="400px"
                            ml={2}
                          >
                            {savePath}
                          </Text>
                        </VStack>
                      )}
                    </Box>
                  </VStack>
                </Box>
                <Box>
                  <Center>
                    <HStack spacing="10px" mb="5px">
                      <SelectSavePathButton
                        savePath={savePath}
                        setSavePath={setSavePath}
                      ></SelectSavePathButton>
                      <Button
                        variant="white-button"
                        isDisabled={
                          (selectedTab && !selectedValidator) ||
                          (!selectedTab && (!validatorKeyFilePath || !validatorIndex)) ||
                          !exitEpoch ||
                          !savePath ||
                          !chain
                        }
                        type="submit"
                        onClick={requestSignedExitMessage}
                      >
                        Generate Exit Message
                      </Button>
                    </HStack>
                  </Center>
                </Box>
              </VStack>
            </Box>
          )}

          {/* Spinner When Exit Message is Loading */}
          <EtherFiSpinner
            text="Generating Voluntary Exit Message"
            loading={messageGenerating}
          />

          {/* Widget Success Screen */}
          {messageGenerated && !messageGenerating && (
            <Box sx={successBoxStyle} bg="#2b2852">
              <VStack spacing={3} align="stretch">
                <Box p="10px">
                  <HStack spacing="10px">
                    <Text fontSize="18px" as="b" color="white">
                      Saved
                    </Text>
                    <Text fontSize="14px" color={COLORS.textSecondary}>
                      The signedExitMessage.json has been saved to the folder specified
                    </Text>
                  </HStack>
                </Box>

                <Box sx={darkBoxWithBorderStyle} bg="#2b2852">
                  <HStack spacing="5px" mb="5px">
                    <Text fontSize="14px" as="b" color="white">
                      Folder:{" "}
                    </Text>
                    <Text fontSize="11px" color={COLORS.textSecondary}>
                      {savePath}
                    </Text>
                  </HStack>
                  <SavedFileBox filePath={exitMessageFilePath} />
                </Box>
                <Box>
                  <Center>
                    <Button variant="white-button" onClick={clearState}>
                      Finish
                    </Button>
                  </Center>
                </Box>
              </VStack>
            </Box>
          )}
        </Box>
      </Center>
    </>
  );
};

export default GenerateSignedExitMessageWidget;
