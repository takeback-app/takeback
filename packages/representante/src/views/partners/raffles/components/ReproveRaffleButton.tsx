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

interface ReproveRaffleButtonProps extends ButtonProps {
  onReprove: () => void
}

export function ReproveRaffleButton({
  onReprove,
  ...rest
}: ReproveRaffleButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  function handleReprove() {
    onReprove()
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
        Reprovar
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reprovar sorteio
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja reprovar esse sorteio?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleReprove} ml={3}>
                Reprovar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
