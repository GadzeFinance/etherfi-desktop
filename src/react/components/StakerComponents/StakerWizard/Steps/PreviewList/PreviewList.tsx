import React from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { StakeInfo } from '../../../../../../electron/listeners';
import { FileMap } from '../../GenEncryptedKeysWizard';
import { dappUrl } from "../../../../../../electron/utils/getDappUrl"

interface PreviewListProps {
  goNextStep: () => void;
  pairList: { stakeInfo: StakeInfo; keystoreFile: string; keystoreFileName: string; }[];
  password: string;
  stakingCode: string;
}

const PreviewList: React.FC<PreviewListProps> = ({ 
  pairList,
  password,
  stakingCode,
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
            console.log("importing flow")
            console.log({
              stakeRequest: JSON.parse(stakeRequestJSON),
                  code: stakingCode,
              })

            fetch(`${dappUrl}/api/stakeRequest/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            stakeRequest: JSON.parse(stakeRequestJSON),
                            code: stakingCode,
                        }),
                    })

            goNextStep();

          } else {
              console.error("Error generating validator keys")
              console.error(errorMessage)
              // TODO: Show error screen on failure.
          }
      }
    )

    console.log("when confirm:", pairList, password)
    // now we ensure the order is correct
    const keystores = pairList.map(pair => pair.keystoreFile)
    const stakeInfo = pairList.map(pair => pair.stakeInfo)
    const keystoreNames = pairList.map(pair => pair.keystoreFileName)

    window.encryptionApi.reqGetStakeRequestOnImportKeys(keystores, stakeInfo, keystoreNames, password)
  }

  return (
    <Box maxH="400px" overflowY="scroll" overflowX={"scroll"}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Validator ID</Th>
            <Th>Key File Name</Th>
            <Th>Withdrawal Safe</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            pairList.map((pair, index) => {
              return (
                <Tr key={index}>
                  <Td>{pair.stakeInfo.validatorID}</Td>
                  <Td>{pair.keystoreFileName}</Td>
                  <Td>{pair.stakeInfo.withdrawalSafeAddress}</Td>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
      <Button onClick={confirm} colorScheme="blue" mt={4}>
        Confirm
      </Button>
    </Box>
  );
};

export default PreviewList;