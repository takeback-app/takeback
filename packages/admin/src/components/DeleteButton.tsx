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
  title: string
  body: React.ReactNode
}

export function DeleteButton({
  isDisabled = false,
  handleDelete,
  title,
  body,
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
      <Tooltip isDisabled={isDisabled} label="Apagar">
        <IconButton
          {...rest}
          size="sm"
          icon={<IoTrash />}
          isDisabled={isDisabled}
          onClick={onOpen}
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
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

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
