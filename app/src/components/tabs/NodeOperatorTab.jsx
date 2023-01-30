import React, {useState} from 'react';
import { Box, Center, ScaleFade, Button, VStack } from '@chakra-ui/react';
import raisedWidgetStyle from '../../styleClasses/widgetBoxStyle';
import BidInput from '../BidInput';
import UploadFile from '../UploadFile';
import {validateUploadedFiles, SCHEMAS} from '../../utils/schemaValidations';


const NodeOperatorTab = ({ tabIndex }) => {
    const [bidSize, setBidSize] = useState(1);
    const [bidPrice, setBidPrice] = useState(0.01);
    const [encryptedValKeysFile, setEncryptedValKeysFile] = useState()
    const [nodeOperatorKeysFile, setNodeOperatorKeysFile] = useState()

    const generateBidRequest = () => {
        // TODO: Validate the bid Size and Bid Price values
        window.api.receiveBidFileInfo((event, arg) => {
            // What should we get back here// if anything?
            console.log(arg)
        })
        // Send request to backend to make the files
        window.api.reqPublicBidFile(bidSize, bidPrice);
    }




  return (
    <Center>
        <ScaleFade initialScale={0.5} in={tabIndex === 1}>
            <VStack
                spacing={4}
                align='stretch'
            >
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
            {/* STEP 2 */}
            <Box maxW={'800px'} sx={raisedWidgetStyle} bg="#2b2852">
                <VStack
                    spacing={4}
                    align='stretch'
                >
                <Box>
                    <Center color="white">
                        Step 2
                    </Center>
                    <UploadFile notifyFileChange={async (files) => {
                                    if (files.length > 0) {
                                        // setHasFile(true)
                                        const result = await validateUploadedFiles(files, "ValidatorKeys", SCHEMAS.EncryptedValidatorKeys)
                                        console.log(result)
                                        console.log("RESULT!!")
                                        // setValidationErrors(result.errors)
                                    } else {
                                        const x = 10
                                        // setHasFile(false)
                                        // setValidationErrors([])
                                    }
                                }}      
                    />
                </Box>
                <Box>
                <UploadFile notifyFileChange={(val) => console.log(val)}/>
                </Box>
                    <Box>
                    <Center>
                    <Button bg="green" color="white" onClick={null}>Decrypt Validator Keys</Button>
                    </Center>
                </Box>
                </VStack>
            </Box>
            </VStack>
        </ScaleFade>
    </Center>
  )
}

export default NodeOperatorTab