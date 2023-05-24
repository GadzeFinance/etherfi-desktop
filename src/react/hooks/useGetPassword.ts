import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useGetPassword(dbPassword: string) {
  const [password, setData] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await new Promise((resolve, reject) => {
          window.databaseApi.recievePassword(
            (
              event: Electron.IpcMainEvent,
              result: number,
              password: string,
              errorMessage: string
            ) => {
              if (result === 0) {
                resolve(password);
              } else {
                reject(errorMessage);
              }
            }
          );
          window.databaseApi.reqGetPassword(dbPassword);
        });

        setData(result);
      } catch (error) {
        setError(error);
        // Note: can't use error directly in description, because it's an object, will throw error
        toast({
          title: 'Error',
          description: 'Error fetching password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    if (dbPassword) fetchData();
  }, [dbPassword]);

  return { password, error };
}