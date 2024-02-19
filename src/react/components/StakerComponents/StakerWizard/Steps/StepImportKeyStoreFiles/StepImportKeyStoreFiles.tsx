import React, { useState, useCallback } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
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
}

const StepImportKeyStoreFiles: React.FC<StepImportKeyStoreFilesProps> = ({ 
  goBackStep, 
  goNextStep,
  stakeInfoList,
  password,
  setPassword,
  setFiles,
  files
}) => {
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const importFiles = () => {
    if (!directoryHandle) return;

    readFilesAsJson(directoryHandle).then((files: FileMap) => {
      console.log(files);

      setFiles(files);

      setShowPreview(true)
    });


  };

  const makePairList = () => {
    const pairList = stakeInfoList.map(stakeInfo => {
      const fileName = `validator-${stakeInfo.validatorID}-keystore.json`;
      const keystoreFile = files[fileName];
    
      if (!keystoreFile) {
        throw new Error(`No file found for etherfiID ${stakeInfo.validatorID}`);
      }
    
      return {
        stakeInfo,
        keystoreFile,
      };
    });
    console.log("makeing pairlist:", pairList, stakeInfoList, files)
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
      { !showPreview && <Box>
        <Text>Select the folder</Text>
        <Button onClick={handleFolderSelect}>Select Folder</Button>
        <Input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={importFiles}>Import</Button>
      </Box> }
      {
        showPreview && <PreviewList pairList={makePairList()} password={password} goNextStep={goNextStep} goBackStep={goBackStep} />
      }
    </Box>
  );
};

export default StepImportKeyStoreFiles;