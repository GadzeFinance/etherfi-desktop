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
import { ArrowBackIcon, ArrowForwardIcon, CopyIcon, ViewIcon } from "@chakra-ui/icons";
import useGetHistoryPageCount from "../../hooks/useGetHistoryPageCount";
import useCopy from "../../hooks/useCopy";

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

  const {pageCount, error: pageCountError} = useGetHistoryPageCount();
  const {copyData} = useCopy();

  const [page, setPage] = useState(1);
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

  const stepForward = () => {
    if (page + 1 > pageCount) return;
    setPage(page + 1);
  }

  const stepBack = () => {
    if (page - 1 < 1) return;
    setPage(page - 1);
  }

  useEffect(() => {

    if (props.tabIndex !== 1) return

    if (!pageCount) return
    
    // query history records by page
    window.databaseApi.receiveHistoryByPage(
      (
        event: Electron.IpcMainEvent,
        result: number,
        records: Records,
        errorMessage: string
      ) => {

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

  }, [props.tabIndex, page, pageCount])

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
        <Grid height="100%" templateRows="repeat(8, 1fr)" gap={4}>
          <GridItem rowSpan={1}>
            <Center ><Heading size="lg">History</Heading></Center>
          </GridItem>
          <GridItem overflowY="scroll" rowSpan={6}>
          <Box overflowY="scroll">
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
                    {`${new Date(Number(timestamp)).toDateString()}, ${new Date(Number(timestamp)).toLocaleTimeString()} =>`}  you generated {record.validatorIds.length} validators
                  </Box>
                  <Box py="2px">Address: {record.address}</Box>
                  <Box py="2px">StakeInfo File: {record.stakeInfoFile.name}</Box>
                  <Box py="2px">Mnemonic: {shortenMnemonic(record.mnemonic)}</Box>
                </Box>
                <Divider  />
                </Box>
              )
            }) }
          </Box>
          </GridItem>
          <GridItem rowSpan={1}>
            <Box height="50px" color="white">
              <Flex height="50px" justify="center">
                <Button onClick={stepBack} height="50px" {...pageButtonStyle}><ArrowBackIcon /></Button>
                <Box lineHeight="50px" marginX="15px"><Text>{page} / {pageCount}</Text></Box>
                <Button onClick={stepForward} height="50px" {...pageButtonStyle}><ArrowForwardIcon /></Button>
              </Flex>
            </Box>
          </GridItem>
          </Grid>
        </Box>
        <Modal size={"3xl"} isOpen={modalTimeStamp !== ""} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent color={"white"} bgColor="purple.dark">
          <ModalHeader >Details: Generate Validator Keys</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            <Heading {...modalHeadingStyle}>Time</Heading>
            <Text {...modalContentStyle}>{`${new Date(Number(modalTimeStamp)).toDateString()}, ${new Date(Number(modalTimeStamp)).toLocaleTimeString()}`}</Text>
            <Heading {...modalHeadingStyle}>Mnemonics <CopyIcon onClick={() => {copyData(modalData?.mnemonic)}} ml="5px" cursor="pointer" /></Heading>
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
            <Heading {...modalHeadingStyle}>StakeInfo File <CopyIcon onClick={() => {copyData(JSON.stringify(modalData?.stakeInfoFile?.content))}} ml="5px" cursor="pointer" /></Heading>
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
            <Text {...modalContentStyle}>Validator Ids: {modalData?.validatorIds.join(", ")}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
    </Center></>
  );
};

export default HistoryWidget;