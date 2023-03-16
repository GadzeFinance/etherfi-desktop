import React from 'react'
import { Center, ScaleFade } from '@chakra-ui/react'
import widgetBoxStyle from '../../styleClasses/widgetBoxStyle'
import GenEncryptedKeysWizard from './StakerWizard/GenEncryptedKeysWizard'

interface TabProps {
  tabIndex: number
}

const StakerTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
  const receiveLogs = () => {
    console.log('Enabling backend logs')
    window.utilsApi.receiveLogs((event: Electron.IpcMainEvent, log: string) => {
      console.log(log)
    })
  }

  return (
    <ScaleFade initialScale={0.5} in={tabIndex === 0}>
      <Center sx={widgetBoxStyle}>
        <GenEncryptedKeysWizard navigateTo={(x) => console.log(x)} />
      </Center>
    </ScaleFade>
  )
}

export default StakerTab
