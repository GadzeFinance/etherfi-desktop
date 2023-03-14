import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { IconSavedFile, IconCheckMark } from './Icons'
import successBoxStyle from '../styleClasses/successBoxStyle';


interface SavedFileBoxProps {
    filePath: string,
}

const SavedFileBox: React.FC<SavedFileBoxProps> = (props: SavedFileBoxProps) => {
    return (
        <Box sx={successBoxStyle} bg="#2b2852" height="10px" mt="10px">
            <HStack>
                <IconSavedFile boxSize="8" />
                <Text fontSize='14px' flex="auto" color={'#FFF'}>
                    {props.filePath.split("/").pop()}
                </Text>
                <IconCheckMark boxSize="5" />
            </HStack>
        </Box>
    )
}


export default SavedFileBox
