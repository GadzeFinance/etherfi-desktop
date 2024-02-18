import React from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

interface PreviewListProps {
  goBackStep: () => void;
  goNextStep: () => void;
  list: Array<{ validatorID: string; keyFileName: string }>;
}

const PreviewList: React.FC<PreviewListProps> = ({ list, goNextStep }) => {

  const confirm = () => {
    
    // TODO: generate stakeInfo and request

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
          {list.map((item, index) => (
            <Tr key={index}>
              <Td>{item.validatorID}</Td>
              <Td>{item.keyFileName}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button onClick={confirm} colorScheme="blue" mt={4}>
        Confirm
      </Button>
    </Box>
  );
};

export default PreviewList;