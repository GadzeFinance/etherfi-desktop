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
  TabPanel
} from "@chakra-ui/react";
import AddressSelect from "./AddressSelect";
import DataTable from "./DataTable";
import useGetPassword from "../../hooks/useGetPassword";

interface StakerMap {
  [stakerAddress: string]: StakerInfo
}

interface StakerInfo {
  mnemonicCount: number
  mnemonics: {[idx: string]: string}
  validators: {[idx: string]: string}
}

interface DBExplorerProps {
  password: string
  tabIndex: number
}

const DBExplorer = (props: DBExplorerProps) => {
  const [allStakers, setAllStakers] = useState<StakerMap>({});
  const [currAddress, setCurrAddress] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const {watch} = useFormContext()
  const dbPassword = watch("loginPassword")

  useEffect(() => {

    if (props.tabIndex !== 2) return
    
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

  }, [props.tabIndex])

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
              <AddressSelect currAddress={currAddress} setCurrAddress={setCurrAddress} addressList={addressList} />
              <Tabs
                    index={selectedTab}
                    onChange={(index) => setSelectedTab(index)}
                  >
                    <TabList>
                      <Tab color={"white"}>Mnemonics</Tab>
                      <Tab color={"white"}>Validators</Tab>
                    </TabList>
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

export default DBExplorer;
