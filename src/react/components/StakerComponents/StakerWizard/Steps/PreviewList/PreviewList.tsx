import React from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { StakeInfo } from '../../../../../../electron/listeners';
import { FileMap } from '../../GenEncryptedKeysWizard';
import { dappUrl } from "../../../../../../electron/utils/getDappUrl"

interface PreviewListProps {
  address: string;
  goNextStep: () => void;
  pairList: { stakeInfo: StakeInfo; keystoreFile: string; keystoreFileName: string; }[];
  password: string;
  stakingCode: string;
  setShowPreview: (showPreview: boolean) => void;
  databasePassword: string;
}

const PreviewList: React.FC<PreviewListProps> = ({ 
  address,
  pairList,
  password,
  stakingCode,
  goNextStep,
  setShowPreview,
  databasePassword
}) => {

  const [clickedConfirm, setClickedConfirm] = React.useState(false)

  const confirm = () => {
    setClickedConfirm(true)

    window.encryptionApi.stakeRequestOnImportKeys(
      (
          event: Electron.IpcMainEvent,
          result: number,
          stakeRequestJSON: string,
          errorMessage: string
      ) => {
          if (result === 0) {
            fetch(`${dappUrl}/api/stakeRequest/upload`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            stakeRequest: stakeRequestJSON,
                            code: stakingCode,
                        }),
                    })

            goNextStep();
              setClickedConfirm(false)
          } else {
              console.error("Error generating validator keys")
              console.error(errorMessage)
              // TODO: Show error screen on failure.
              setClickedConfirm(false)
          }
      }
    )

    // now we ensure the order is correct
    const keystores = pairList.map(pair => pair.keystoreFile)
    const stakeInfo = pairList.map(pair => pair.stakeInfo)
    const keystoreNames = pairList.map(pair => pair.keystoreFileName)

    window.encryptionApi.reqGetStakeRequestOnImportKeys(address, keystores, stakeInfo, keystoreNames, password, databasePassword)
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
        <Tbody color={"white"}>
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
      <Button onClick={() => setShowPreview(false)} mt={4} mr={4}>
        Back
      </Button>
      <Button onClick={confirm} isDisabled={clickedConfirm} colorScheme="blue" mt={4}>
        Confirm
      </Button>
    </Box>
  );
};

export default PreviewList;