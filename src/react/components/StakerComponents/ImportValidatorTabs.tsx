import React, { ReactNode } from 'react';
import { useFormContext } from "react-hook-form";
import { TabList, Tabs, Tab, TabPanels, TabPanel, Box, Text, InputGroup, NumberInput, NumberInputField } from '@chakra-ui/react';
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

    if (isDev(React)) return <>{children}</>

    return (
        <Tabs
            index={selectedTab}
            onChange={(index) => setSelectedTab(index)}
        >
            <TabList>
            <Tab color={"white"}>Import Validator</Tab>
            <Tab color={"white"}>Select Validator</Tab>
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
                <TabPanel sx={{ width: "100%" }}>
                    {children}
                </TabPanel>
            </TabPanels>
        </Tabs>
  );
};

export default ImportValidatorTabs;