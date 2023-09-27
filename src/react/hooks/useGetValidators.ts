import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useGetValidators(confirmedAddress?: string, password?: string) {
  const [fetchedValidators, setFetchedValidators] = useState(null);
  const [loading, setLoading] = useState(false)
  const toast = useToast();

  useEffect(() => {
    // if (!confirmedAddress) return;

    const fetchValidators = async () => {
      try {
       let fetchedValidatorsQuery = await new Promise((resolve, reject) => {
          window.encryptionApi.receiveStoredValidators(
            (
              event: Electron.IpcMainEvent,
              result: number,
              validators: string,
              errorMessage: string
            ) => {
              if (result === 0) {
                setLoading(false)
                resolve(Object.entries(JSON.parse(validators)).map(([key, value]: [string, any]) => ({
                    validatorID: key,
                    fileData: JSON.stringify(JSON.parse(value.keystore)),
                })))
              } else {
                reject(errorMessage);
              }
            }
          );
          setLoading(true)
          window.encryptionApi.reqStoredValidators(confirmedAddress, password);
        });

        setFetchedValidators(fetchedValidatorsQuery)

      } catch (error) {
        console.error('Error generating mnemonic');
        console.error(error);
        toast({
          title: 'Error',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    };

    fetchValidators();
  }, [confirmedAddress, password, toast]);

  return {fetchedValidators, loading};
}
