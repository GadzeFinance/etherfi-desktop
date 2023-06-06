import { useEffect, useState } from 'react';

export const useLocalStorage = (initialChain: string) => {
  const [chain, setChain] = useState(initialChain);
  const [storageChecked, setStorageChecked] = useState(false);

  const getLocalStorage = () => {
    const storedChain = localStorage.getItem('storedChain');
    if (storedChain) {
      setChain(storedChain);
    }
  };

  const setLocalStorage = () => {
    localStorage.setItem('storedChain', chain);
  };

  useEffect(() => {
    if (!storageChecked) {
      getLocalStorage();
      setStorageChecked(true);
    }
  }, [chain]);

  return { chain, setChain, setLocalStorage };
};