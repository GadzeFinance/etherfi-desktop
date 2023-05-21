import React, { useState, useEffect } from "react";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Code,
  Center,
  Box,
  Text,
  Thead,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel
} from "@chakra-ui/react";
import AddressSelect from "./AddressSelect";
import DataTable from "./DataTable";

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
}

const DBExplorer = (props: DBExplorerProps) => {
  const [allStakers, setAllStakers] = useState<StakerMap>({
    "0x1": {
      mnemonicCount: 2,
      mnemonics: {
        0: "define blush there city under ready oak trap pluck correct regret angry program actor good receive umbrella mail merry divide average border juice cannon",
        1: "fefine flush fhere fity fnder ready oak trap pluck correct regret angry program actor good receive umbrella mail merry divide average border juice cannon"
      },
      validators: {
        55: `{
          "crypto": {
            "kdf": {
              "function": "scrypt",
              "params": {
                "dklen": 32,
                "n": 262144,
                "r": 8,
                "p": 1,
                "salt": "5c7dcd9337deb4be73c36a869398ca245925b7431902091ce4b6b7a7feae4f37"
              },
              "message": ""
            },
            "checksum": {
              "function": "sha256",
              "params": {},
              "message": "cbdbe68da6d5960d4cc88b7599db6f367340b071f0c172b5c15d9d0787ed844d"
            },
            "cipher": {
              "function": "aes-128-ctr",
              "params": {
                "iv": "1eb05ccecd5ccf1061df76d31e951d73"
              },
              "message": "facb8d5eaad624d629ec5d1e4834a11bc8606fb1f9c8365514ce4a16cdcd49fb"
            }
          },
          "description": "",
          "pubkey": "803a3029637da6201d034de171b0381f37e0dea0293c2cf78c9971852d4285b7caae0e6d0799fa54b950d754856a06bf",
          "path": "m/12381/3600/1/0/0",
          "uuid": "97fc5258-122a-4857-b124-96b185ff22ee",
          "version": 4
        }`,
        56: `{
          "crypto": {
            "kdf": {
              "function": "scrypt",
              "params": {
                "dklen": 32,
                "n": 262144,
                "r": 8,
                "p": 1,
                "salt": "5c7dcd9337deb4be73c36a869398ca245925b7431902091ce4b6b7a7feae4f37"
              },
              "message": ""
            },
            "checksum": {
              "function": "sha256",
              "params": {},
              "message": "cbdbe68da6d5960d4cc88b7599db6f367340b071f0c172b5c15d9d0787ed844d"
            },
            "cipher": {
              "function": "aes-128-ctr",
              "params": {
                "iv": "1eb05ccecd5ccf1061df76d31e951d73"
              },
              "message": "facb8d5eaad624d629ec5d1e4834a11bc8606fb1f9c8365514ce4a16cdcd49fb"
            }
          },
          "description": "",
          "pubkey": "803a3029637da6201d034de171b0381f37e0dea0293c2cf78c9971852d4285b7caae0e6d0799fa54b950d754856a06bf",
          "path": "m/12381/3600/1/0/0",
          "uuid": "97fc5258-122a-4857-b124-96b185ff22ee",
          "version": 4
        }`
      }
    },
    "0x2": {
      mnemonicCount: 2,
      mnemonics: {
        0: "define blush there city under ready oak trap pluck correct regret angry program actor good receive umbrella mail merry divide average border juice cannon",
        1: "define blush there city under ready oak trap pluck correct regret angry program actor good receive umbrella mail merry divide average border juice cannon"
      },
      validators: {
        55: `{
          "crypto": {
            "kdf": {
              "function": "scrypt",
              "params": {
                "dklen": 32,
                "n": 262144,
                "r": 8,
                "p": 1,
                "salt": "5c7dcd9337deb4be73c36a869398ca245925b7431902091ce4b6b7a7feae4f37"
              },
              "message": ""
            },
            "checksum": {
              "function": "sha256",
              "params": {},
              "message": "cbdbe68da6d5960d4cc88b7599db6f367340b071f0c172b5c15d9d0787ed844d"
            },
            "cipher": {
              "function": "aes-128-ctr",
              "params": {
                "iv": "1eb05ccecd5ccf1061df76d31e951d73"
              },
              "message": "facb8d5eaad624d629ec5d1e4834a11bc8606fb1f9c8365514ce4a16cdcd49fb"
            }
          },
          "description": "",
          "pubkey": "803a3029637da6201d034de171b0381f37e0dea0293c2cf78c9971852d4285b7caae0e6d0799fa54b950d754856a06bf",
          "path": "m/12381/3600/1/0/0",
          "uuid": "97fc5258-122a-4857-b124-96b185ff22ee",
          "version": 4
        }`,
        56: `{
          "crypto": {
            "kdf": {
              "function": "scrypt",
              "params": {
                "dklen": 32,
                "n": 262144,
                "r": 8,
                "p": 1,
                "salt": "5c7dcd9337deb4be73c36a869398ca245925b7431902091ce4b6b7a7feae4f37"
              },
              "message": ""
            },
            "checksum": {
              "function": "sha256",
              "params": {},
              "message": "cbdbe68da6d5960d4cc88b7599db6f367340b071f0c172b5c15d9d0787ed844d"
            },
            "cipher": {
              "function": "aes-128-ctr",
              "params": {
                "iv": "1eb05ccecd5ccf1061df76d31e951d73"
              },
              "message": "facb8d5eaad624d629ec5d1e4834a11bc8606fb1f9c8365514ce4a16cdcd49fb"
            }
          },
          "description": "",
          "pubkey": "803a3029637da6201d034de171b0381f37e0dea0293c2cf78c9971852d4285b7caae0e6d0799fa54b950d754856a06bf",
          "path": "m/12381/3600/1/0/0",
          "uuid": "97fc5258-122a-4857-b124-96b185ff22ee",
          "version": 4
        }`
      }
    }
  });
  const [generating, setGenerating] = useState(false);
  const [currAddress, setCurrAddress] = useState("0x1");
  const [addressList, setAddressList] = useState(["0x1", "0x2"]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    
    window.databaseApi.receiveAllStakerAddresses(
      (
        event: Electron.IpcMainEvent,
        result: number,
        data: StakerMap,
        errorMessage: string
      ) => {
        console.log("received AllStakerAddresses:", result, data, errorMessage);
        if (result === 0) {
          
          setAllStakers(data);
          setAddressList(Object.keys(data));
          setCurrAddress(Object.keys(data).length > 0 ? Object.keys(data)[0] : "")

        } else {
          console.error("Error AllStakerAddresses");
          console.error(errorMessage);
        }
        setGenerating(false);
      }
    );
    window.databaseApi.reqAllStakerAddresses(props.password);
    setGenerating(true);

  }, [])

  const currStaker = allStakers[currAddress]
  const { mnemonics, validators } = currStaker
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
