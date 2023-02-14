import React from 'react';
import GenerateKeysWidget from '../GenerateKeysWidget';

interface TabProps {
    tabIndex: number;
  }

const NodeOperatorTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {

  return (
    <>
        <GenerateKeysWidget/>
    </>
  )
}


export default NodeOperatorTab
