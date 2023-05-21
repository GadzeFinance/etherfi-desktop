import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useGetStakerAddresses() {
  const [addressOptions, setData] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await new Promise((resolve, reject) => {
          window.encryptionApi.receieveGetStakerAddresses(
            (
              event: Electron.IpcMainEvent,
              result: number,
              addresses: string,
              errorMessage: string
            ) => {
              if (result === 0) {
                resolve(Object.keys(JSON.parse(addresses)));
              } else {
                reject(errorMessage);
              }
            }
          );
          window.encryptionApi.reqGetStakerAddresses();
        });

        setData(result);
      } catch (error) {
        setError(error);
        toast({
          title: 'Error',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, []);

  return { addressOptions, error };
}