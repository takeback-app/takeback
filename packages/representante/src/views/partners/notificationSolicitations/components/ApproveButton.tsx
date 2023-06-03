import React, { useState } from 'react'

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
import { approveNotificationSolicitation } from '../services/api'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'
import { useNavigate } from 'react-router'

interface ApproveButtonProps {
  id: string
}

export function ApproveButton({ id }: ApproveButtonProps) {
  const navigateTo = useNavigate()

  const toast = useToast(chakraToastConfig)

  const [isLoading, setIsLoading] = useState(false)

  const cancelRef = React.useRef(null)

  const { isOpen, onClose, onOpen } = useDisclosure()

  async function handleApprove() {
    setIsLoading(true)

    const [isOk, response] = await approveNotificationSolicitation(id)

    if (!isOk) {
      return toast({
        title: 'Erro ao aprovar solicitação',
        description: response.message,
        status: 'error'
      })
    }

    setIsLoading(false)
    onClose()
    navigateTo(-1)
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Aprovar
      </Button>
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
              Tem certeza que deseja aprovar esse solicitação?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="green"
                isLoading={isLoading}
                onClick={handleApprove}
                ml={3}
              >
                Aprovar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
