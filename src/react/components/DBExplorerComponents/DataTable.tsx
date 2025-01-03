import { useState } from "react";
import AutoSizer from 'react-virtualized-auto-sizer';
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
  useToast
} from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";
import { CopyIcon, ViewIcon } from "@chakra-ui/icons";
import useCopy from "../../hooks/useCopy";
import { useFormContext } from "react-hook-form";
import PasswordInput from "../PasswordInput";
import PasswordCell from "./PasswordCell";
import { decrypt } from "../../utils/utils";

interface DataTableProps {
  title: string
  dataCount: number
  data: any
  dbPassword: string
}

const DataTable = ({ title, dataCount, data, dbPassword }: DataTableProps) => {
  const dataArr = Object.entries(data) as any
  const [selectedCode, setSelectedCode] = useState<any>("")
  const [authenticated, setAuthenticated] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false)
  const { watch, setValue } = useFormContext();
  const toast = useToast()

  const password = watch("password")

  const { copyData } = useCopy();

  const viewData = (content: string | object) => {
    setSelectedCode(content);
  }

  const closeModal = () => {
    setSelectedCode("");
    setAuthenticated(false);
    setValue("password", "")
  };

  const showToast = (
    title: string,
    description: string,
    status: "warning" | "info" | "success" | "error" | "loading"
  ) => {
    toast({
      title,
      description,
      status,
      position: "top-right",
      duration: 9000,
      isClosable: true,
    })
  }

  const reqAuthenticate = () => {
    window.databaseApi.receiveValidatePasswordResult(
      (
        event: Electron.IpcMainEvent,
        result: number,
        valid: boolean,
        errorMessage: string
      ) => {
        if (result === 0) {
          if (!valid) {
            showToast('Authentication Failed', 'Incorrect Password', 'warning')
          } else {
            setAuthenticated(true)
          }
        } else {
          showToast('Authentication Failed', 'Incorrect Password', 'warning')
          console.error("Error validating password");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqValidatePassword(password)
  }

  return (
    <Box h={"300px"} overflowY="auto" py="5">
      { dataCount === 0 && <Center><Text color="white">There are no {title} stored.</Text></Center> }
      { dataCount > 0 && (
        <Table mt={2} color={"white"}>
          <Thead>
            <Tr>
              <Td w="100px">Index</Td>
              {title === "validators" && <Td>File Name</Td>}
              <Td>Password</Td>
              <Td w="90px">View</Td>
              <Td w="90px">Copy</Td>
            </Tr>
          </Thead>
          <Tbody>


            <AutoSizer>
              {({ height, width }: { height: number, width: number }) => (

                <List height={650} itemCount={dataCount} itemSize={72.5} width={width}>

                  {({ index, style }) => {
                    return (
                      <Tr key={dataArr[index][0]} style={style}>
                        <Td w="100px" textAlign={"center"}>{title === "mnemonics" ? index : dataArr[index][0]}</Td>
                        {title === "validators" && (
                          <Td>
                            <Text>
                              {`validator-${dataArr[index][0]}-keystore.json`}
                            </Text>
                          </Td>
                        )}
                        <PasswordCell password={dataArr[index][1].password} dbPassword={dbPassword} />
                        <Td w="90px" cursor={"pointer"} onClick={async () => { viewData(title === "mnemonics" ? await decrypt(dataArr[index][1].mnemonic, dbPassword) : await decrypt(dataArr[index][1].keystore, dbPassword)); }} textAlign={"center"}><ViewIcon /></Td>
                        <Td w="90px" cursor={"pointer"} onClick={async () => { copyData(title === "mnemonics" ? await decrypt(dataArr[index][1].mnemonic, dbPassword) : await decrypt(dataArr[index][1].keystore, dbPassword)) }} textAlign={"center"}><CopyIcon /></Td>
                      </Tr>
                    )
                  }}
                </List>
              )}
            </AutoSizer>



          </Tbody>
        </Table>)}
      <Modal size={!authenticated || title === "mnemonics" ? "lg" : "full"} isOpen={selectedCode !== ""} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bgColor="purple.dark">
          <ModalHeader color={"white"}>{title === "mnemonics" ? "menmonic" : "validator"}</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            {!authenticated && (
              <>
                <PasswordInput
                  isPasswordValid={isPasswordValid}
                  setIsPasswordValid={setIsPasswordValid}
                  shouldDoValidation={false}
                  registerText="password"
                  noText
                />
              </>
            )}
            {title === "mnemonics" && authenticated && (
              <Grid
                templateColumns="repeat(4, 1fr)"
                templateRows="repeat(6, 1fr)"
                gap={2}
              >
                {selectedCode.split(" ").map((word: string, index: string) => (
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
              </Grid >)}
            {title !== "mnemonics" && authenticated &&
              <Code
                colorScheme="purple.dark"
                fontSize="sm"
                color={"white"}
                whiteSpace="pre"
                fontFamily="monospace"
                overflowX="auto"
                p={4}>
                {JSON.stringify(JSON.parse(selectedCode || "{}"), null, 2)}
              </Code>
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => { authenticated ? copyData(selectedCode) : reqAuthenticate() }}>{authenticated ? "Copy" : "Submit"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DataTable;