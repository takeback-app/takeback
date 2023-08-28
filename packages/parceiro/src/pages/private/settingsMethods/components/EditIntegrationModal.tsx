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
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { chakraToastOptions } from '../../../../components/ui/toast'
import { ChakraSelect } from '../../cashRegister/components/ChakraSelect'
import { CompanyPaymentMethod } from '../index'
import { editCompanyPaymentMethodTPag } from '../services/api'

const schema = z.object({
  tPag: z.string()
})

export type PaymentMethodData = z.infer<typeof schema>

interface EditIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onEdited?: () => void
  companyPaymentMethod: CompanyPaymentMethod
}

const payments = [
  { text: '01 - Dinheiro', value: '1' },
  { text: '02 - Cheque', value: '2' },
  { text: '03 - Cartão de Crédito', value: '3' },
  { text: '04 - Cartão de Débito', value: '4' },
  { text: '05 - Crédito Loja', value: '5' },
  { text: '10 - Vale Alimentação', value: '10' },
  { text: '11 - Vale Refeição', value: '11' },
  { text: '12 - Vale Presente', value: '12' },
  { text: '13 - Vale Combustível', value: '13' },
  { text: '15 - Boleto Bancário', value: '15' },
  { text: '16 - Depósito Bancário', value: '16' },
  { text: '17 - Pix', value: '17' },
  { text: '18 - Transferência bancária, Carteira Digital', value: '18' },
  {
    text: '19 - Programa de fidelidade, Cashback, Crédito Virtual',
    value: '19'
  },
  { text: '90 - Sem pagamento', value: '90' },
  { text: '99 - Outros', value: '99' }
]

export function EditIntegrationModal({
  isOpen,
  onClose,
  onEdited,
  companyPaymentMethod
}: EditIntegrationModalProps) {
  const toast = useToast(chakraToastOptions)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<PaymentMethodData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: PaymentMethodData) {
    const tPag = Number(data.tPag)

    const [isOk, response] = await editCompanyPaymentMethodTPag(
      companyPaymentMethod.id,
      { tPag }
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
    setValue('tPag', String(companyPaymentMethod.tPag))
  }, [companyPaymentMethod, setValue])

  function handleClose() {
    setValue('tPag', String(companyPaymentMethod.tPag))

    onClose()
  }

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Equivalência na integração</ModalHeader>
        <ModalCloseButton />
        <form style={{ margin: 0 }} onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <SimpleGrid columns={1} gap={8}>
              <ChakraSelect
                label="Forma de Pagamento"
                size="sm"
                error={errors.tPag?.message}
                {...register('tPag')}
                options={payments}
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
              Salvar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
