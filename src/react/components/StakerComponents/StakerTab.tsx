import React from 'react'
import { Center, ScaleFade } from '@chakra-ui/react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'
import GenEncryptedKeysWizard from './StakerWizard/GenEncryptedKeysWizard'
import GenerateSignedExitMessageWidget from './GenerateSignedExitMessageWidget';


interface StakerTabProps {
  tabIndex: number;
  selectedOption: number,
  password: string
}

const StakerTab: React.FC<StakerTabProps> = ({ tabIndex, selectedOption, password }: StakerTabProps) => {

  return (
    <ScaleFade initialScale={0.5} in={tabIndex === 0}>
      {selectedOption === 0 && (
        <ScaleFade initialScale={0.5} in={selectedOption === 0}>
          <Center sx={widgetBoxStyle}>
            <GenEncryptedKeysWizard navigateTo={(x) => console.log(x)} password={password}/>
          </Center>
        </ScaleFade>
      )}
      {selectedOption === 1 && (
        <ScaleFade initialScale={0.5} in={selectedOption === 1}>
          <GenerateSignedExitMessageWidget password={password}/>
        </ScaleFade>
      )}
    </ScaleFade>
  )
}

export default StakerTab
