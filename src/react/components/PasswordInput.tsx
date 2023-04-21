import React from 'react'
import { Text, InputGroup, Input, InputRightElement, UnorderedList, ListItem } from '@chakra-ui/react'
import { COLORS } from '../styleClasses/constants'
import IconEyeSlash from './Icons/IconEyeSlash'
import clickableIconStyle from '../styleClasses/clickableIconStyle'


interface PasswordInputProps {
    password: string,
    setPassword: (password: string) => void
    isPasswordValid: boolean,
    setIsPasswordValid: (valid: boolean) => void
    shouldDoValidation: boolean
}


const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [passwordResults, setPasswordResults] = React.useState([])

    const updatePassword = (newPassword: string) => {
        validatePassword(newPassword)
        props.setPassword(newPassword)
    }

    function validatePassword(password: string) {
        const tests = [
            {
                passed: password.length >= 8,
                message: 'password should be at least 8 characters long'
            },
            {
                passed: /[A-Z]/.test(password),
                message: 'password should contain at least one uppercase letter'
            },
            {
                passed: /[a-z]/.test(password),
                message: 'password should contain at least one lowercase letter'
            },
            {
                passed: /[\W_]/.test(password),
                message: 'password should contain at least one special character'
            },
            {
                passed: /\d/.test(password),
                message: 'password should contain at least one number'
            },
            {
                passed: !/\s/.test(password),
                message: 'password should not contain any spaces'
            }
        ];
        setPasswordResults(tests)
        props.setIsPasswordValid(tests.every(test => test.passed))
    }

    return (
        <>
            <>
                <Text mt="10px" color="white" opacity={'0.7'} fontSize="11px">Password*</Text>
                <InputGroup>
                    <Input
                        isRequired={true}
                        isInvalid={props.shouldDoValidation && !props.isPasswordValid && props.password.length > 1}
                        borderColor={props.shouldDoValidation && props.isPasswordValid ? 'green.main' : COLORS.lightPurple}
                        errorBorderColor='red.warning'
                        focusBorderColor={props.shouldDoValidation && props.isPasswordValid ? 'green.main' : 'blue.secondary'}
                        color="white"
                        placeholder='Enter password'
                        type={showPassword ? 'text' : 'password'}
                        value={props.password}
                        onChange={(e) => { updatePassword(e.target.value) }}
                    />

                    <InputRightElement width='4.5rem'>
                        <IconEyeSlash sx={clickableIconStyle} boxSize={6} onClick={() => { setShowPassword(!showPassword) }} />
                    </InputRightElement>
                </InputGroup>
            </>
            {props.shouldDoValidation && (
                <UnorderedList>
                    {passwordResults.map((passwordRequirement, index) =>
                    (!passwordRequirement.passed &&
                        <ListItem key={index} fontSize="12px" color="red.warning">
                            {passwordRequirement.message}
                        </ListItem>
                    ))}
                </UnorderedList>
            )}

        </>
    )
}

export default PasswordInput
