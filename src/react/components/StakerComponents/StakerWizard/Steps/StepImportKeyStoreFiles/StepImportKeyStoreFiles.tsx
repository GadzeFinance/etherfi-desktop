import React, { useState, useCallback } from 'react';
import { Box, Button, Input, Text, useToast } from '@chakra-ui/react';
import { FileMap, StakeInfo } from '../../GenEncryptedKeysWizard';
import PreviewList from '../PreviewList/PreviewList';
import { useFormContext } from "react-hook-form";

interface StepImportKeyStoreFilesProps {
  goBackStep: () => void;
  goNextStep: () => void;
  stakeInfoList: StakeInfo[];
  password: string;
  setPassword: (password: string) => void;
  files: FileMap;
  setFiles: (files: FileMap) => void;
  stakingCode: string;
  address: string;
}

const StepImportKeyStoreFiles: React.FC<StepImportKeyStoreFilesProps> = ({ 
  goBackStep, 
  goNextStep,
  stakeInfoList,
  password,
  setPassword,
  setFiles,
  stakingCode,
  files,
  address
}) => {
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const { watch } = useFormContext();
  const loginPassword = watch("loginPassword")

  const importFiles = () => {
    if (!directoryHandle) return;

    readFilesAsJson(directoryHandle).then((files: FileMap) => {
      const ids = stakeInfoList.map((stakeInfo: StakeInfo) => stakeInfo.validatorID.toString());
      window.databaseApi.recieveGetValidatorIndices(
        (
          event: Electron.IpcMainEvent,
          result: number,
          validatorIds: string[],
          errorMessage: string
        ) => {
          if (result === 0) {
            setLoading(false)
            const validatorIdSet = new Set(validatorIds);
            const duplicateIds = ids.filter(id => validatorIdSet.has(id));
            console.log(duplicateIds)
            if (duplicateIds.length > 0) {
          toast({
            title: "Error",
            description: "Duplicate public keys or ids found in the imported files and the stored validators",
            status: "error",
            position: "top-right",
            duration: 9000,
            isClosable: true,
          })
          return;
        }

        setFiles(files);
        setShowPreview(true)
          } else {
            console.error("Error finding stored validators:", errorMessage)
          }
        }
      );
      setLoading(true)
      window.databaseApi.reqGetValidatorIndices(address);
    });


  };

  const makePairList = () => {
    if (stakeInfoList.length !== Object.keys(files).length) {
      toast({
        title: "error",
        description: "stakeInfoList and files length mismatch",
        status: "error",
        position: "top-right",
        duration: 9000,
        isClosable: true,
      })
    }

    const pairList = Object.keys(files).map((fileName, i) => {
      return {
        stakeInfo: stakeInfoList[i],
        keystoreFile: files[fileName],
        keystoreFileName: fileName
      };
    })
    return pairList;
  }

  async function readFilesAsJson(directoryHandle: any): Promise<FileMap> {
    const jsonData: FileMap = {};
    const iterator = directoryHandle.values();
  
    for await (const fileHandle of iterator) {
      const file = await fileHandle.getFile();
      const reader = new FileReader();
  
      const fileData: Promise<string> = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
  
      const fileText = await fileData;
      jsonData[file.name] = fileText;
    }
  
    return jsonData;
  }

    const handleFolderSelect = async () => {
      // Check if the File System Access API is available
      if (window.showDirectoryPicker) {
        try {
          const directoryHandle = await window.showDirectoryPicker();
          setDirectoryHandle(directoryHandle);
          setSelected(true)
        } catch (error) {
          console.error(error);
        }
      } else {
        // Fallback or inform the user that their browser does not support this feature
        alert('Your browser does not support the File System Access API');
      }
    };

  return (
    <Box>
      { !showPreview && <Box color={"white"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <Text fontSize={"20"} fontWeight="bold">Select the folder</Text>
          <Button color={"black"} onClick={handleFolderSelect}>{ selected ? "Selected" : "Select Folder"}</Button>
          <Input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button color={"black"} onClick={importFiles}>Import</Button>
        </Box> }
      {
        showPreview && <PreviewList address={address} setShowPreview={setShowPreview} pairList={makePairList()} password={password} goNextStep={goNextStep} stakingCode={stakingCode} databasePassword={loginPassword} />
      }
    </Box>
  );
};

export default StepImportKeyStoreFiles;