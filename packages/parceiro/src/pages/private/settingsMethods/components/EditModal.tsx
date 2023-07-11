import React, { useEffect } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ChakraInput } from '../../../../components/chakra/ChakraInput'
import { ChakraRadio } from '../../../../components/chakra/ChakraRatio'
import { CompanyPaymentMethod } from '../index'
import { chakraToastOptions } from '../../../../components/ui/toast'
import { editCompanyPaymentMethod } from '../services/api'

const schema = z.object({
  cashbackPercentage: z.string(),
  isActive: z.enum(['active', 'inactive'])
})

export type PaymentMethodData = z.infer<typeof schema>

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onEdited?: () => void
  companyPaymentMethod: CompanyPaymentMethod
}

export function EditModal({
  isOpen,
  onClose,
  onEdited,
  companyPaymentMethod
}: EditModalProps) {
  const toast = useToast(chakraToastOptions)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    control,
    setError
  } = useForm<PaymentMethodData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: PaymentMethodData) {
    const cashbackPercentage = parseFloat(data.cashbackPercentage) / 100

    if (!cashbackPercentage) {
      return setError('cashbackPercentage', { message: 'Valor inválido' })
    }

    const [isOk, response] = await editCompanyPaymentMethod(
      companyPaymentMethod.id,
      { cashbackPercentage, isActive: data.isActive }
    )

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

    onEdited && onEdited()
  }

  useEffect(() => {
    setValue(
      'cashbackPercentage',
      (companyPaymentMethod.cashbackPercentage * 100).toFixed(2)
    )
    setValue('isActive', companyPaymentMethod.isActive ? 'active' : 'inactive')
  }, [companyPaymentMethod, setValue])

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar</ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <SimpleGrid columns={1} gap={8}>
              <ChakraInput
                label="Porcentagem"
                size="sm"
                error={errors.cashbackPercentage?.message}
                {...register('cashbackPercentage')}
              />
              <Controller
                control={control}
                name="isActive"
                render={({
                  field: { name, onChange, value },
                  fieldState: { error }
                }) => (
                  <ChakraRadio
                    label="Status"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  >
                    <Radio value="active">Ativo</Radio>
                    <Radio value="inactive">Inativo</Radio>
                  </ChakraRadio>
                )}
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
              Editar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
