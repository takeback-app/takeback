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
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { z } from 'zod'
import { ChakraInput } from '../../../components/inputs/ChakraInput'
import { chakraToastOptions } from '../../../components/ui/toast'
import {
  approveSolicitation,
  reproveSolicitation,
  checkPassword
} from './service/api'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  handleConfirmation: () => void
  isCancelation?: boolean
  selectedIds: string[]
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
  selectedIds,
  isCancelation,
  handleConfirmation
}: ConfirmationModalProps) {
  const [show, setShow] = useState(false)

  const toast = useToast(chakraToastOptions)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ConfirmationModalData>({ resolver: zodResolver(schema) })

  async function onSubmit({ password }: ConfirmationModalData) {
    const [isPasswordOk, passwordData] = await checkPassword(password)

    if (!isPasswordOk) {
      return setError('password', { message: passwordData.message })
    }

    const apiCall = isCancelation ? reproveSolicitation : approveSolicitation

    const [isOk, approveOrReproveData] = await apiCall({
      cancellationDescription: 'Cancelado',
      companyUserPassword: password,
      solicitationsId: selectedIds
    })

    if (!isOk) {
      return toast({
        title: 'Houve um erro',
        description: approveOrReproveData.message,
        status: 'error'
      })
    }

    reset()

    handleConfirmation()

    onClose()

    toast({
      title: 'Sucesso',
      description: 'Finalizado com sucesso',
      status: 'success'
    })
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
          {isCancelation ? 'CANCELAMENTO' : 'APROVAÇÃO'}
        </ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody as={Stack} spacing={8}>
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
            <Button isDisabled={isSubmitting} onClick={onClose}>
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
