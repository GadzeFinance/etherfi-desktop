import { useEffect } from "react";
import {
    Text,
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Center,
    Tooltip
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface StoredMnemonicSelectProps {
    setStoredMnemonic: (mnemonic: object) => void;
    storedMnemonics: Array<object>;
    goNextStep: () => void;
    setMnemonic: (mnemonic: string) => void;
    walletAddress: string;
}

const StoredMnemonicSelect: React.FC<StoredMnemonicSelectProps> = (props: StoredMnemonicSelectProps) => {

    const selectMnemonic = (mnemonic: string) => {
        props.setMnemonic(mnemonic);
        props.goNextStep();
    }

    return (
        <Menu>
            <Center>
            <MenuButton
                w="393px !important" mt="12px" mb="16px" pt="23px" pb="23px"
                as={Button}
                rightIcon={<AddIcon />}
                disabled={props.storedMnemonics?.length == 0}
            >
                Use Previously Generated Mnemonic
            </MenuButton>
            <MenuList w="393px !important">
                {props.storedMnemonics?.length === 0 && (<Box>
                    <Text align="center" cursor={"default"}>There is no saved mnemonic.</Text>
                </Box>)}
                {props.storedMnemonics?.length > 0 && props.storedMnemonics?.map((entry: any) => (
                    <MenuItem key={entry.id} onClick={() => selectMnemonic(entry.mnemonic)}>
                        <Box w="100%">
                            <Tooltip label={entry.mnemonic}>
                            <Text isTruncated>{entry.mnemonic}</Text>
                            </Tooltip>
                        </Box>           
                    </MenuItem>
                ))}
            </MenuList>
            </Center>
        </Menu>
    );
};

export default StoredMnemonicSelect;
