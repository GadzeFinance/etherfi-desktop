import React, { useState, useCallback } from 'react';
import { Box, Button, Input, Text, useToast } from '@chakra-ui/react';
import { FileMap, StakeInfo } from '../../GenEncryptedKeysWizard';
import PreviewList from '../PreviewList/PreviewList';

interface StepImportKeyStoreFilesProps {
  goBackStep: () => void;
  goNextStep: () => void;
  stakeInfoList: StakeInfo[];
  password: string;
  setPassword: (password: string) => void;
  files: FileMap;
  setFiles: (files: FileMap) => void;
  stakingCode: string;
}

const StepImportKeyStoreFiles: React.FC<StepImportKeyStoreFilesProps> = ({ 
  goBackStep, 
  goNextStep,
  stakeInfoList,
  password,
  setPassword,
  setFiles,
  stakingCode,
  files
}) => {
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selected, setSelected] = useState(false)

  const toast = useToast()

  const importFiles = () => {
    if (!directoryHandle) return;

    readFilesAsJson(directoryHandle).then((files: FileMap) => {
      setFiles(files);
      setShowPreview(true)
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
        showPreview && <PreviewList setShowPreview={setShowPreview} pairList={makePairList()} password={password} goNextStep={goNextStep} stakingCode={stakingCode} />
      }
    </Box>
  );
};

export default StepImportKeyStoreFiles;