import { useState } from 'react';
import { Input, IconButton, Td, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import { decrypt } from '../../utils/utils';

const PasswordCell = ({ password, dbPassword }: {password: string, dbPassword: string}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState("MMMMMMM0tqWvA$iGT4ap");
  const [loading, setLoading] = useState(false);

  const handleToggleVisibility = async () => {

    const decrypted = await decrypt(password, dbPassword);
    if (!isPasswordVisible) {
      setPasswordValue(decrypted);
    }
    setIsPasswordVisible((prevState) => !prevState);
    
  };

  return (
    <Td>
        <InputGroup>
            <Input
                type={isPasswordVisible ? 'text' : 'password'}
                value={passwordValue}
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
