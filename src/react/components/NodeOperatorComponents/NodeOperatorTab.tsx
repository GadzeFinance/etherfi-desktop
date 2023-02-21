import React from 'react';
import { ScaleFade } from '@chakra-ui/react'
import GenerateKeysWidget from './GenerateKeysWidget';
import DecryptValidatorKeysWidget from './DecryptValidatorKeysWidget';

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
      <ScaleFade initialScale={0.5} in={tabIndex === 1}>
        {selectedOption === 0 && <GenerateKeysWidget />}
        {selectedOption === 1 && <DecryptValidatorKeysWidget />}
      </ScaleFade>

    </>
  )
}


export default NodeOperatorTab
