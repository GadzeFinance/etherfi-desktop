import React from 'react';
import { Select } from '@chakra-ui/react';

interface ChainSelectionDropdownProps {
    chain: string;
    setChain: (chain: string) => void,
    [key: string]: any,
}

const supportedChains = ['mainnet', 'goerli']

const ChainSelectionDropdown: React.FC<ChainSelectionDropdownProps> = ({ chain, setChain, ...props }: ChainSelectionDropdownProps) => {

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChain(event.target.value);
    };

    return (
        <Select {...props} value={chain} color="white" borderColor="purple.light" placeholder='Select a chain' onChange={handleChange}>
            {supportedChains.map((chain) => <option key={chain} value={chain}>{chain}</option>)}
        </Select>
    )
}

export default ChainSelectionDropdown
