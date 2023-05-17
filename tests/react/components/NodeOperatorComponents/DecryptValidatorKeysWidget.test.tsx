import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import DecryptValidatorKeysWidget from "../../../../src/react/components/NodeOperatorComponents/DecryptValidatorKeysWidget"

// Mock the Electron APIs
jest.mock("electron", () => ({
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
    removeAllListeners: jest.fn(),
  },
  remote: {
    dialog: {
      showOpenDialogSync: jest.fn(),
      showSaveDialogSync: jest.fn(),
    },
  },
}))

// jest.mock("react", () => {
//   const originalReact = jest.requireActual("react")
//   return {
//     ...originalReact,
//   }
// })

// Mock the window.validateFilesApi
Object.defineProperty(window, "validateFilesApi", {
  value: {
    validateEncryptedValidatorKeysJson: jest.fn(),
    receiveEncryptedValidatorKeysValidationResults: jest.fn(),
    validateNodeOperatorPrivateKeystoreJson: jest.fn(),
    receiveNodeOperatorPrivateKeystoreValidationResults: jest.fn(),
  },
  writable: true,
})

describe("DecryptValidatorKeysWidget", () => {
  beforeEach(() => {
    //@ts-ignore
    window.fileSystemApi = {
      receiveSelectedFolderPath: jest.fn(),
      reqSelectFolderPath: jest.fn(),
      reqOpenFolder: jest.fn(),
      // Add any other required functions
    }
  })

  it("renders the component", () => {
    render(<DecryptValidatorKeysWidget />)

    const titleLabel = screen.getAllByText("Decrypt Validator Keys")
    expect(titleLabel).not.toBeNull()
  })

  it("selects save path when button is clicked", async () => {
    render(<DecryptValidatorKeysWidget />)
    const selectSavePathButton = screen.getByText("Select Save Path")
    fireEvent.click(selectSavePathButton)
  })
})
