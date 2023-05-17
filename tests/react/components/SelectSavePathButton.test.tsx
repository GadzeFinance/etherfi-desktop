/**
 * @jest-environment jsdom
 */

import { fireEvent, render } from "@testing-library/react"
import SelectSavePathButton from "../../../src/react/components/SelectSavePathButton"

// Mock implementation of window.fileSystemApi
const mockFileSystemApi = {
  reqSelectFolderPath: jest.fn(),
  receiveSelectedFolderPath: jest.fn(),
}

describe("SelectSavePathButton", () => {
  beforeEach(() => {
    // Replace window.fileSystemApi with the mock implementation
    window.fileSystemApi = mockFileSystemApi
  })

  afterEach(() => {
    // Restore the original window.fileSystemApi after each test
    window.fileSystemApi = undefined
  })

  test("calls reqSelectFolderPath when clicked", () => {
    const setSavePath = jest.fn()
    const { getByText } = render(
      <SelectSavePathButton setSavePath={setSavePath} savePath="" />
    )
    fireEvent.click(getByText("Select Save Path"))
    expect(mockFileSystemApi.reqSelectFolderPath).toHaveBeenCalled()
  })
})
