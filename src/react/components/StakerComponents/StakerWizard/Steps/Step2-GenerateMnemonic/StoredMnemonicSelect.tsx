import { useEffect, useState } from "react";
import {
    Text,
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface StoredMnemonicSelectProps {
    setStoredMnemonic: (mnemonic: object) => void;
    storedMnemonics: Array<object>;
    goNextStep: () => void;
    setMnemonic: (mnemonic: string) => void;
    setPassword: (password: string) => void;
}

const StoredMnemonicSelect: React.FC<StoredMnemonicSelectProps> = (props: StoredMnemonicSelectProps) => {
    const [showMnemonic, setShowMnemonic] = useState(false);

    useEffect(() => {
        window.encryptionApi.recieveStoredAccount(
          (
            event: Electron.IpcMainEvent,
            result: number,
            mnemonic: any,
            errorMessage: string
          ) => {
            if (result === 0) {
                const outputArr = Object.entries(JSON.parse(mnemonic)).map(
                    ([id, value]: [any, any], index) => ({
                        id: parseInt(id),
                        text: id,
                        mnemonic: value.mnemonic,
                        password: value.password
                    })
                );
                props.setStoredMnemonic(outputArr);
            } else {
                console.error("Error fetching mnemonic");
                console.error(errorMessage);
            }
          }
        );
        window.encryptionApi.reqStoredAccount();
      }, []);

    const shortenMnemonic = (mnemonic: any) => {
        const wordArray = mnemonic.split(" ");
        return `${wordArray.slice(0, 3).join(", ")}...${wordArray
            .slice(-2)
            .join(", ")}`;
    };

    const handleEyeIconClick = (event: any) => {
        event.stopPropagation();
        setShowMnemonic(!showMnemonic);
    };


    const getAndSetPassword = (entry: any, e: React.MouseEvent) => {
        e.stopPropagation();
        props.setMnemonic(entry.mnemonic);
        props.setPassword(entry.password);
    }

    return (
        <Menu>
            <MenuButton
                as={Button}
                rightIcon={<AddIcon />}
                disabled={props.storedMnemonics?.length == 0}
            >
                Use Previously Generated Mnemonic
            </MenuButton>
            <MenuList maxW="80%">
                {props.storedMnemonics?.map((entry: any) => (
                    <MenuItem key={entry.id}>
                        <Button
                            mr={2}
                            variant="outline"
                            onClick={(e) => getAndSetPassword(entry, e)}
                        >
                            <AddIcon />
                        </Button>
                        <Text>Mnemonic {entry.text}</Text>
                        <Box display="flex" alignItems="center" ml="auto">
                            {showMnemonic ? (
                                <>
                                    <Text>
                                        {shortenMnemonic(entry.mnemonic)}
                                    </Text>
                                    <IconButton
                                        ml={2}
                                        icon={<ViewOffIcon />}
                                        variant="ghost"
                                        aria-label="Hide mnemonic"
                                        onClick={handleEyeIconClick}
                                    />
                                </>
                            ) : (
                                <IconButton
                                    ml={2}
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    aria-label="Show mnemonic"
                                    onClick={handleEyeIconClick}
                                />
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default StoredMnemonicSelect;
