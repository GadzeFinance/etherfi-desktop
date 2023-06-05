import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react"
import StepSelectStakeInfoPath from "../../../../../src/react/components/StakerComponents/StakerWizard/Steps/Step2-SelectStakeInfoPath/StepSelectStakeInfoPath"

// Mock the window.validateFilesApi and window.databaseApi calls
const mockValidateStakeInfoJson = jest.fn()
const mockReceiveStakeInfoValidationResults = jest.fn()

//@ts-ignore
window.validateFilesApi = {
  validateStakeInfoJson: mockValidateStakeInfoJson,
  receiveStakeInfoValidationResults: mockReceiveStakeInfoValidationResults,
}

const defaultProps = {
  goNextStep: jest.fn(),
  goBackStep: jest.fn(),
  stakeInfoPath: "",
  setStakeInfoPath: jest.fn(),
}

describe("StepSelectStakeInfoPath", () => {
  it("renders the component without errors", () => {
    const { getByText } = render(<StepSelectStakeInfoPath {...defaultProps} />)
    expect(getByText("Upload StakeInfo.json file")).not.toBeNull()
  })

  it("calls goNextStep when the Proceed button is clicked and stakeInfoPath is set", async () => {
    const { getByText } = render(
      <StepSelectStakeInfoPath
        {...defaultProps}
        stakeInfoPath="/path/to/StakeInfo.json"
      />
    )
    const proceedButton = getByText("Proceed")
    fireEvent.click(proceedButton)
    await waitFor(() => expect(defaultProps.goNextStep).toHaveBeenCalled())
  })
})
