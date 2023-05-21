import { FC, useState } from "react"
import {
  InputGroup,
  Input,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react"
import { COLORS } from "../styleClasses/constants"

interface AddressInputProps {
  address: string
  setAddress: (address: string) => void
  setDropWalletAddress: (address: string) => void
  isAddressValid: boolean
  setIsAddressValid: (valid: boolean) => void
  shouldDoValidation: boolean
}

const AddressInput: FC<AddressInputProps> = (props) => {
  const [addressResults, setAddressResults] = useState([])

  const updateAddress = (newAddress: string) => {
    validateAddress(newAddress)
    props.setAddress(newAddress)
  }

  function validateAddress(address: string) {
    const tests = [
      {
        passed: /^0x[a-fA-F0-9]{40}$/.test(address),
        message: "Address not a valid ETH address",
      },
    ]
    setAddressResults(tests)
    props.setIsAddressValid(tests.every((test) => test.passed))
  }

  return (
    <>
      <>
        <InputGroup>
          <Input
            isRequired={true}
            isInvalid={
              props.shouldDoValidation &&
              !props.isAddressValid &&
              props.address.length > 1
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
            value={props.address}
            onChange={(e) => {
              updateAddress(e.target.value)
              props.setDropWalletAddress('')
            }}
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
