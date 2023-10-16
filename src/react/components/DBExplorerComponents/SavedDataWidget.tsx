import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import {
  Center,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons'
import AddressSelect from "./AddressSelect";
import DataTable from "./DataTable";

interface StakerMap {
  [stakerAddress: string]: StakerInfo
}

interface ValidatorInfo {
  keystore: object,
  password: string
}

interface StakerInfo {
  mnemonicCount: number
  mnemonics: {[idx: string]: string}
  validators: {[idx: string]: ValidatorInfo}
}

interface SavedDataWidgetProps {
  tabIndex: number
  selectedOption: number
}

const SavedDataWidget = (props: SavedDataWidgetProps) => {
  const [allStakers, setAllStakers] = useState<StakerMap>({});
  const [currAddress, setCurrAddress] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const {watch} = useFormContext()
  const dbPassword = watch("loginPassword")

  const saveFile = async (blob: Blob) => {
    const a = document.createElement('a');
    a.download = 'database.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(allStakers, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveFile(blob);
  };

  useEffect(() => {

    if (props.selectedOption !== 0 || props.tabIndex !== 2) return
    
    window.databaseApi.receiveAllStakerAddresses(
      (
        event: Electron.IpcMainEvent,
        result: number,
        data: StakerMap,
        errorMessage: string
      ) => {
        if (result === 0) {
          setAllStakers(data);
          setAddressList(Object.keys(data));
          setCurrAddress(Object.keys(data).length > 0 ? Object.keys(data)[0] : "")
        } else {
          console.error("Error AllStakerAddresses");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqAllStakerAddresses(dbPassword);

  }, [props.tabIndex, props.selectedOption])

  const currStaker = allStakers[currAddress]
  const mnemonics = currStaker?.mnemonics ?? {}
  const validators = currStaker?.validators ?? {}
  const mnemonicCount = Object.keys(mnemonics).length;
  const validatorCount = Object.keys(validators).length;

  return (<>
    <Center>
      <Box sx={raisedWidgetStyle} bg="#2b2852">
        <Box
          width={'905px'}
          height={'70vh'}
          sx={{
            border: '1px solid',
            borderColor: 'purple.light',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          { addressList.length === 0 && <Box><Text color={"white"}>There is no saved data in the database</Text></Box>}
          { addressList.length > 0 && (
            <>
              <Flex minWidth='max-content' alignItems='center' justifyContent='center' gap='2'>
              <AddressSelect currAddress={currAddress} setCurrAddress={setCurrAddress} addressList={addressList} />
                <Box p='2'>
                  <Button colorScheme="gray" onClick={handleDownload}><DownloadIcon/></Button>
                </Box>
              </Flex>
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
                      <Tab mx="1" color={"white"}>Mnemonics</Tab>
                      <Tab mx="1" color={"white"}>Validators</Tab>
                    </TabList>
                  </Box>
                </Center>
                <TabPanels>
                  <TabPanel sx={{ width: "100%" }}>
                    <DataTable title="mnemonics" dataCount={mnemonicCount} data={mnemonics} /> 
                  </TabPanel>
                  <TabPanel sx={{ width: "100%" }}>
                    <DataTable title="validators" dataCount={validatorCount} data={validators} />   
                  </TabPanel>
                </TabPanels>
              </Tabs>        
            </>
          )}
        </Box>
      </Box>
    </Center></>
  );
};

export default SavedDataWidget;