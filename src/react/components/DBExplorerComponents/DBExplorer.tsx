import React, { useState, useEffect } from "react";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import {
  Table,
  Tbody,
  Tr,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Code,
  Center,
  Box
} from "@chakra-ui/react";

const DBExplorer = () => {
  const [dbcontents, setDbContents] = useState({})

  useEffect(() => {
    window.utilsApi.recieveDatabaseContents(
        (
          event: Electron.IpcMainEvent,
          result: number,
          data: string,
          errorMessage: string
        ) => {
          if (result === 0) {
            console.log(JSON.parse(data))
            setDbContents(JSON.parse(data))
          } else {
            console.error("Error Fetching Data");
            console.error(errorMessage);
          }
        }
      );
      window.utilsApi.reqDatabaseContents();

  }, [])


  const [selectedCode, setSelectedCode] = useState("");

  const openModal = (code :string) => {
    setSelectedCode(code);
  };

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

  return (
    <Center>
      <Box sx={raisedWidgetStyle} bg="#2b2852">
        <Table variant="simple">
          <Tbody>
            {Object.entries(dbcontents).map(([key, code]: [string, string]) => (
              <Tr key={key}>
                <Td width="150px" color="white">{key}</Td>
                <Td>
                  <Code
                    colorScheme="gray"
                    fontSize="sm"
                    maxWidth="200px"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    {code}
                  </Code>
                  <Button size="sm" ml={2} onClick={() => openModal(code)}>
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={selectedCode !== ""} onClose={closeModal} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Code Snippet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Code
                colorScheme="gray"
                fontSize="sm"
                whiteSpace="pre"
                fontFamily="monospace"
                overflowX="auto"
                p={4}
              >
                {JSON.stringify(renderParsedCode(selectedCode), null, 2)}
              </Code>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
};

export default DBExplorer;
