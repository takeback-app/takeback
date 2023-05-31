import React from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  IconButtonProps,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import { IoTrash } from 'react-icons/io5'

interface DeleteButtonProps extends IconButtonProps {
  handleDelete: () => void
}

export function DeleteButton({
  isDisabled,
  handleDelete,
  ...rest
}: DeleteButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  function onDelete() {
    handleDelete()
    onClose()
  }

  return (
    <>
      <Tooltip isDisabled={isDisabled} label="Deletar">
        <IconButton
          size="sm"
          icon={<IoTrash />}
          isDisabled={isDisabled}
          onClick={onOpen}
          {...rest}
        />
      </Tooltip>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Apagar solicitação
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja apagar essa solicitação? Essa ação não pode
              ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={onDelete} ml={3}>
                Apagar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
