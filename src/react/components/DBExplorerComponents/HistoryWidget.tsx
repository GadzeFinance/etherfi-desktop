import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import raisedWidgetStyle from "../../styleClasses/widgetBoxStyle";
import {
  Center,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel
} from "@chakra-ui/react";
import AddressSelect from "./AddressSelect";
import DataTable from "./DataTable";
import useGetPassword from "../../hooks/useGetPassword";

interface HistoryWidgetProps {
  tabIndex: number
}

const HistoryWidget = (props: HistoryWidgetProps) => {

  const [page, setPage] = useState(1);
  const [historyRecords, setHistoryRecords] = useState([]);

  useEffect(() => {

    if (props.tabIndex !== 1) return
    
    // query history records by page
    window.databaseApi.receiveHistoryByPage(
      (
        event: Electron.IpcMainEvent,
        result: number,
        data: [],
        errorMessage: string
      ) => {

        console.log("records:", result, data)

        if (result === 0) {
          
          setHistoryRecords(data)

        } else {
          console.error("Error AllStakerAddresses");
          console.error(errorMessage);
        }
      }
    );
    window.databaseApi.reqHistoryByPage(page);

  }, [props.tabIndex])

  return (<>
    <Center>
      <Box sx={raisedWidgetStyle} bg="#2b2852">
        <Box
          width={'905px'}
          height={'70vh'}
          sx={{
            border: '1px solid',
            borderColor: 'purple.light',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          
        </Box>
      </Box>
    </Center></>
  );
};

export default HistoryWidget;