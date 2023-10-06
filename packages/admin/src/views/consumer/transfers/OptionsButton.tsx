import React from 'react'

import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { axiosFetcher } from '../../../services/API'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateTransferConfig } from './services/api'
import { BsFillGearFill } from 'react-icons/bs'
import { maskCurrency, removeComma, unMaskCurrency } from '../../../utils/masks'

const schema = z
  .object({
    depositFeePercentage: z.string().nonempty(),
    depositMaxDailyValue: z.string().nonempty(),
    bankPixFeePercentage: z.string().nonempty()
  })
  .refine(data => !isNaN(removeComma(data.depositFeePercentage)), {
    message: 'Insira um número válido',
    path: ['depositFeePercentage']
  })
  .refine(data => removeComma(data.depositFeePercentage) <= 100, {
    message: 'A porcentagem deve ser menor ou igual a 100',
    path: ['depositFeePercentage']
  })
  .refine(data => removeComma(data.depositFeePercentage) > 0, {
    message: 'A porcentagem deve ser maior ou igual a 0',
    path: ['depositFeePercentage']
  })
  .refine(data => !isNaN(removeComma(data.bankPixFeePercentage)), {
    message: 'Insira um número válido',
    path: ['bankPixFeePercentage']
  })
  .refine(data => removeComma(data.bankPixFeePercentage) <= 100, {
    message: 'A porcentagem deve ser menor ou igual a 100',
    path: ['bankPixFeePercentage']
  })
  .refine(data => removeComma(data.bankPixFeePercentage) > 0, {
    message: 'A porcentagem deve ser maior ou igual a 0',
    path: ['bankPixFeePercentage']
  })

export type FormValues = z.infer<typeof schema>

export function OptionsButton() {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, handleSubmit, formState, setValue } = useForm<FormValues>({
    defaultValues: () =>
      axiosFetcher('manager/transfer-config').then(value => {
        return {
          ...value,
          depositMaxDailyValue: maskCurrency(value.depositMaxDailyValue)
        }
      }),
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: FormValues) {
    const [isOk, response] = await updateTransferConfig({
      depositFeePercentage: removeComma(data.depositFeePercentage),
      depositMaxDailyValue: unMaskCurrency(data.depositMaxDailyValue),
      bankPixFeePercentage: removeComma(data.bankPixFeePercentage)
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

    handleClose()
  }

  function handleClose() {
    onClose()
  }

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} leftIcon={<BsFillGearFill />}>
        Configurações
      </Button>
      <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">
            Alterar configurações de Transferências
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <ChakraInput
                label="Taxa Takeback (Porcentagem)"
                size="sm"
                isRequired
                {...register('depositFeePercentage')}
                error={formState.errors.depositFeePercentage?.message}
              />
            </Stack>
            <Stack spacing={4}>
              <ChakraInput
                label="Taxa do Banco (Porcentagem)"
                size="sm"
                isRequired
                {...register('bankPixFeePercentage')}
                error={formState.errors.bankPixFeePercentage?.message}
              />
            </Stack>
            <Stack spacing={4}>
              <ChakraInput
                isRequired
                size="sm"
                error={formState.errors.depositMaxDailyValue?.message}
                autoComplete="off"
                label="Limite diário (R$)"
                {...register('depositMaxDailyValue', {
                  onChange: e =>
                    setValue(
                      'depositMaxDailyValue',
                      maskCurrency(e.currentTarget.value)
                    )
                })}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button variant="ghost" onClick={handleClose}>
                Fechar
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
                Salvar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
