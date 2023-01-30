import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import IconFile from './Icons/IconFile';
import IconTrash from './Icons/IconTrash';
import IconUpload from './Icons/IconUpload';

// interface UploadFileProps {
//     notifyFileChange: (numberOfFiles: number) => void
// }

const baseStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    border: '1px dashed #474276',
    borderRadius: '12px',
    borderColor: '#474276',
    borderStyle: 'dashed',
    background: 'rgba(25, 22, 59, 0.4)',
    color: '#5581E7',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const UploadFile = (props) => {
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles
    } = useDropzone({ accept: { 'application/json': [] } });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const hasUploaded = acceptedFiles.length > 0

    useEffect(() => {
        if(acceptedFiles.length > 0) {
            props.notifyFileChange(acceptedFiles.length)
        }
    }, [acceptedFiles.length, props])

    return (
        <>
            {!hasUploaded && (
                <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <Flex direction={'column'} justify={'center'} align={'center'}>
                        <IconUpload height={'20px'} width={'20px'} bg='rgba(0, 0, 0, 0.0)' color={'rgba(0, 0, 0, 0.0)'} />
                        <p>Drag and drop or click to upload</p>
                    </Flex>
                </div>
            )}
            {hasUploaded && (
                <div>
                {/* <IconFile key={index} /> */}
                {/* <Flex gap='20px' padding='20px' justify={'center'} align={'center'} background={'#474276'} borderRadius='xl' height={'56px'}> */}
                {/* <IconTrash /> */}
                {acceptedFiles.map((x, index) => 
                    <Text key={index} flex='auto' color={'#FFF'}>{acceptedFiles[index].name}</Text>
                )
                }
                {/* </Flex> */}
                </div>
            )}
        </>
    );
}

export default UploadFile