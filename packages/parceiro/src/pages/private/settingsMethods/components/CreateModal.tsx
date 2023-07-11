import React from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import useSWR from 'swr'

import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { createCompanyPaymentMethod } from '../services/api'
import { ChakraSelect } from '../../../../components/chakra/ChakraSelect'

const schema = z.object({
  paymentMethodId: z.string(),
  cashbackPercentage: z.string()
})

export type PaymentMethodData = z.infer<typeof schema>

interface CreateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

interface PaymentMethod {
  id: string
  description: string
}

export function CreateModal({ isOpen, onClose, onCreated }: CreateModalProps) {
  const toast = useToast(chakraToastOptions)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError
  } = useForm<PaymentMethodData>({
    resolver: zodResolver(schema)
  })

  const { data: paymentMethods } = useSWR<PaymentMethod[]>(
    '/company/payment-methods/all'
  )

  async function onSubmit(data: PaymentMethodData) {
    const cashbackPercentage = parseFloat(data.cashbackPercentage) / 100

    if (!cashbackPercentage) {
      return setError('cashbackPercentage', { message: 'Valor inválido' })
    }

    const [isOk, response] = await createCompanyPaymentMethod({
      cashbackPercentage,
      paymentMethodId: Number(data.paymentMethodId)
    })

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

    onClose()

    onCreated && onCreated()
  }

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar</ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <SimpleGrid columns={1} gap={8}>
              <ChakraSelect
                label="Método de pagamento"
                size="sm"
                error={errors.paymentMethodId?.message}
                {...register('paymentMethodId')}
                options={
                  paymentMethods?.map(({ id, description }) => ({
                    text: description,
                    value: id
                  })) || []
                }
              />
              <ChakraInput
                label="Porcentagem"
                size="sm"
                error={errors.cashbackPercentage?.message}
                {...register('cashbackPercentage')}
              />
            </SimpleGrid>
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
  )
}
