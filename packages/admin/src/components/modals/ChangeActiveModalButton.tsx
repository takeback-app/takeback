import React from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { IoBan, IoCheckmarkCircle, IoKey } from 'react-icons/io5'
import { chakraToastConfig } from '../../styles/chakraToastConfig'
import {
  activateRepresentative,
  deactivateRepresentative
} from '../../views/partners/representatives/services/api'
import { useNavigate } from 'react-router'

interface RecoverPasswordModalButtonProps {
  representativeId: string
  isActive: boolean
}

export function ChangeActiveModalButton({
  representativeId,
  isActive
}: RecoverPasswordModalButtonProps) {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  const navigateTo = useNavigate()

  async function handleSubmit() {
    const apiCall = isActive ? deactivateRepresentative : activateRepresentative

    const [isOk, response] = await apiCall(representativeId)

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

    navigateTo(-1)

    onClose()
  }

  return (
    <>
      <Button
        colorScheme={isActive ? 'red' : 'blue'}
        onClick={onOpen}
        leftIcon={isActive ? <IoBan /> : <IoCheckmarkCircle />}
      >
        {isActive ? 'Desativar' : 'Ativar'}
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isActive ? 'Desativar' : 'Ativar'} Representante
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Tem certeza que deseja {isActive ? 'desativar' : 'ativar'} o
                representante? Essa ação não poderá ser desfeita.
              </Text>
              <br />
              <Text>
                {isActive &&
                  'Ao desativar o representante, ele perderá todos os vínculos com as empresas, e caso seja necessário, deverá ser vinculado novamente.'}
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme={isActive ? 'red' : 'blue'}
                onClick={handleSubmit}
                ml={3}
              >
                {isActive ? 'Desativar' : 'Ativar'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
