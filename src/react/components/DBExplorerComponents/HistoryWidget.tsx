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
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  background,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Code,
  ModalFooter,
  Flex
} from "@chakra-ui/react";
import AddressSelect from "./AddressSelect";
import DataTable from "./DataTable";
import { ArrowBackIcon, ArrowForwardIcon, ViewIcon } from "@chakra-ui/icons";

interface HistoryWidgetProps {
  tabIndex: number
}

interface StakeInfoFile {
  name: string,
  content: string
}

interface Record {
  address: string
  mnemonic: string
  stakeInfoFile: StakeInfoFile
  validatorIds: string[]
}

interface Records {
  [key: string]: Record
}

const HistoryWidget = (props: HistoryWidgetProps) => {

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [historyRecords, setHistoryRecords] = useState<Records>({});
  const [modalData, setModalData] = useState<Record>();
  const [modalTimeStamp, setModalTimeStamp] = useState("");

  const shortenMnemonic = (mnemonic: string) => {
    const wordArray = mnemonic.split(" ");
    return `${wordArray.slice(0, 8).join(", ")} ... ${wordArray
        .slice(-5)
        .join(", ")}`;
  };

  const modalHeadingStyle = {
    fontSize: "18px"
  }

  const modalContentStyle = {
    mt: "15px",
    mb:"25px", 
    fontSize:"14px"
  }

  const pageButtonStyle = {
    background: "transparent",
    fontSize: "20px"
  }

  const showRecordModule = (ts: string, record: Record) => {
    setModalTimeStamp(ts);
    setModalData(record);
  }

  const closeModal = () => {
    setModalTimeStamp("");
  };

  useEffect(() => {

    if (props.tabIndex !== 1) return
    
    // query history records by page
    window.databaseApi.receiveHistoryByPage(
      (
        event: Electron.IpcMainEvent,
        result: number,
        records: Records,
        errorMessage: string
      ) => {

        console.log("records:", result, records)

        if (result === 0) {
          
          if (records) {

            for (const ts in records) {
              records[ts].stakeInfoFile.content = JSON.parse(records[ts].stakeInfoFile.content)
            }

            setHistoryRecords(records)
          }

        } else {
          console.error("Error getHistoryByPage");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqHistoryByPage(page);

  }, [props.tabIndex])

  console.log("modal:", modalData?.stakeInfoFile)

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
          color="white"
        > 
          <Center><Heading pt="20px" pb="40px" size="lg">History</Heading></Center>
          <Box color="white"><Divider /></Box>
          { Object.entries(historyRecords).map(([timestamp, record]) => {
            return (
              <Box id={timestamp}>
              <Box 
                px="10px"
                py="20px"
                color="#cdcdcd"
                fontSize="14px"
                cursor="pointer"
                _hover={{background: "#343158"}}
                onClick={() => showRecordModule(timestamp, record)}
              >
                <Box color="white" fontSize="18px" mb="12px">
                  {new Date(Number(timestamp)).toDateString()}: you generated {record.validatorIds.length} validators
                </Box>
                <Box py="2px">Address: {record.address}</Box>
                <Box py="2px">StakeInfo File: {record.stakeInfoFile.name}</Box>
                <Box py="2px">Mnemonic: {shortenMnemonic(record.mnemonic)}</Box>
              </Box>
              <Divider  />
              </Box>
            )
          }) }
          <Box color="white">
            <Flex justify="center" mt={4}>
              <Button {...pageButtonStyle}><ArrowBackIcon /></Button>
              <Box><Text>{page} / {pageCount}</Text></Box>
              <Button {...pageButtonStyle}><ArrowForwardIcon /></Button>
            </Flex>
            
          </Box>
        </Box>
        <Modal size={"3xl"} isOpen={modalTimeStamp !== ""} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent color={"white"} bgColor="purple.dark">
          <ModalHeader >Details: Generate Validator Keys</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            <Heading {...modalHeadingStyle}>Time</Heading>
            <Text {...modalContentStyle}>{new Date(Number(modalTimeStamp)).toDateString()}</Text>
            <Heading {...modalHeadingStyle}>Mnemonics</Heading>
            <Grid
              {...modalContentStyle}
              templateColumns="repeat(4, 1fr)"
              templateRows="repeat(6, 1fr)"
              gap={2}
              width="600px"
            >
              {modalData && modalData.mnemonic.split(" ").map((word: string, index: number) => (
                <GridItem key={index} colSpan={1} rowSpan={1} >
                    <Box
                      borderWidth="1px"
                      borderStyle="solid"
                      borderColor='purple.light'
                      borderRadius="5px"
                      bg='purple.darkBackground'
                      justifyContent='center'
                      alignItems='center'
                    >

                      <Text ml="5px" color="white" fontSize="12px" as='b' >
                        {index + 1}: {<Text ml="5px" color="white" fontSize="12px" as='b'> {word} </Text>}
                      </Text>
                    </Box>
                  </GridItem>
                ))
              }
            </Grid >
            <Heading {...modalHeadingStyle}>StakeInfo File</Heading>
            <Code
              style={modalContentStyle}
              colorScheme="purple.dark"
              fontSize="sm"
              color={"white"}
              whiteSpace="pre"
              fontFamily="monospace"
              overflowX="auto"
              width="90%"
              p={4}>
              {JSON.stringify(modalData?.stakeInfoFile?.content ?? "", null, 2)}
            </Code>
            <Heading {...modalHeadingStyle}>Validator Generated</Heading>
            <Text {...modalContentStyle}>{modalData?.validatorIds}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    </Center></>
  );
};

export default HistoryWidget;