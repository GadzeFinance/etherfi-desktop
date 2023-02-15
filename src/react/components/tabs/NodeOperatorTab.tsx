import React from 'react';
import GenerateKeysWidget from '../GenerateKeysWidget';
import DecryptValidatorKeysWidget from '../DecryptValidatorKeysWidget';

interface NodeOperatorTabProps {
  tabIndex: number;
  selectedOption: number,
}

const nodeOperatorOptions = {
  0: "Generate Keys",
  1: "Decrypt Keys",
}

const NodeOperatorTab: React.FC<NodeOperatorTabProps> = ({ tabIndex, selectedOption }: NodeOperatorTabProps) => {

  return (
    <>
      {selectedOption === 0 && <GenerateKeysWidget />}
      {selectedOption === 1 && <DecryptValidatorKeysWidget />}
    </>
  )
}


export default NodeOperatorTab
