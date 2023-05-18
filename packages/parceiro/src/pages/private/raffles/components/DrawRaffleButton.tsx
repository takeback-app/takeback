import React, { useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Progress,
  Stack,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { delay } from '../../../../utils'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { drawRaffle } from '../services/api'

interface DrawRaffleButtonProps {
  id: string
  isHidden: boolean
  onComplete: () => Promise<void>
}

export function DrawRaffleButton({
  id,
  isHidden,
  onComplete
}: DrawRaffleButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    isOpen: isCompleteOpen,
    onClose: onCompleteClose,
    onOpen: onCompleteOpen
  } = useDisclosure()
  const cancelRef = React.useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast(chakraToastOptions)

  async function handleDraw() {
    setIsLoading(true)

    const [isOk, data] = await drawRaffle(id)

    await delay(1000)
    if (!isOk) {
      setIsLoading(false)
      return toast({
        title: 'Ops :(',
        description: data.message,
        status: 'error'
      })
    }

    await onComplete()
    setIsLoading(false)
    onClose()
    onCompleteOpen()
  }

  return (
    <>
      <Button
        leftIcon={<IoCheckmarkSharp size={20} />}
        onClick={onOpen}
        hidden={isHidden}
        colorScheme="green"
      >
        Sortear
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          if (isLoading) return

          onClose()
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Sortear ganhadores
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack spacing={4}>
                <Text>Tem certeza que deseja sortear os ganhadores?</Text>
                <Progress
                  size="xs"
                  isIndeterminate
                  colorScheme="green"
                  hidden={!isLoading}
                />
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                colorScheme="green"
                onClick={handleDraw}
                isDisabled={isLoading}
                ml={3}
              >
                Sortear
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal
        isOpen={isCompleteOpen}
        onClose={onCompleteClose}
        size="2xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <Alert
            rounded="lg"
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <CloseButton
              alignSelf="flex-start"
              position="absolute"
              right={3}
              top={3}
              onClick={onCompleteClose}
            />
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Sorteio realizado com sucesso!
            </AlertTitle>
            <AlertDescription maxWidth="md">
              Contate os ganhadores para realizar a entrega dos prêmios!
            </AlertDescription>
          </Alert>
        </ModalContent>
      </Modal>
    </>
  )
}
