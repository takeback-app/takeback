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
import { IoCheckmarkSharp } from 'react-icons/io5'
import { approveLogoRequest } from '../services/api'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'

interface ApproveButtonProps {
  id: string
  onApprove: () => void
  isDisabled?: boolean
}

export function ApproveButton({
  id,
  onApprove,
  isDisabled
}: ApproveButtonProps) {
  const toast = useToast(chakraToastConfig)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  async function handleApprove() {
    const [isOk, response] = await approveLogoRequest(id)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    onApprove()

    toast({
      title: 'Sucesso',
      description: response.message,
      status: 'success'
    })

    onClose()
  }

  return (
    <>
      <Tooltip isDisabled={isDisabled} label="Aprovar">
        <IconButton
          size="sm"
          aria-label="approve"
          colorScheme="green"
          variant="ghost"
          isDisabled={isDisabled}
          icon={<IoCheckmarkSharp />}
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
              Aprovar solicitação
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja aprovar essa solicitação? Essa ação não
              pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="green" onClick={handleApprove} ml={3}>
                Aprovar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
