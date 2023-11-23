import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

type AlertDialogProps = {
  header: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const AlertDialog = ({
  header,
  isOpen,
  onCancel,
  onConfirm,
}: AlertDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bgColor="purple.dark" color={"white"}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onCancel} color={"purple.300"}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  );
};
