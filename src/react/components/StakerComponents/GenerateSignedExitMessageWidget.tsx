import React, { useState, useEffect } from "react";
import isDev from 'react-is-dev';

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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
} from "@chakra-ui/react";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import successBoxStyle from "../../styleClasses/successBoxStyle";
import darkBoxWithBorderStyle from "../../styleClasses/darkBoxWithBorderStyle";
import { COLORS } from "../../styleClasses/constants";
import SavedFileBox from "../SavedFileBox";
import PasswordInput from "../PasswordInput";
import EtherFiSpinner from "../EtherFiSpinner";
import SelectFile from "../SelectFile";
import SelectSavePathButton from "../SelectSavePathButton";
import ChainSelectionDropdown from "../ChainSelectionDropdown";

const GenerateSignedExitMessageWidget: React.FC = () => {

  const [validatorKeyFilePath, setValidatorKeyFilePath] = useState<string>("");
  const [validatorKeyPassword, setValidatorKeyPassword] = useState<string>("");
  const [validatorIndex, setValidatorIndex] = useState<string>("");
  const [exitEpoch, setExitEpoch] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("");
  const [exitMessageFilePath, setExitMessageFilePath] = useState<string>("");
  const [chain, setChain] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedValidator, setSelectedValidator] = useState<string>("");
  const [fetchedValidators, setFetchedValidators] = useState<string[]>([]);
  // UI State Variables
  const [messageGenerating, setMessageGenerating] = useState<boolean>(false);
  const [messageGenerated, setMessageGenerated] = useState<boolean>(false);

  // TODO: MAKE ERROR MESSAGES BETTER!! I.E See if password is wrong for keystore
  // Right now we just show that a general error occured if the message generation fails
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

  useEffect(() => {
    window.encryptionApi.receiveStoredValidators(
      (
        event: Electron.IpcMainEvent,
        result: number,
        validators: string,
        errorMessage: string
      ) => {
        if (result === 0) {
            let parsedValidators = JSON.parse(validators);
            setFetchedValidators(Object.entries(parsedValidators).map(([key, value]: [any ,any], i) => {
                return value
            }));
        } else {
          console.error("Error generating mnemonic");
          console.error(errorMessage);
          // TODO: Show error screen on failure.
        }
      }
    );
    window.encryptionApi.reqStoredValidators();
  }, []);

  const clearState = () => {
    setValidatorKeyFilePath("");
    setValidatorKeyPassword("");
    setValidatorIndex("");
    setExitEpoch("");
    setSavePath("");
    setExitMessageFilePath("");
    setMessageGenerating(false);
    setMessageGenerated(false);
    setShowErrorMessage(false);
  };

  const requestSignedExitMessage = () => {
    console.log(savePath)
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
        validatorKeyPassword,
        validatorIndex,
        exitEpoch,
        savePath,
        chain
    );
  };

  return (
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
                  <Tabs
                    index={selectedTab}
                    onChange={(index) => setSelectedTab(index)}
                  >
                    <TabList>
                      <Tab color={"white"}>Select Validator</Tab>
                      <Tab color={"white"}>Import Validator</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel sx={{ width: "100%" }}>
                        <Box width="100%">
                          <Text mb="5px" fontSize="14px" as="b" color="white">
                            Validator Key
                          </Text>
                          <SelectFile
                            fileName="EncryptedValidatorKeys"
                            reqFileValidaton={
                              window.validateFilesApi.validateKeystoreJson
                            }
                            receiveValidatonResults={
                              window.validateFilesApi
                                .receiveKeystoreValidationResults
                            }
                            setFilePath={setValidatorKeyFilePath}
                            filePath={validatorKeyFilePath}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="14px" as="b" color="white">
                            {" "}
                            Validator Index
                          </Text>
                          <InputGroup>
                            <NumberInput
                              width="100%"
                              borderColor={COLORS.lightPurple}
                              color="white"
                              value={validatorIndex}
                              onChange={(
                                newValStr: React.SetStateAction<string>,
                                _newValuNum: any
                              ) => setValidatorIndex(newValStr)}
                            >
                              <NumberInputField
                                value={validatorIndex}
                                placeholder="Enter Validator Index"
                              />
                            </NumberInput>
                          </InputGroup>
                        </Box>
                      </TabPanel>
                      <TabPanel sx={{ width: "100%" }}>
                        <Box width="100%">
                          <Select
                            color="white"
                            borderColor="purple.light"
                            placeholder="Validator ID"
                            value={selectedValidator}
                            onChange={(e) => setSelectedValidator(e.target.value)}
                          >
                            {Object.entries(fetchedValidators).map(([key, value]: [any, any], i) => (
                                <option value={value.fileData} key={key}>{value.validatorID}</option>
                            ))}
                          </Select>
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                  <Box>
                    <Text fontSize="14px" as="b" color="white">
                      {" "}
                      Validator Key Password
                    </Text>
                    <PasswordInput
                      password={validatorKeyPassword}
                      setPassword={setValidatorKeyPassword}
                      isPasswordValid={false}
                      setIsPasswordValid={() => null}
                      shouldDoValidation={false}
                    />
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
                        value={exitEpoch}
                        onChange={(
                          newValStr: React.SetStateAction<string>,
                          _newValuNum: any
                        ) => setExitEpoch(newValStr)}
                      >
                        <NumberInputField
                          value={validatorIndex}
                          placeholder="Enter Epoch"
                        />
                      </NumberInput>
                    </InputGroup>
                  </Box>
                  <Box>
                    <Text fontSize="14px" as="b" color="white">
                      Chain
                    </Text>
                    <ChainSelectionDropdown chain={chain} setChain={setChain} />
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
                        !validatorKeyPassword ||
                        !exitEpoch ||
                        !savePath ||
                        !chain
                      }
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
                    The signedExitMessage.json has been saved to your machine
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
  );
};

export default GenerateSignedExitMessageWidget;
