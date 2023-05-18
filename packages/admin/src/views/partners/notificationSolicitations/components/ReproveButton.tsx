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
import { reproveNotificationSolicitation } from '../services/api'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'
import { useNavigate } from 'react-router'

interface ReproveButtonProps {
  id: string
}

export function ReproveButton({ id }: ReproveButtonProps) {
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastConfig)

  const [isLoading, setIsLoading] = useState(false)

  const cancelRef = React.useRef(null)

  const { isOpen, onClose, onOpen } = useDisclosure()

  async function handleReprove() {
    setIsLoading(true)

    const [isOk, response] = await reproveNotificationSolicitation(id)

    if (!isOk) {
      return toast({
        title: 'Erro ao reprovar solicitação',
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
      <Button onClick={onOpen} colorScheme="red">
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
              Reprovar solicitação
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja reprovar esse solicitação?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                isLoading={isLoading}
                onClick={handleReprove}
                ml={3}
              >
                Reprovar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
