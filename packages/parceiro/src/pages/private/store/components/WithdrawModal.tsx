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
import { checkPassword, withdrawlProduct } from '../service/api'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { StoreOrderResponse } from '../StoreOrders'

interface ConfirmationModalProps {
  isOpen: boolean
  storeOrder: StoreOrderResponse
  onClose: () => void
  handleConfirmation: () => Promise<void>
}

const schema = z.object({
  password: z
    .string()
    .nonempty({ message: 'Senha deve ter no mínimo 3 caracteres' })
    .min(3, { message: 'Senha deve ter no mínimo 3 caracteres' })
})

export type ConfirmationModalData = z.infer<typeof schema>

export function WithdrawModal({
  isOpen,
  storeOrder,
  onClose,
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

    const [isGenerateOk, generateData] = await withdrawlProduct({
      id: storeOrder?.id,
      validationCode: storeOrder?.validationCode,
      companyUserPassword: password
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

    toast({
      title: 'Sucesso',
      description: 'Retirada finalizado com sucesso',
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
          CONFIRMAÇÃO DE RETIRADA
        </ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody as={Stack} spacing={8}>
            <Box fontSize="md">
              <Heading mb={5} fontSize="lg">
                Dados do produto
              </Heading>

              <Flex justify="space-between" align="center" fontSize={'sm'}>
                <Text fontWeight="semibold">Cliente</Text>
                <Text fontWeight="bold">{storeOrder.consumer.fullName}</Text>
              </Flex>

              <Divider h="1px" my={2} />

              <Flex justify="space-between" align="center" fontSize={'sm'}>
                <Text fontWeight="semibold">Quantidade</Text>
                <Text fontWeight="bold">{storeOrder.quantity}</Text>
              </Flex>

              <Divider h="1px" my={2} />

              <Flex justify="space-between" align="center" fontSize={'sm'}>
                <Text fontWeight="semibold">Produto</Text>
                <Text fontWeight="bold">{storeOrder.storeProduct.name}</Text>
              </Flex>

              <Divider h="1px" my={2} />

              <Flex justify="space-between" align="center" fontSize={'sm'}>
                <Text fontWeight="semibold">Valor</Text>
                <Text fontWeight="bold">
                  {storeOrder.storeProduct.buyPrice}
                </Text>
              </Flex>
              <Divider h="1px" my={2} />
              {storeOrder.wasWithdrawn && (
                <>
                  <Flex justify="space-between" align="center" fontSize={'sm'}>
                    <Text fontWeight="semibold">Data da retirada</Text>
                    <Text fontWeight="bold">
                      {storeOrder.storeProduct.dateLimitWithdrawal}
                    </Text>
                  </Flex>

                  <Divider h="1px" my={2} />
                </>
              )}
              {storeOrder.wasWithdrawn && (
                <>
                  <Flex justify="space-between" align="center" fontSize={'sm'}>
                    <Text fontWeight="semibold">Funcionário</Text>
                    <Text fontWeight="bold">{storeOrder.companyUser.name}</Text>
                  </Flex>
                </>
              )}

              {!storeOrder.wasWithdrawn && (
                <>
                  <Flex justify="space-between" align="center" fontSize={'sm'}>
                    <Text fontWeight="semibold">Retirar até</Text>
                    <Text fontWeight="bold">
                      {storeOrder.storeProduct.dateLimitWithdrawal}
                    </Text>
                  </Flex>
                </>
              )}
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
