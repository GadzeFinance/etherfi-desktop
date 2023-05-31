import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Tabs, Center, TabPanel, TabPanels } from '@chakra-ui/react'
import NavBar from "./components/Nav/NavBar";
import StakerTab from "./components/StakerComponents/StakerTab";
import NodeOperatorTab from "./components/NodeOperatorComponents/NodeOperatorTab";
import DBExplorer from "./components/DBExplorerComponents/DBExplorer";
import LoginPage from "./components/LoginPageComponents/LoginPage";
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
  // const [tabIndex, setTabIndex] = useState<number>(2)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [selectedDBOperation, setSelectedDBOperation] = useState(0);
  // const [selectedDBOperation, setSelectedDBOperation] = useState(1);
  const [selectedNodeOperatorOperation, setNodeOperatorOperation] = useState(0);
  const [stakerOperation, setStakerOperation] = useState(0);
  const methods = useForm({ shouldUseNativeValidation: true });

  useEffect(() => {
    console.log('Enabling backend logs')
    window.utilsApi.receiveLogs((event: Electron.IpcMainEvent, log: string) => {
      console.log(log)
    })
  }, [])


  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }


  return (
    <FormProvider {...methods} >
      { !isAuthenticated && <LoginPage setIsAuthenticated={setIsAuthenticated} setPassword={setPassword} password={password}/> }
      { isAuthenticated && <Tabs
        variant="soft-rounded"
        index={tabIndex}
        onChange={handleTabsChange}
        display="flex"
        flexDirection={'column'}
        height="100vh"
      >
        <NavBar 
          setNodeOperatorOperation={setNodeOperatorOperation} 
          selectedNodeOperatorOperation={selectedNodeOperatorOperation}
          setStakerOperation={setStakerOperation} 
          selectedStakerOperation={stakerOperation}
          setSelectedDBOperation={setSelectedDBOperation}
          selectedDBOperation={selectedDBOperation}
        />
        <Center flex="auto">
          <TabPanels>
            <TabPanel>
              <StakerTab tabIndex={tabIndex} selectedOption={stakerOperation} password={password}/>
            </TabPanel>
            <TabPanel>
              <NodeOperatorTab tabIndex={tabIndex} selectedOption={selectedNodeOperatorOperation} />
            </TabPanel>
            <TabPanel flexDirection={'row'}>
              <DBExplorer tabIndex={tabIndex} selectedOption={selectedDBOperation} password={password}/>
            </TabPanel>
          </TabPanels>
        </Center>
      </Tabs>}
    </FormProvider>
  )
};


export default App
