import React, { useState } from 'react'

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
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
  Text,
  useToast
} from '@chakra-ui/react'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCashRegisterState } from '../state'
import { formatToBRL } from 'brazilian-values'
import { ChakraInput } from './ChakraInput'
import { sumMethods } from '../utils'
import { checkPassword, generateCashback } from '../service/api'
import { chakraToastOptions } from '../../../../components/ui/toast'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  handleConfirmation: () => Promise<void>
}

const schema = z.object({
  password: z
    .string()
    .nonempty({ message: 'Senha deve ter no mínimo 3 caracteres' })
    .min(3, { message: 'Senha deve ter no mínimo 3 caracteres' }),
  code: z.string().optional()
})

export type ConfirmationModalData = z.infer<typeof schema>

export function ConfirmationModal({
  isOpen,
  onClose,
  handleConfirmation
}: ConfirmationModalProps) {
  const { consumerName, formData, requiresUserCode, resetState } =
    useCashRegisterState()

  const [show, setShow] = useState(false)

  const toast = useToast(chakraToastOptions)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ConfirmationModalData>({ resolver: zodResolver(schema) })

  async function onSubmit({ password, code }: ConfirmationModalData) {
    const [isPasswordOk, passwordData] = await checkPassword(password)

    if (!isPasswordOk) {
      return setError('password', { message: passwordData.message })
    }

    const [isGenerateOk, generateData] = await generateCashback({
      code,
      companyUserPassword: password,
      ...formData
    })

    if (!isGenerateOk) {
      return toast({
        title: 'Houve um erro',
        description: generateData.message,
        status: 'error'
      })
    }

    handleConfirmation()

    reset()

    onClose()

    resetState()

    toast({
      title: 'Sucesso',
      description: 'Compra finalizado com sucesso',
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
          CONFIRMAÇÃO DE COMPRA
        </ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody as={Stack} spacing={8}>
            <Box fontSize="md">
              <Heading mb={2} fontSize="lg">
                Dados da compra
              </Heading>

              <Flex justify="space-between" align="center">
                <Text>Cliente</Text>
                <Text fontWeight="bold">{consumerName}</Text>
              </Flex>

              <Flex justify="space-between" fontSize="md" align="center">
                <Text>Total da compra</Text>
                <Text fontWeight="bold">
                  {formatToBRL(formData.totalAmount)}
                </Text>
              </Flex>

              <Divider h="1px" my={2} />

              <Stack spacing={0.5}>
                {formData.paymentMethods?.map(p => (
                  <Flex
                    fontSize="sm"
                    fontWeight="medium"
                    key={p.id}
                    justify="space-between"
                    align="center"
                  >
                    <Text color="gray.600">{p.description}</Text>
                    <Text>{formatToBRL(p.value)}</Text>
                  </Flex>
                ))}
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold">Total da pago</Text>
                  <Text fontWeight="bold">
                    {formatToBRL(sumMethods(formData.paymentMethods))}
                  </Text>
                </Flex>
              </Stack>

              <Divider h="1px" my={2} />

              <Flex justify="space-between" fontSize="md" align="center">
                <Text fontWeight="semibold">Troco</Text>
                <Text fontWeight="bold">
                  {formatToBRL(formData.backAmount)}
                </Text>
              </Flex>
            </Box>

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

            <ChakraInput
              display={requiresUserCode ? 'block' : 'none'}
              label="Código do usuário (4 dígitos)"
              error={errors.code?.message}
              {...register('code')}
            />
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
