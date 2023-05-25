import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  useDisclosure
} from '@chakra-ui/react'
import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'

interface CancelRaffleButtonProps extends ButtonProps {
  onCancel: () => void
}

export function CancelRaffleButton({
  onCancel,
  ...rest
}: CancelRaffleButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  function handleCancel() {
    onCancel()
    onClose()
  }

  return (
    <>
      <Button
        leftIcon={<IoCloseSharp size={20} />}
        colorScheme="red"
        onClick={onOpen}
        {...rest}
      >
        Cancelar por inconformidade
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancelar sorteio por inconformidade
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja cancelar esse sorteio?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Voltar
              </Button>
              <Button colorScheme="red" onClick={handleCancel} ml={3}>
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
