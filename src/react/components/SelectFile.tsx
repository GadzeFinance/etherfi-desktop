import React from 'react'
import { Flex, Text, Box, Center, VStack } from '@chakra-ui/react'
import IconFile from './Icons/IconFile'
import IconTrash from './Icons/IconTrash'
import IconFileUpload from './Icons/IconFileUpload'
import { COLORS } from '../styleClasses/constants'


interface SelectFileProps {
    reqFileValidaton: (path: string) => void;
    receiveValidatonResults: (callback: (event: Electron.IpcMainEvent, args: Array<any>) => void) => void;
    setFilePath: (path: string) => void,
    filePath: string,
}

const SelectFileStyle = {
    bg: "#211f44",
    borderRadius: '20px',
    border: '2px dashed',
    borderColor: COLORS.borderColor,
    minH: "80px",
    minW: "422px",
    _hover: {
        bg: "hsl(243, 38%, 25%)",
        borderColor: "#5581E7",
    }
}


const SelectFile: React.FC<SelectFileProps> = (props) => {

    const selectFilePath = () => {
        window.api.receiveSelectedFilePath((event: Electron.IpcMainEvent, path: string) => {
            props.receiveValidatonResults((event: Electron.IpcMainEvent, result: Array<any>) => {
                const isValid = result[0]
                const errors = result[1]
                if (isValid) {
                    props.setFilePath(path)
                }
                else {
                    console.error("Could not validate your file with path:" + path)
                    console.error(...errors)
                }
            })
            props.reqFileValidaton(path)
            console.log(path)
        })
        window.api.reqSelectFilePath();
    }

    return (
        <>
            {!props.filePath && (
                <Box sx={SelectFileStyle} onClick={selectFilePath}>
                    <Center>
                        <VStack mt="20px" mb="20px"
                            spacing={1}
                        >
                            <IconFileUpload />
                            <Text color="#5581E7">Click to Select File</Text>
                        </VStack>
                    </Center>
                </Box>
            )
            }
            {
                props.filePath && (
                    <Center>
                        <Flex
                            gap="20px"
                            padding="20px"
                            justify={'center'}
                            align={'center'}
                            background={'#474276'}
                            borderRadius="xl"
                            height={'56px'}
                            width="422px"
                        >
                            <IconFile boxSize="8" />
                            <Text sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} flex="auto" color={'#FFF'} overflow="hidden">
                                {props.filePath.split("/").pop()}
                            </Text>
                            <IconTrash
                                onClick={() => {
                                    props.setFilePath("")
                                }}
                            />
                        </Flex>
                    </Center>
                )
            }
        </>
    )
}


export default SelectFile
