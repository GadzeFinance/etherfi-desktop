import { Button } from "@chakra-ui/react"


interface SelectSavePathButtonProps {
    setSavePath: (path: string) => void,
    savePath: string
}


const SelectSavePathButton: React.FC<SelectSavePathButtonProps> = ({ setSavePath, savePath }) => {

    const selectSavePath = () => {
        window.fileSystemApi.receiveSelectedFolderPath((event: Electron.IpcMainEvent, path: string) => {
            setSavePath(path)
        })
        window.fileSystemApi.reqSelectFolderPath();
    }

    return (
        <>
            <Button variant="white-button" onClick={selectSavePath}>{savePath ? "Change Path" : "Select Save Path"}</Button>
        </>

    )
}
export default SelectSavePathButton
