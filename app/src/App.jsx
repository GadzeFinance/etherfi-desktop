import React, {useState} from "react";
import { Tabs, Center, TabPanel, TabPanels } from '@chakra-ui/react'
import NavBar from "./components/NavBar";


const App = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabsChange = (index) => {
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
              {/* <StakeTab account={account} tabIndex={tabIndex} navigateTo={handleTabsChange} /> */}
            </TabPanel>
            <TabPanel>
              {/* <BidTab account={account} tabIndex={tabIndex} /> */}
            </TabPanel>
          </TabPanels>
      </Center>
    </Tabs>
    </div>
  )
};

export default App
