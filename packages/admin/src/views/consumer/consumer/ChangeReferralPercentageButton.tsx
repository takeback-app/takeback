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
import { IoMegaphoneOutline } from 'react-icons/io5'
import { useForm } from 'react-hook-form'

import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { axiosFetcher } from '../../../services/API'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateReferralBonusPercentage } from './services/api'

const schema = z
  .object({
    percentage: z.string().nonempty()
  })
  .refine(data => Number(data.percentage) <= 100, {
    message: 'A porcentagem deve ser menor ou igual a 100',
    path: ['percentage']
  })
  .refine(data => Number(data.percentage) > 0, {
    message: 'A porcentagem deve ser maior ou igual a 0',
    path: ['percentage']
  })

export type FormValues = z.infer<typeof schema>

export function ChangeReferralPercentageButton() {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: () => axiosFetcher('manager/referral-percentage'),
    resolver: zodResolver(schema)
  })

  async function onSubmit(data: FormValues) {
    const [isOk, response] = await updateReferralBonusPercentage(data)

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
      <Button
        colorScheme="orange"
        onClick={onOpen}
        leftIcon={<IoMegaphoneOutline />}
      >
        Bônus por Indicação
      </Button>
      <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">
            Alterar porcentagem de bônus por indicação
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <ChakraInput
                label="Porcentagem"
                size="sm"
                isRequired
                {...register('percentage')}
                error={formState.errors.percentage?.message}
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
