import { useEffect, useState } from 'react';

export const useLocalStorage = (initialSavePath: string, initialChain: string) => {
  const [savePath, setSavePath] = useState(initialSavePath);
  const [chain, setChain] = useState(initialChain);
  const [storageChecked, setStorageChecked] = useState(false);

  const getLocalStorage = () => {
    const storedPath = localStorage.getItem('storedPath');
    if (storedPath) {
      setSavePath(storedPath);
    }
    const storedChain = localStorage.getItem('storedChain');
    if (storedChain) {
      setChain(storedChain);
    }
  };

  const setLocalStorage = () => {
    localStorage.setItem('storedPath', savePath);
    localStorage.setItem('storedChain', chain);
  };

  useEffect(() => {
    if (!storageChecked) {
      getLocalStorage();
      setStorageChecked(true);
    }
  }, [savePath, chain]);

  return { savePath, setSavePath, chain, setChain, setLocalStorage };
};