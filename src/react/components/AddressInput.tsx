import { FC, useState, useEffect } from "react"
import {
  InputGroup,
  Input,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { COLORS } from "../styleClasses/constants"

interface AddressInputProps {
  isAddressValid: boolean
  setIsAddressValid: (valid: boolean) => void
  shouldDoValidation: boolean
  registerText: string
}

const AddressInput: FC<AddressInputProps> = (props) => {
  const [addressResults, setAddressResults] = useState([])
  const { register, watch } = useFormContext()

  const fieldVal = watch(props.registerText)

  useEffect(() => {

    if (!fieldVal) return

    const tests = [
      {
        passed: /^0x[a-fA-F0-9]{40}$/.test(fieldVal),
        message: "Address not a valid ETH address",
      },
    ]
    setAddressResults(tests)
    props.setIsAddressValid(tests.every((test) => test.passed))
    
  }, [fieldVal])


  return (
    <>
      <>
        <InputGroup>
          <Input
            isRequired={true}
            isInvalid={
              props.shouldDoValidation &&
              !props.isAddressValid &&
              fieldVal?.length > 1
            }
            borderColor={
              props.shouldDoValidation && props.isAddressValid
                ? "green.main"
                : COLORS.lightPurple
            }
            errorBorderColor="red.warning"
            focusBorderColor={
              props.shouldDoValidation && props.isAddressValid
                ? "green.main"
                : "blue.secondary"
            }
            color="white"
            placeholder="Enter Wallet Address"
            type={"text"}
            {...register(props.registerText)}
          />
        </InputGroup>
      </>
      {props.shouldDoValidation && (
        <UnorderedList>
          {addressResults.map(
            (addressResult, index) =>
              !addressResult.passed && (
                <ListItem key={index} fontSize="12px" color="red.warning">
                  {addressResult.message}
                </ListItem>
              )
          )}
        </UnorderedList>
      )}
    </>
  )
}

export default AddressInput
