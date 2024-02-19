import React from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { StakeInfo } from '../../../../../../electron/listeners';

interface PreviewListProps {
  goBackStep: () => void;
  goNextStep: () => void;
  keystore_paths: string[];
  stakeInfo: StakeInfo[];
  password: string;
}

const PreviewList: React.FC<PreviewListProps> = ({ 
  keystore_paths,
  stakeInfo,
  password,
  goNextStep 
}) => {

  const confirm = () => {

    window.encryptionApi.stakeRequestOnImportKeys(
      (
          event: Electron.IpcMainEvent,
          result: number,
          stakeRequestJSON: string,
          errorMessage: string
      ) => {
          if (result === 0) {
              console.log("stakereq", stakeRequestJSON)
          } else {
              console.error("Error generating validator keys")
              console.error(errorMessage)
              // TODO: Show error screen on failure.
          }
      }
    )

    window.databaseApi.reqGetStakeRequestOnImportKeys(keystore_paths, stakeInfo, password)

    goNextStep();
  }

  return (
    <Box maxH="400px" overflowY="scroll">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Validator ID</Th>
            <Th>Key File Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* {list.map((item, index) => ( */}
            {/* <Tr key={index}> */}
              {/* <Td>{item.keyFileName}</Td> */}
            {/* </Tr> */}
          {/* ))} */}
        </Tbody>
      </Table>
      <Button onClick={confirm} colorScheme="blue" mt={4}>
        Confirm
      </Button>
    </Box>
  );
};

export default PreviewList;