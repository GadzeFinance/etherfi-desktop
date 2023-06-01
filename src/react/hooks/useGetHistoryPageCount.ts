import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useGetHistoryPageCount() {
  const [pageCount, setPageCount] = useState(-1);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await new Promise<number>((resolve, reject) => {
          window.databaseApi.receiveHistoryPageCount(
            (
              event: Electron.IpcMainEvent,
              result: number,
              pageCount: number,
              errorMessage: string
            ) => {
              if (result === 0) {
                resolve(pageCount);
              } else {
                reject(errorMessage);
              }
            }
          );
          window.databaseApi.reqHistoryPageCount();
        });

        setPageCount(result);
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

  return { pageCount, error };
}