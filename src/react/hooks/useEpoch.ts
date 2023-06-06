import { useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
? "https://mainnet.ether.fi/api/beaconChain/getEpoch?chain="
: "http://localhost:3000/api/beaconChain/getEpoch?chain=";

const EPOCH_OFFSET = 5;

async function fetchEpoch(chain: string) {
    try {
        if (chain !== "goerli" && chain !== "mainnet") return null;
        const response = await axios.get(API_URL + chain)
        return response.data;
    } catch (error) {
        throw new Error('An error occurred while fetching epoch');
    }
}

function useEpoch(chain: string) {

  const config = {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  }

  const { data, isLoading, isError, error, refetch } = useQuery(['epoch', chain], () => fetchEpoch(chain), config);


  let shiftedEpoch = data + EPOCH_OFFSET

  useEffect(() => {
    // Refetch the data whenever the `chain` variable changes
    refetch();
  }, [chain, refetch]);

  return { shiftedEpoch, isLoading, isError, error };
}

export default useEpoch;