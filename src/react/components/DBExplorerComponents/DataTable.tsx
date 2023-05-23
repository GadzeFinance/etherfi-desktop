import { useState } from "react";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Box,
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
  Center,
} from "@chakra-ui/react";
import { CopyIcon, ViewIcon } from "@chakra-ui/icons";

interface DataTableProps {
  title: string
  dataCount: number
  data: { [idx: string] : string }
}

const DataTable = ({title, dataCount, data}: DataTableProps) => {

  const [selectedCode, setSelectedCode] = useState<string>("")

  const shortenMnemonic = (mnemonic: any) => {
    const wordArray = mnemonic.split(" ");
    return `${wordArray.slice(0, 5).join(", ")} ... ${wordArray
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

  const copyData = (data: string) => {
    window.utilsApi.copyToClipBoard(data)
  }

  return (
    <Box h={"380px"} overflowY="auto" py="5">
      { dataCount === 0 && <Center><Text color="white">There is no {title} stored.</Text></Center> }
      { dataCount > 0 && (
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
            { Object.entries(data).map(([idx, content]) => <>
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
        </Table>)}
      <Modal size={ title === "mnemonics" ? "lg" : "full" } isOpen={selectedCode !== ""} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bgColor="purple.dark">
          <ModalHeader color={"white"}>{title === "mnemonics" ? "menmonic" : "validator"}</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            { title === "mnemonics" && (
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
            </Grid >) }
            { title !== "mnemonics" && 
              <Code
                colorScheme="purple.dark"
                fontSize="sm"
                color={"white"}
                whiteSpace="pre"
                fontFamily="monospace"
                overflowX="auto"
                p={4}>
                {JSON.stringify(renderParsedCode(selectedCode), null, 2)}
              </Code>
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => copyData(selectedCode)}>Copy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DataTable;