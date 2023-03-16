import React, { useState } from 'react'
import { Flex, Text, Box, Center, VStack } from '@chakra-ui/react'
import { IconFile, IconTrash, IconFileUpload, IconError } from './Icons'
import { COLORS } from '../styleClasses/constants'


interface SelectFileProps {
    fileName: string;
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
    const [fileValidationError, setFileValidationError] = useState<Boolean>(false)
    const selectFilePath = () => {
        window.fileSystemApi.receiveSelectedFilePath((event: Electron.IpcMainEvent, path: string) => {
            // dont do anything if the path is empty
            if (path === '') return
            // Subscribe to listen to results of file validation
            props.receiveValidatonResults((event: Electron.IpcMainEvent, result: Array<any>) => {
                const isValid = result[0]
                const errors = result[1]
                if (isValid) {
                    setFileValidationError(false)
                    props.setFilePath(path)

                }
                else {
                    setFileValidationError(true)
                    console.error(`Could not validate selected file as a : ${props.fileName} file.`)
                    console.error(`Selected File Path: ${path}`)
                    console.error(...errors)
                }
            })
            // Request Validation of file 
            props.reqFileValidaton(path)
            console.log(path)
        })
        window.fileSystemApi.reqSelectFilePath();
    }

    return (
        <>
            <VStack mt="20px" mb="20px"
                spacing={1}
            >
                {
                    !props.filePath && (
                        <>
                            <Center>
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
                            </Center>
                        </>
                    )
                }
                {
                    fileValidationError && (
                        <Center>
                            <IconError boxSize='3' />
                            <Text fontSize="12px" ml="5px" color="red.warning">Invalid {props.fileName}.json file: Please select a valid {props.fileName}.json file to continue.</Text>
                        </Center>
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
            </VStack>
        </>
    )
}


export default SelectFile
