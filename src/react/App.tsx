import React, { useState } from "react";
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
  }
}


const App: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const options = {
    0: "Generate Keys",
    1: "Decrypt Keys"
  }
  const nodeOperatorOptions = [0, 1]

  const [selectedOption, setSelectedOption] = useState(0);
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
        <NavBar setNodeOperatorOption={setSelectedOption} selectedOption={selectedOption} />
        <Center flex="auto">
          <TabPanels>
            <TabPanel>
              <StakerTab tabIndex={tabIndex} />
            </TabPanel>
            <TabPanel>
              <NodeOperatorTab tabIndex={tabIndex} selectedOption={selectedOption} />
            </TabPanel>
          </TabPanels>
        </Center>
      </Tabs>
    </div>
  )
};


export default App
