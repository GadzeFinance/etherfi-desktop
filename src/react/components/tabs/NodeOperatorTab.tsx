import React, {useState} from 'react';
import { Box, Center, ScaleFade, Button, VStack } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import BidInput from '../BidInput';
import {validateUploadedFiles, SCHEMAS} from '../../utils/schemaValidations';

interface TabProps {
    tabIndex: number;
  }
  

const NodeOperatorTab: React.FC<TabProps> = ({ tabIndex }: TabProps) => {
    const [bidSize, setBidSize] = useState(1);
    const [bidPrice, setBidPrice] = useState(0.01);
    const [encryptedValKeysFile, setEncryptedValKeysFile] = useState()
    const [nodeOperatorKeysFile, setNodeOperatorKeysFile] = useState()

    const generateBidRequest = () => {
        // TODO: Validate the bid Size and Bid Price values
        window.api.receiveBidFileInfo((event:any, arg: any) => {
            // What should we get back here// if anything?
            console.log(event)
            console.log(arg)
        })
        // Send request to backend to make the files
        window.api.reqPublicBidFile(bidSize, bidPrice);
    }


  return (
    <Center>
        <ScaleFade initialScale={0.5} in={tabIndex === 1}>

            <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
            <VStack
                spacing={4}
                align='stretch'
            >
             <Box>
                 <Center color="white">
                     Step 1
                 </Center>
                 <BidInput placeholder="Bid Size:" value={bidSize}
                         setter={setBidSize} MIN={1} MAX={100}
                         increment={1}
                 />
             </Box>
             <Box>
                 <BidInput placeholder="Bid Price:" value={bidPrice}
                         setter={setBidPrice} MIN={0.01} MAX={100}
                         increment={0.01}
                 />
             </Box>
             <Box>
                <Center>
                    <Button bg="green" color="white" onClick={generateBidRequest}>Generate Bid Request</Button>
                </Center>
            </Box>
            </VStack>
            </Box>
             <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
             <VStack
                 spacing={4}
                 align='stretch'
             >


            </VStack>
             </Box>

            </ScaleFade>
        </Center>
  )

}

export default NodeOperatorTab

                //  <Button bg="green" color="white" onClick={generateBidRequest}>Generate Bid Request</Button>
                //  </Center>
                // </Box>
//          </VStack> 
         
//  <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
//  <VStack
//      spacing={4}
//      align='stretch'
//  >
//  </VStack>
 
//  </Box>
//  </VStack> 
//              </Box>
//          </ScaleFade>
//     </Center>
//     </>