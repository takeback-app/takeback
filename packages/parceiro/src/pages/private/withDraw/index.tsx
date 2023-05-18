import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import useSWR, { mutate } from 'swr'

import { Layout } from '../../../components/ui/layout'
import { currencyFormat } from '../../../utils/currencyFormat'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Loader from 'react-spinners/PulseLoader'
import { API } from '../../../services/API'

import { AxiosError } from 'axios'
import * as z from 'zod'
import { maskCurrency, unMaskCurrency } from '../../../utils/masks'
import { IoBan } from 'react-icons/io5'
import { chakraToastOptions } from '../../../components/ui/toast'
import { AppTable } from '../../../components/table'

export enum WithdrawStatus {
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
  SOLICITADO = 'Saque solicitado'
}

interface Withdraw {
  id: string
  value: number
  pixKey: string
  status: {
    id: number
    description: WithdrawStatus
  }
  createdAt: string
}

interface WithdrawCreateData {
  moneyValue: string
  pixKey: string
}

const schema = z.object({
  moneyValue: z.string(),
  pixKey: z
    .string()
    .min(5, { message: 'Chave pix deve ter no mínimo 5 caracteres' })
})

const statusColor = {
  Pago: 'green.500',
  Cancelado: 'red.500',
  'Saque solicitado': 'orange.500'
}

export function WithDrawPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast(chakraToastOptions)
  const initialRef = React.useRef<HTMLInputElement | null>(null)

  const [cancelingId, setCancelingId] = useState<string>()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    reset,
    control
  } = useForm<WithdrawCreateData>({
    resolver: zodResolver(schema)
  })

  const { data: withDrawOrders, isLoading } =
    useSWR<Withdraw[]>('company/withdraws')

  async function onSubmit({ pixKey, moneyValue }: WithdrawCreateData) {
    const value = unMaskCurrency(moneyValue)

    if (value < 100) {
      return setError('moneyValue', {
        message: 'Valor mínimo do saque é de R$100,00'
      })
    }

    try {
      await API.post('company/withdraws', { pixKey, value })
      await mutate('company/withdraws')

      onClose()
      reset()

      toast({
        title: 'Sucesso',
        description: 'Saque cadastrado com sucesso.',
        status: 'success'
      })
    } catch (err) {
      const error = err as AxiosError

      setError('moneyValue', {
        message: error.response?.data?.message || 'Contate um administrador'
      })
    }
  }

  async function cancelWithdraw(id: string) {
    setCancelingId(id)
    try {
      const { data } = await API.post<{ message: string }>(
        `company/withdraws/${id}/cancel`
      )

      await mutate('company/withdraws')

      setCancelingId(undefined)

      toast({
        title: 'Sucesso',
        description: data.message,
        status: 'success'
      })
    } catch (err) {
      const error = err as AxiosError

      setCancelingId(undefined)

      toast({
        title: 'Ops :(',
        description:
          error.response?.data?.message || 'Contate um administrador',
        status: 'error'
      })
    }
  }

  if (isLoading || !withDrawOrders) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Saque">
      <Flex px={4} direction="column">
        <Flex pt={4} w="full" justify="flex-end">
          <Button colorScheme="blue" onClick={onOpen}>
            Criar
          </Button>
        </Flex>
        <AppTable
          mt={4}
          dataLength={withDrawOrders.length}
          noDataMessage="Nenhum pedido de saque"
        >
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Valor</Th>
              <Th>Chave Pix</Th>
              <Th isNumeric>Data de criação</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {withDrawOrders?.map(({ createdAt, id, pixKey, status, value }) => (
              <Tr color="gray.500" key={id}>
                <Td fontSize="xs" color={statusColor[status.description]}>
                  {status.description.toUpperCase()}
                </Td>
                <Td fontSize="xs">{currencyFormat(value)}</Td>
                <Td fontSize="xs">{pixKey}</Td>
                <Td fontSize="xs" isNumeric>
                  {new Date(createdAt).toLocaleDateString()}
                </Td>
                <Td isNumeric>
                  <Tooltip
                    isDisabled={
                      status.description !== WithdrawStatus.SOLICITADO
                    }
                    label="Cancelar"
                  >
                    <IconButton
                      size="sm"
                      aria-label="cancel"
                      icon={<IoBan />}
                      isLoading={cancelingId === id}
                      isDisabled={
                        status.description !== WithdrawStatus.SOLICITADO
                      }
                      onClick={() => cancelWithdraw(id)}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Flex>

      <Modal
        size="2xl"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar pedido de saque</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              <FormControl isInvalid={!!errors.moneyValue}>
                <FormLabel htmlFor="value">Valor</FormLabel>

                <Controller
                  name="moneyValue"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        ref={e => {
                          field.ref(e)
                          initialRef.current = e
                        }}
                        onChange={e =>
                          field.onChange(maskCurrency(e.target.value))
                        }
                        variant="flushed"
                        placeholder="Valor"
                      />
                    )
                  }}
                />
                {errors.moneyValue ? (
                  <FormErrorMessage>
                    {errors.moneyValue.message}
                  </FormErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isInvalid={!!errors.pixKey} mt={4}>
                <FormLabel htmlFor="pixKey">Chave Pix</FormLabel>
                <Input
                  {...register('pixKey')}
                  placeholder="Chave Pix"
                  variant="flushed"
                />
                {errors.pixKey ? (
                  <FormErrorMessage>{errors.pixKey.message}</FormErrorMessage>
                ) : null}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isSubmitting}
                mr={3}
              >
                Criar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
