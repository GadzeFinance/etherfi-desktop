import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { IconSavedFile, IconCheckMark } from './Icons'
import successBoxStyle from '../styleClasses/successBoxStyle';
import path from 'path-browserify';

interface SavedFileBoxProps {
    filePath: string,
}

const SavedFileBox: React.FC<SavedFileBoxProps> = (props: SavedFileBoxProps) => {

    const showFileInFolder = () => {
        if (props.filePath) {
            window.fileSystemApi.reqShowFile(props.filePath);
        }
    }

    return (
        <Box sx={successBoxStyle} bg="#2b2852" height="10px" mt="10px">
            <HStack>
                <IconSavedFile boxSize="8" />
                <Text fontSize='14px' flex="auto" color="white" _hover={{ textDecoration: 'underline' }} onClick={showFileInFolder}>
                    {path.parse(props.filePath).base}
                </Text>
                <IconCheckMark boxSize="5" />
            </HStack>
        </Box>
    )
}


export default SavedFileBox
