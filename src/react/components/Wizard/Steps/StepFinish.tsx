import React, { useState } from 'react'
import { Button, Flex, Text, Center } from '@chakra-ui/react'
import IconFile from '../../Icons/IconFile'



interface StepFinishProps {
    savePath: string,
}

const StepFinish: React.FC<StepFinishProps> = (props) => {

    const savePath = "/Users/nickykhorasani/Code/etherfi-desktop"
    return (
        // <Flex
        //     padding={'24px'}
        //     direction={'column'}
        //     gap="16px"
        //     bgColor="purple.dark"
        //     height="full"
        //     width={'full'}
        //     borderRadius="lg"
        // >
        //     <Center>
        //         <IconFile boxSize="8" />
        //         <Text sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} flex="auto" color={'#FFF'} overflow="hidden">
        //             {`${savePath.split("/").slice(-2)[0]}/${savePath.split("/").slice(-2)[1]}`}
        //         </Text>
        //     </Center>

        // </Flex>
        <Center>
            <Flex
                gap="20px"
                padding="20px"
                justify={'center'}
                align={'center'}
                background='purple.light'
                borderRadius="xl"
                height={'56px'}
                width="422px"
            >
                <Text>
                    YOUR KEYS WERE SAVED TO THE FOLDER BELOW
                </Text>
                <IconFile boxSize="8" />
                <Text sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} flex="auto" color={'#FFF'} overflow="hidden">
                    {`${savePath.split("/").slice(-2)[0]}/${savePath.split("/").slice(-2)[1]}`}

                </Text>
                {/* <IconTrash
                    onClick={() => {
                        props.setFilePath("")
                    }}
                /> */}
            </Flex>
        </Center>
    )
}

export default StepFinish