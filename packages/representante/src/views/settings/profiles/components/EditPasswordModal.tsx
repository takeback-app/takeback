import React, { useContext } from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChakraPasswordInput } from '../../../../components/chakra/ChakraPasswordInput'
import { updateUserPassword } from '../../../../services/requests'
import { chakraToastConfig } from '../../../../styles/chakraToastConfig'
import { AuthContext } from '../../../../contexts/AuthContext'

const schema = z
  .object({
    password: z
      .string()
      .nonempty({ message: 'Campo não pode estar em branco' }),
    newPassword: z
      .string()
      .nonempty({ message: 'Campo não pode estar em branco' }),
    confirmNewPassword: z
      .string()
      .nonempty({ message: 'Campo não pode estar em branco' })
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Senhas não conferem',
    path: ['confirmNewPassword']
  })

export type EditPasswordData = z.infer<typeof schema>

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EditPasswordModal({ isOpen, onClose }: AddItemModalProps) {
  const toast = useToast(chakraToastConfig)
  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const { setIsSignedIn } = useContext(AuthContext)

  const { formState, register, handleSubmit, reset } =
    useForm<EditPasswordData>({
      resolver: zodResolver(schema)
    })

  function handleLogout() {
    setIsSignedIn(false)
    localStorage.clear()
    sessionStorage.clear()
  }

  async function onSubmit({ password, newPassword }: EditPasswordData) {
    const [isOk, response] = await updateUserPassword(password, newPassword)

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

    handleLogout()
  }

  function handleCloseModal() {
    reset()
    onClose()
  }

  return (
    <Modal
      size="2xl"
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={handleCloseModal}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar senha</ModalHeader>
        <ModalCloseButton />
        <form style={{ marginBottom: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <Stack>
              <ChakraPasswordInput
                label="Senha atual"
                size="sm"
                isRequired
                {...register('password')}
                error={formState.errors.password?.message}
              />
              <ChakraPasswordInput
                label="Nova senha"
                size="sm"
                isRequired
                {...register('newPassword')}
                error={formState.errors.newPassword?.message}
              />
              <ChakraPasswordInput
                label="Confirmar senha"
                size="sm"
                isRequired
                {...register('confirmNewPassword')}
                error={formState.errors.confirmNewPassword?.message}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" type="submit" mr={3}>
              Editar
            </Button>
            <Button onClick={handleCloseModal}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
