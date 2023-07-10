import React from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text
} from '@chakra-ui/react'

import { AxiosError } from 'axios'
import { API } from '../../services/API'

interface ChargebackModalButtonProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function ChargebackModalButton({
  isOpen,
  onClose,
  onSubmit
}: ChargebackModalButtonProps) {
  const cancelRef = React.useRef(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Estornar pagamento?
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              Tem certeza que deseja estornar o pagamento? Essa ação não poderá
              ser desfeita.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="orange" onClick={onSubmit} ml={3}>
              Estornar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export async function chargebackTransaction(id: number) {
  try {
    const { data } = await API.post(`/company/transactions/${id}/chargeback`)

    return [true, data]
  } catch (err) {
    const error = err as AxiosError

    return [
      false,
      { message: error.response?.data.message || 'Contate um administrador' }
    ]
  }
}
