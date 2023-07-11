import React from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Text,
  useToast
} from '@chakra-ui/react'
import { CompanyPaymentMethod } from '../index'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { deleteCompanyPaymentMethod } from '../services/api'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  companyPaymentMethod: CompanyPaymentMethod
  onDeleted?: () => void
}

export function DeleteModal({
  isOpen,
  onClose,
  companyPaymentMethod,
  onDeleted
}: DeleteModalProps) {
  const toast = useToast(chakraToastOptions)
  const cancelRef = React.useRef(null)

  async function onSubmit() {
    const [isOk, response] = await deleteCompanyPaymentMethod(
      companyPaymentMethod.id
    )

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

    onClose()

    onDeleted && onDeleted()
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Remover método de pagamento?
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              Tem certeza que deseja remover? Essa ação não poderá ser desfeita.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <ButtonGroup>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={() => onSubmit()}>
                Remover
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
