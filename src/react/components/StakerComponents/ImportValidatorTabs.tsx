import React, { ReactNode } from 'react';
import { useFormContext } from "react-hook-form";
import { TabList, Tabs, Tab, TabPanels, TabPanel, Box, Text, InputGroup, NumberInput, NumberInputField, Center } from '@chakra-ui/react';
import { COLORS } from "../../styleClasses/constants";
import PasswordInput from '../PasswordInput';
import SelectFile from '../SelectFile';
import isDev from 'react-is-dev';

type ImportValidatorTabsProps = {
    selectedTab: number;
    setSelectedTab: (index: number) => void;
    setValidatorKeyFilePath: (path: string) => void;
    validatorKeyFilePath: string;
    children: ReactNode;
};

const ImportValidatorTabs: React.FC<ImportValidatorTabsProps> = ({
    selectedTab,
    setSelectedTab,
    setValidatorKeyFilePath,
    validatorKeyFilePath,
    children,
}) => {

    const { register } = useFormContext();

    if (!isDev(React)) return <>{children}</>

    return (
        <Tabs
            index={selectedTab}
            variant="soft-rounded"
            colorScheme="purple"
            isFitted
            onChange={(index) => setSelectedTab(index)}
        >
            <Center>
                  <Box width={500} border="1px" borderColor="purple.light" borderRadius="28" padding="2">
                    <TabList>
                      <Tab mx="1" color={"white"}>Select Validator</Tab>
                      <Tab mx="1" color={"white"}>Import Validator</Tab>
                    </TabList>
                  </Box>
                </Center>

            <TabPanels>
            <TabPanel sx={{ width: "100%" }}>
                    {children}
                </TabPanel>
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
                    >
                    <NumberInputField
                        {...register('validatorIndex', {valueAsNumber: true})}
                        placeholder="Enter Validator Index"
                    />
                    </NumberInput>
                </InputGroup>
                <Box my="20px">
                <Text fontSize="14px" as="b" color="white">
                    {" "}
                    Keystore File Password
                </Text>
                <InputGroup>
                    <PasswordInput isPasswordValid={true} setIsPasswordValid={() => true} shouldDoValidation={false} noText registerText="validatorKeysPassword" />
                </InputGroup>
                </Box>
                </Box>
            </TabPanel>

            </TabPanels>
        </Tabs>
  );
};

export default ImportValidatorTabs;