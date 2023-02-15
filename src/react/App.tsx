import React, { useState } from "react";
import { Tabs, Center, TabPanel, TabPanels } from '@chakra-ui/react'
import NavBar from "./components/Nav/NavBar";
import StakerTab from "./components/tabs/stakerTab";
import NodeOperatorTab from "./components/tabs/nodeOperatorTab";

declare global {
  interface Window {
    api: any;
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
        <NavBar nodeOperatorOptions={[0, 1]} setNodeOperatorOption={setSelectedOption} selectedOption={selectedOption} />
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
