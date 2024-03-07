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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
} from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons'
import AddressSelect from "./AddressSelect";
import DataTable from "./DataTable";
import { useToast } from "@chakra-ui/react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { decrypt } from "../../utils/utils";

interface StakerMap {
  [stakerAddress: string]: StakerInfo
}

interface ValidatorInfo {
  keystore: string,
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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mergeModalIsOpen, setMergeModalIsOpen] = useState(false);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [overwriteFile, setOverwriteFile] = useState<any | null>(null);
  const [mergeFile, setMergeFile] = useState<any | null>(null);
  const [exportFile, setExportFile] = useState<any | null>(null);
  const [directoryPath, setDirectoryPath] = useState<string>("");
  const [exportList, setExportList] = useState<string>("");

  const {watch} = useFormContext()
  const dbPassword = watch("loginPassword")

  const toast = useToast();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setOverwriteFile(null);
  };

  const openMergeModal = () => {
    setMergeModalIsOpen(true);
  };

  const closeMergeModal = () => {
    setMergeModalIsOpen(false);
    setMergeFile(null);
  };

  const openExportModal = () => {
    setExportModalIsOpen(true);
  }

  const closeExportModal = () => {
    setExportModalIsOpen(false);
  }

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

  const handleMerge = () => {
    // TODO: implement later
  }

  const handleMergeFileSelect = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result as string;
      const data = JSON.parse(fileContent);
      console.log(data);
      setMergeFile(data);
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result as string;
      const data = JSON.parse(fileContent);
      console.log(data);
      setOverwriteFile(data);
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    window.databaseApi.receiveSetAllStakerAddresses(
      (
        event: Electron.IpcMainEvent,
        result: number,
        errorMessage: string
      ) => {
        if (result === 0) {
          console.log("SetAllStakerAddresses: Success");
          toast({
            title: "Success.",
            description: "Overwrite was successful.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          closeModal();
        } else {
          console.error("Error SetAllStakerAddresses");
          console.error(errorMessage);
        }
      }
    )

    toast({
      title: "Operation in progress.",
      description: "Please wait...",
      status: "info",
      duration: null,
      isClosable: true,
    });

    window.databaseApi.reqSetAllStakerAddresses(overwriteFile, dbPassword);
  }

  const handleExport = async () => {
    if (exportList.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a list of validator IDs",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      closeExportModal()
      return
    }
    const ids = exportList.split(",").map((id) => id.trim());
    const files = []
    const allValidators = allStakers[currAddress].validators
    for (const id of ids) {
      if (!allValidators[parseInt(id)]) {
        continue
      }
      const keystore = await decrypt(allValidators[parseInt(id)].keystore, dbPassword)
      const password = await decrypt(allValidators[parseInt(id)].password, dbPassword)
      files.push({name: `keystore-ether-fi-${id}.json`, content: keystore})
      files.push({name: `keystore-ether-fi-${id}.txt`, content: password})
    }

    const zip = new JSZip();

    // Add each file to the zip
    files.forEach(file => {
        zip.file(file.name, file.content);
    });

    // Generate the zip file and trigger the download
    zip.generateAsync({type:"blob"}).then(function(content: any) {
        saveAs(content, `exported_validators_${new Date().toISOString()}.zip`);
    });

    setExportList("")
    closeExportModal()
  }

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
          console.log("AllStakerAddresses: ", JSON.stringify(data))

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
                <Box p='2'>
                  <Button colorScheme="gray" onClick={openMergeModal}>Merge</Button>
                </Box>
                <Box p='2'>
                  <Button colorScheme="gray" onClick={openExportModal}>Export</Button>
                </Box>
                <Box p='2'>
                  <Button colorScheme="gray" onClick={openModal}>Overwrite</Button>
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
                    <DataTable title="mnemonics" dataCount={mnemonicCount} data={mnemonics} dbPassword={dbPassword} /> 
                  </TabPanel>
                  <TabPanel sx={{ width: "100%" }}>
                    <DataTable title="validators" dataCount={validatorCount} data={validators} dbPassword={dbPassword} />   
                  </TabPanel>
                </TabPanels>
              </Tabs>        
            </>
          )}
           <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Dangerous: Overwriting DB</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  This is a dangerous operation. It will overwrite the current database. Are you sure you want to continue?<br></br>
                  You will lose all the data and can't recover it.<br></br>
                  Please save a copy before this operation.<br></br><br></br><br></br>
                  Choose a db file to import.
                </Text>
                <Input type="file" onChange={handleFileSelect} />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={closeModal}>
                  Close
                </Button>
                <Button colorScheme="red" onClick={handleImport}>
                  Overwrite
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={mergeModalIsOpen} onClose={closeMergeModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Merge another DB</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Select the db to merge, it will fail if the two files have conflicting mnemonics or validator index
                </Text>
                <Input type="file" onChange={handleMergeFileSelect} />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={closeMergeModal}>
                  Close
                </Button>
                <Button colorScheme="red" onClick={handleMerge}>
                  Overwrite
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={exportModalIsOpen} onClose={closeExportModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Export Validators</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Enter a list of validator IDs, separated by comma
                </Text>
                <Input type="text" onChange={(event) => setExportList(event.target.value)} />
                {/* <Input type="file" onChange={handleExportFileSelect} /> */}
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={closeExportModal}>
                  Close
                </Button>
                <Button colorScheme="red" onClick={handleExport}>
                  Export
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Center></>
  );
};

export default SavedDataWidget;