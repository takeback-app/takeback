import React, { useState } from 'react'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@chakra-ui/react'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { API } from '../../../../../services/API'
import { AxiosError } from 'axios'
import { ReturnApi } from '../..'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  handleRecognizeSales: () => Promise<void>
}

const schema = z.object({
  password: z
    .string()
    .nonempty({ message: 'Senha deve ter no mínimo 3 caracteres' })
    .min(3, { message: 'Senha deve ter no mínimo 3 caracteres' })
})

export type ConfirmationModalData = z.infer<typeof schema>

export function ConfirmationModal({
  isOpen,
  onClose,
  handleRecognizeSales
}: ConfirmationModalProps) {
  const [show, setShow] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ConfirmationModalData>({ resolver: zodResolver(schema) })

  async function checkPassword(password: string): Promise<ReturnApi> {
    try {
      await API.post('/company/cashback/confirm-password', {
        password
      })

      return [true, { message: '' }]
    } catch (err) {
      const error = err as AxiosError

      const message =
        error.response?.data.message || 'Erro interno. Contate um administrador'

      return [false, { message }]
    }
  }

  async function onSubmit({ password }: ConfirmationModalData) {
    const [isPasswordOk, passwordData] = await checkPassword(password)

    if (!isPasswordOk) {
      return setError('password', { message: passwordData.message })
    }

    handleRecognizeSales()
    reset()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="md">
          CONFIRMAÇÃO DE RECEBIMENTO DE CASHBACK
        </ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody as={Stack} spacing={8}>
            <Text>Digite a senha para receber o cashback.</Text>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel fontSize="xs" fontWeight="semibold" color="gray.600">
                Sua senha
              </FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  variant="flushed"
                  fontSize="sm"
                  size="xs"
                  autoComplete="off"
                  type={show ? 'text' : 'password'}
                  autoFocus
                  {...register('password')}
                />
                <InputRightElement width="2.5rem">
                  <IconButton
                    h="1.75rem"
                    mt={-8}
                    size="sm"
                    aria-label=""
                    icon={show ? <IoEyeOff /> : <IoEye />}
                    onClick={() => setShow(state => !state)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              isDisabled={isSubmitting}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              isLoading={isSubmitting}
              type="submit"
              ml={3}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
