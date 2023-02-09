import React, {useState} from "react";
import { Tabs, Center, TabPanel, TabPanels } from '@chakra-ui/react'
import NavBar from "./components/NavBar";
import StakerTab from "./components/tabs/stakerTab";
import NodeOperatorTab from "./components/tabs/nodeOperatorTab";

declare global {
  interface Window {
      api:any;
  }
}


const App: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabsChange = (index : number) => {
    setTabIndex(index)
  }

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
        <NavBar />
        <Center flex="auto">
            <TabPanels>
              <TabPanel>
                <StakerTab tabIndex={tabIndex} />
              </TabPanel>
              <TabPanel>
                <NodeOperatorTab tabIndex={tabIndex} />
              </TabPanel>
            </TabPanels>
        </Center>
      </Tabs>
    </div>
  )
};


export default App
