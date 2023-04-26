import React, { useState, useEffect } from "react";
import { Tabs, Center, TabPanel, TabPanels } from '@chakra-ui/react'
import NavBar from "./components/Nav/NavBar";
import StakerTab from "./components/StakerComponents/StakerTab";
import NodeOperatorTab from "./components/NodeOperatorComponents/NodeOperatorTab";

declare global {
  interface Window {
    encryptionApi: any;
    validateFilesApi: any;
    databaseApi: any;
    fileSystemApi: any;
    utilsApi: any
    exitMessageApi: any
  }
}


const App: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  useEffect(() => {
    console.log('Enabling backend logs')
    window.utilsApi.receiveLogs((event: Electron.IpcMainEvent, log: string) => {
      console.log(log)
    })
  }, [])

  const options = {
    0: "Generate Keys",
    1: "Decrypt Keys"
  }
  const nodeOperatorOptions = [0, 1]

  const [selectedNodeOperatorOperation, setNodeOperatorOperation] = useState(0);
  const [stakerOperation, setStakerOperation] = useState(0);

  return (
    <div>
      <Tabs
        variant="soft-rounded"
        index={tabIndex}
        onChange={handleTabsChange}
        display="flex"
        flexDirection={'column'}
        height="100vh"
      >
        <NavBar setNodeOperatorOperation={setNodeOperatorOperation} selectedNodeOperatorOperation={selectedNodeOperatorOperation}
          setStakerOperation={setStakerOperation} selectedStakerOperation={stakerOperation}
        />
        <Center flex="auto">
          <TabPanels>
            <TabPanel>
              <StakerTab tabIndex={tabIndex} selectedOption={stakerOperation} />
            </TabPanel>
            <TabPanel>
              <NodeOperatorTab tabIndex={tabIndex} selectedOption={selectedNodeOperatorOperation} />
            </TabPanel>
          </TabPanels>
        </Center>
      </Tabs>
    </div>
  )
};


export default App
