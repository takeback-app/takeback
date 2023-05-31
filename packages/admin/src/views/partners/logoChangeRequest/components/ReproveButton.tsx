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
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { IoBan } from 'react-icons/io5'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'
import { reproveLogoRequest } from '../services/api'

interface ReproveButtonProps {
  id: string
  onReprove: () => void
  isDisabled?: boolean
}

export function ReproveButton({
  id,
  onReprove,
  isDisabled
}: ReproveButtonProps) {
  const toast = useToast(chakraToastConfig)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  async function handleReprove() {
    const [isOk, response] = await reproveLogoRequest(id)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    onReprove()

    toast({
      title: 'Sucesso',
      description: response.message,
      status: 'success'
    })

    onClose()
  }

  return (
    <>
      <Tooltip isDisabled={isDisabled} label="Reprovar">
        <IconButton
          size="sm"
          aria-label="reprove"
          colorScheme="red"
          variant="ghost"
          icon={<IoBan />}
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
              Reprovar solicitação
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja reprovar essa solicitação? Essa ação não
              pode ser desfeita.
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
