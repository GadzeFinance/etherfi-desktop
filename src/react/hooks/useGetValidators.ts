import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useGetValidators(confirmedAddress: string, password: string) {
  const [fetchedValidators, setFetchedValidators] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!confirmedAddress) return;

    const fetchValidators = async () => {
      console.log("PASSWORD: ", password)
      try {
       const fetchedValidatorsQuery = await new Promise((resolve, reject) => {
          window.encryptionApi.receiveStoredValidators(
            (
              event: Electron.IpcMainEvent,
              result: number,
              validators: string,
              errorMessage: string
            ) => {
              if (result === 0) {
                console.log(validators)
                resolve(Object.entries(JSON.parse(validators)).map(([key, value]: [string, string]) => ({
                    validatorID: key,
                    fileData: JSON.stringify(JSON.parse(value))
                })))
              } else {
                reject(errorMessage);
              }
            }
          );
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

  return fetchedValidators;
}
