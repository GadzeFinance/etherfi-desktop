import React, {useState}from 'react'
import { Box, Center, ScaleFade, Input } from '@chakra-ui/react'
import raisedWidgetStyle from '../../styleClasses/raisedWidgetStyle'
import UploadFile from '../UploadFile';

const StakerTab = ({ tabIndex }) => {

    const [numFiles, setNumFiles] = useState(0);

  return (
    <Center>
    <Box maxW={'800px'} sx={raisedWidgetStyle}>
        <ScaleFade initialScale={0.5} in={tabIndex === 0}>
        <UploadFile notifyFileChange={setNumFiles}/>
          <Center>
            <Input placeholder="validator key" />
          </Center>
        </ScaleFade>
    </Box>
    </Center>
  )
}

export default StakerTab