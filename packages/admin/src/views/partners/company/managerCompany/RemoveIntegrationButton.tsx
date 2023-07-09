import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import React from 'react'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'
import { deleteIntegration } from '../../../../services/integrationApi'

interface Props {
  integrationId: string

  onDeleted?(): void
}

export function RemoveIntegrationButton({ integrationId, onDeleted }: Props) {
  const toast = useToast(chakraToastConfig)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  async function onDelete() {
    if (!integrationId) return

    const [isOk, response] = await deleteIntegration(integrationId)

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

    onDeleted && onDeleted()
  }

  return (
    <>
      <Button colorScheme="gray" onClick={onOpen}>
        Remover
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remover integração
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja remover integração? Essa ação não pode ser
              desfeita, e tirará o acesso do parceiro à integração.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={onDelete} ml={3}>
                Remover
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
