import React, { useState, useCallback } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { FileMap } from '../../GenEncryptedKeysWizard';

interface StepImportKeyStoreFilesProps {
  goBackStep: () => void;
  goNextStep: () => void;
  password: string;
  setPassword: (password: string) => void;
  setFiles: (files: FileMap) => void;
}

const StepImportKeyStoreFiles: React.FC<StepImportKeyStoreFilesProps> = ({ 
  goBackStep, 
  goNextStep,
  password,
  setPassword,
  setFiles
}) => {
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);

  const importFiles = () => {
    if (!directoryHandle) return;

    readFilesAsJson(directoryHandle).then((files: FileMap) => {
      console.log(files);

    //   window.encryptionApi.receiveGenerateKey(
    //     (
    //         event: Electron.IpcMainEvent,
    //         index: number,
    //         total: number,
    //         usedTime: number
    //     ) => {
    //         setKeysGenerated(index + 1)
    //         setKeysTotal(total)
    //     }
    // )

      setFiles(files);

      goNextStep();
    });


  };

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
      <Text>Select the folder</Text>
      <Button onClick={handleFolderSelect}>Select Folder</Button>
      <Input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={importFiles}>Import</Button>
    </Box>
  );
};

export default StepImportKeyStoreFiles;