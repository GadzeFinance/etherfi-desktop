import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios'

const graphqlEndpoint = process.env.NODE_ENV === 'production'
? "https://api.studio.thegraph.com/query/41778/etherfi-mainnet/0.0.3"
: 'https://api.studio.thegraph.com/query/41778/etherfi-goerli/0.0.1';

const queryEndpoint = process.env.NODE_ENV === 'production'
? "https://etherfi.vercel.app/api/beaconChain/findOneCollated?pubkey="
: "https://goerli.etherfi.vercel.app/api/beaconChain/findOneCollated?pubkey="

const getBeaconIndex = async (validatorID: number) => {

  const hexID = `0x${validatorID.toString(16)}`
  const data = {
    query: `{
        validators(where: {id: "${hexID}"}) {
          id
          validatorPubKey
        }
      }`,
  };

  try {
    const response = await axios.post(graphqlEndpoint, data);

    if (response.status === 200) {
        let pub = response.data.data.validators[0].validatorPubKey;
        const queryURL = queryEndpoint + pub;
        const newResp = await axios.post(queryURL);
        return newResp.data.db.validatorIndex;
    } else {
        throw new Error(
            "GraphQL request failed with status: " + response.status
        );
    }
  } catch (error) {
      throw new Error("GraphQL request failed: " + error.message);
  }

}

export default function useGetValidators(confirmedAddress: string, password: string) {
  const [fetchedValidators, setFetchedValidators] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!confirmedAddress) return;

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
                resolve(Object.entries(JSON.parse(validators)).map(async ([key, value]: [string, any]) => ({
                    validatorID: key,
                    fileData: JSON.stringify(JSON.parse(value.keystore)),
                    beaconID: await getBeaconIndex(parseInt(key))
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
