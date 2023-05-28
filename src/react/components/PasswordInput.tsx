import { FC, useEffect, useState } from "react"
import {
  Text,
  InputGroup,
  Input,
  InputRightElement,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react"
import { COLORS } from "../styleClasses/constants"
import IconEyeSlash from "./Icons/IconEyeSlash"
import clickableIconStyle from "../styleClasses/clickableIconStyle"
import { useFormContext } from "react-hook-form";
import { useToast } from '@chakra-ui/react'

interface PasswordInputProps {
  isPasswordValid: boolean
  setIsPasswordValid: (valid: boolean) => void
  shouldDoValidation: boolean
  withConfirm?: boolean
  noText?: boolean
  registerText: string
}

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordResults, setPasswordResults] = useState([])
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [confirmPasswordResults, setConfirmPasswordResults] = useState([])

  const toast = useToast()
  const { register, watch } = useFormContext();
  const loginPassword = watch(props.registerText)
  const confirmPassword = watch("confirmPassword")

  const match = () => {
    return loginPassword === confirmPassword && (loginPassword)
  }


  useEffect(() => {

    if (props.withConfirm && confirmPassword) validateConfirmPassword(confirmPassword)
    const tests = [
      {
        passed: loginPassword?.length >= 8,
        message: "password should be at least 8 characters long",
      },
      {
        passed: /[A-Z]/.test(loginPassword),
        message: "password should contain at least one uppercase letter",
      },
      {
        passed: /[a-z]/.test(loginPassword),
        message: "password should contain at least one lowercase letter",
      },
      {
        passed: /[\W_]/.test(loginPassword),
        message: "password should contain at least one special character",
      },
      {
        passed: /\d/.test(loginPassword),
        message: "password should contain at least one number",
      },
      {
        passed: !/\s/.test(loginPassword),
        message: "password should not contain any spaces",
      },
    ]
    if (loginPassword) {
      props.setIsPasswordValid(tests.every((test) => test.passed))
      setPasswordResults(tests)
    }
  }, [loginPassword])


  function validateConfirmPassword(confirmPassword: string) {
    const tests = [
      {
        passed: loginPassword?.length > 0 && loginPassword === confirmPassword,
        message: "The two passwords not match",
      },
    ]
    setConfirmPasswordResults(tests)
  }

  const invalidate = props.shouldDoValidation &&
  !props.isPasswordValid &&
  loginPassword?.length > 1


  return (
    <>
      <>
        { !props.noText && <Text mt="10px" color="white" opacity={"0.7"} fontSize="11px">
          Password*
        </Text> }
        <InputGroup>
          <Input
            isRequired={true}
            isInvalid={invalidate}
            borderColor={
              props.shouldDoValidation && props.isPasswordValid
                ? "green.main"
                : COLORS.lightPurple
            }
            errorBorderColor="red.warning"
            focusBorderColor={
              props.shouldDoValidation && props.isPasswordValid
                ? "green.main"
                : "blue.secondary"
            }
            color="white"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
            value={loginPassword}
            {...register(props.registerText)} 
          />

          <InputRightElement width="4.5rem">
            <IconEyeSlash
              sx={clickableIconStyle}
              boxSize={6}
              onClick={() => {
                setShowPassword(!showPassword)
              }}
            />
          </InputRightElement>
        </InputGroup>
        { props.withConfirm && !props.noText && <Text mt="10px" color="white" opacity={"0.7"} fontSize="11px">
          Confirm Password*
        </Text> }
        { props.withConfirm && <InputGroup>
          <Input
            isRequired={true}
            borderColor={
              match()
              ? "green.main"
              : COLORS.lightPurple
            }
            focusBorderColor={
              match()
                ? "green.main"
                : "blue.secondary"
            }
            color="white"
            placeholder="Confirm the password"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")} 
          />

          <InputRightElement width="4.5rem">
            <IconEyeSlash
              sx={clickableIconStyle}
              boxSize={6}
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword)
              }}
            />
          </InputRightElement>
        </InputGroup>}
      </>
      {props.shouldDoValidation && (
        <UnorderedList>
          {passwordResults.map(
            (passwordRequirement, index) =>
              !passwordRequirement.passed && (
                <ListItem key={index} fontSize="12px" color="red.warning">
                  {passwordRequirement.message}
                </ListItem>
              )
          )}
        </UnorderedList>
      )}
      { props.withConfirm && <UnorderedList>
        {confirmPasswordResults.map(
          (confirmPasswordRequirement, index) =>
            !confirmPasswordRequirement.passed && (
              <ListItem key={index} fontSize="12px" color="red.warning">
                {confirmPasswordRequirement.message}
              </ListItem>
            )
        )}
      </UnorderedList>
      }
    </>
  )
}

export default PasswordInput
