import { useState } from 'react';
import { Input, IconButton, Td, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

const PasswordCell = ({ password }: {password: string}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleToggleVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <Td>
        <InputGroup>
            <Input
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                readOnly
                pr="3rem"
            />
            <InputRightElement>
                <IconButton
                    icon={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={handleToggleVisibility}
                    aria-label="Toggle password visibility"
                    position="absolute"
                    right="0.5rem"
                    top="50%"
                    variant='transparent'
                    transform="translateY(-50%)"
                />
            </InputRightElement>
        </InputGroup>
    </Td>
  );
};

export default PasswordCell;
