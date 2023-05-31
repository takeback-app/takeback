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
import { IoIdCard } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { updateCompanyConsultant } from '../../services/company'
import { chakraToastConfig } from '../../styles/chakraToastConfig'
import { Option, ChakraSelect } from '../chakra/ChakraSelect'

import useSWR from 'swr'

interface FormValues {
  consultantId: string
}

interface ChangeConsultantModalButtonButtonProps {
  companyId: string
  consultantId: string
}

export function ChangeConsultantModalButton({
  companyId,
  consultantId
}: ChangeConsultantModalButtonButtonProps) {
  const { data: consultants } = useSWR<Option[]>('representative/consultants')

  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: { consultantId }
  })

  async function onSubmit(data: FormValues) {
    const [isOk, response] = await updateCompanyConsultant(companyId, data)

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
    reset()
    onClose()
  }

  return (
    <>
      <Button colorScheme="orange" onClick={onOpen} leftIcon={<IoIdCard />}>
        Alterar Consultor
      </Button>
      <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Alterar Consultor da Empresa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <ChakraSelect
                label="Consultor"
                size="sm"
                placeholderOption="Nenhum consultor selecionado"
                options={consultants ?? []}
                isRequired
                {...register('consultantId')}
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
