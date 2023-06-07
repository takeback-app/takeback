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
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { IoTrashOutline } from 'react-icons/io5'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { deleteRepresentativeUser } from '../services/api'
import { mutate } from 'swr'

interface Props {
  userId: string
}

export function ConfirmDeleteModalButton({ userId }: Props) {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  async function handleSubmit() {
    const [isOk, response] = await deleteRepresentativeUser(userId)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    toast({
      title: 'Sucesso',
      description: response.message,
      status: 'success'
    })

    await mutate('/representative/consultants')
  }

  return (
    <>
      <IconButton
        size={'sm'}
        colorScheme="red"
        onClick={onOpen}
        icon={<IoTrashOutline />}
        aria-label="Deletar"
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar consultor
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Tem certeza que deseja deletar este consultor? Essa ação não
                poderá ser desfeita.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme={'red'} onClick={handleSubmit} ml={3}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
