import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

export default function useGetStoredMnemonics(walletAddress: string, loginPassword: string) {
    const [storedMnemonics, setStoredMnemonic] = useState(undefined);
    const [error, setError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await new Promise((resolve, reject) => {
                    window.databaseApi.recieveStoredMnemonic(
                        (
                            event: Electron.IpcMainEvent,
                            result: number,
                            mnemonic: string,
                            errorMessage: string
                        ) => {
                            if (result === 0) {
                                const outputArr = Object.entries(JSON.parse(mnemonic)).map(
                                    ([id, value]: [any, any], index) => ({
                                        id: parseInt(id),
                                        mnemonic: value.mnemonic,
                                    })
                                );
                                resolve(outputArr);
                            } else {
                                reject(errorMessage);
                            }
                        }
                    );
                    window.encryptionApi.reqStoredMnemonic(walletAddress, loginPassword);
                });

                setStoredMnemonic(result);
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
    }, [walletAddress, loginPassword]);
 
    return { storedMnemonics, error };
}