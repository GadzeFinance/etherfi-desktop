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
          window.databaseApi.receiveGetStakerAddressList(
            (
              event: Electron.IpcMainEvent,
              result: number,
              addresses: string,
              errorMessage: string
            ) => {
              if (result === 0) {
                resolve(Object.keys(addresses));
              } else {
                reject(errorMessage);
              }
            }
          );
          window.databaseApi.reqGetStakerAddressList();
        });

        setData(result);
      } catch (error) {
        setError(error);
        // Note: can't use error directly in description, because it's an object, will throw error
        toast({
          title: 'Error',
          description: 'Something bad happend in the backend',
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