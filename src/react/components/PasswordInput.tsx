import { FC, useState } from "react"
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
import { isContext } from "vm"

interface PasswordInputProps {
  password: string
  setPassword: (password: string) => void
  isPasswordValid: boolean
  setIsPasswordValid: (valid: boolean) => void
  shouldDoValidation: boolean
  withConfirm?: boolean
  isConfirmed?: boolean
  setIsConfirmed?: (password: boolean) => void
  noText?: boolean
}

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordResults, setPasswordResults] = useState([])
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [confirmPasswordResults, setConfirmPasswordResults] = useState([])

  const updatePassword = (newPassword: string) => {
    validatePassword(newPassword)
    props.setPassword(newPassword)
    validateConfirmPassword(confirmPassword)
  }

  const matched = () => (props.password.length !== 0 && props.password === confirmPassword)

  const updateConfirmPassword = (newInput: string) => {
    validateConfirmPassword(newInput)
    props.setIsConfirmed(matched())
    console.log("isConfirmed:", props.isConfirmed)
    setConfirmPassword(newInput)
  }

  function validatePassword(password: string) {
    const tests = [
      {
        passed: password.length >= 8,
        message: "password should be at least 8 characters long",
      },
      {
        passed: /[A-Z]/.test(password),
        message: "password should contain at least one uppercase letter",
      },
      {
        passed: /[a-z]/.test(password),
        message: "password should contain at least one lowercase letter",
      },
      {
        passed: /[\W_]/.test(password),
        message: "password should contain at least one special character",
      },
      {
        passed: /\d/.test(password),
        message: "password should contain at least one number",
      },
      {
        passed: !/\s/.test(password),
        message: "password should not contain any spaces",
      },
    ]
    setPasswordResults(tests)
    props.setIsPasswordValid(tests.every((test) => test.passed))
  }

  function validateConfirmPassword(confirmPassword: string) {
    console.log("validateConfirmPassword:", props.password, confirmPassword)
    const tests = [
      {
        passed: props.password.length > 0 && props.password === confirmPassword,
        message: "The two passwords not match",
      },
    ]
    setConfirmPasswordResults(tests)
    props.setIsConfirmed(tests.every((test) => test.passed))
  }

  return (
    <>
      <>
        { !props.noText && <Text mt="10px" color="white" opacity={"0.7"} fontSize="11px">
          Password*
        </Text> }
        <InputGroup>
          <Input
            isRequired={true}
            isInvalid={
              props.shouldDoValidation &&
              !props.isPasswordValid &&
              props.password.length > 1
            }
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
            value={props.password}
            onChange={(e) => {
              updatePassword(e.target.value)
            }}
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
            // isInvalid={
            //   matched()
            // }
            borderColor={
              props.isConfirmed
                ? "green.main"
                : COLORS.lightPurple
            }
            errorBorderColor="red.warning"
            focusBorderColor={
              props.isConfirmed
                ? "green.main"
                : "blue.secondary"
            }
            color="white"
            placeholder="Confirm the password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              updateConfirmPassword(e.target.value)
            }}
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
