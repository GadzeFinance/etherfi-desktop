import React, { useState, useEffect } from "react";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Box,
  Center,
  Container,
  useClipboard,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Code,
  GridItem,
  Grid,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon, CopyIcon, ViewIcon } from "@chakra-ui/icons";

interface DataTableProps {
  title: string
  dataCount: number
  data: { [idx: string] : string }
}

const DataTable = ({title, dataCount, data}: DataTableProps) => {

  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  const [selectedCode, setSelectedCode] = useState<string>("")

  const indices = Object.entries(data);

  const shortenMnemonic = (mnemonic: any) => {
    const wordArray = mnemonic.split(" ");
    return `${wordArray.slice(0, 7).join(", ")} ... ${wordArray
        .slice(-3)
        .join(", ")}`;
  };

  const viewData = (content: string) => {
    setSelectedCode(content);
  }

  const closeModal = () => {
    setSelectedCode("");
  };

  const renderParsedCode = (code: string) => {
    try {
      const parsedCode = JSON.parse(code)
      return parsedCode
    } catch(e) {
      return selectedCode
    }
  }

  const copyData = (content: string) => {
    setValue(content);
    setTimeout(() => {
      // setValue is asynchronous.
      onCopy()
    }, 3000)
  }

  return (
    <Box py="5">
    {/* <Text color={"white"} fontSize={"xl"}>{title}</Text> */}
    <Table mt={2} color={"white"}>
      <Thead>
        <Tr>
          <Td w="100px">Index</Td>
          <Td>{ title === "mnemonics" ? "Preview" : "File Name"}</Td>
          <Td w="90px">View</Td>
          <Td w="90px">Copy</Td>
        </Tr>
      </Thead>
      <Tbody>
        { dataCount === 0 && <Text>There is no {title} stored.</Text> }
        { dataCount > 0 && Object.entries(data).map(([idx, content]) => <>
            <Tr key={idx}>
              <Td w="100px" textAlign={"center"}>{idx}</Td>
              <Td><Text>{
                title === "mnemonics" ? shortenMnemonic(content) : `validtor-${idx}-keystore.json`
                }</Text></Td>
              <Td w="90px" cursor={"pointer"} onClick={() => { viewData(content); }} textAlign={"center"}><ViewIcon/></Td>
              <Td w="90px" cursor={"pointer"} onClick={() => { copyData(content);}} textAlign={"center"}><CopyIcon/></Td>
            </Tr>
          </>)}
      </Tbody>
    </Table>
      <Modal size="lg" isOpen={selectedCode !== ""} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bgColor="purple.dark">
          <ModalHeader color={"white"}>{title === "mnemonics" ? "menmonic" : "validator"}</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
          <Grid
        templateColumns="repeat(4, 1fr)"
        templateRows="repeat(6, 1fr)"
        gap={2}
      >
        {selectedCode.split(" ").map((word, index) => (
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
          </ModalBody>
          <ModalFooter>
            <Button>Copy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>)

}

export default DataTable;