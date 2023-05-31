import { useToast } from '@chakra-ui/react';

export default function useCopy() {

  const toast = useToast();
  
  const copyData = (data: string) => {
    try {
      window.utilsApi.copyToClipBoard(data)
      toast({
        title: "Copied",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right"
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    }
    
  }

  return { copyData };
}