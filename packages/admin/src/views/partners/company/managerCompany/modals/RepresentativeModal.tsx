import React, { useContext } from 'react'

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
import { axiosFetcher } from '../../../../../services/API'
import { chakraToastConfig } from '../../../../../styles/chakraToastConfig'
import { ChakraSelect } from '../../../../../components/chakra/ChakraSelect'
import ReportButton from '../../../../../components/buttons/ReportButton/ReportButton'
import { IoPersonOutline } from 'react-icons/io5'
import { updateCompanyRepresentative } from '../api'
import { CCompany } from '../../../../../contexts/CCompany'

interface FormValues {
  representativeId: string
}

interface RepresentativeModalProps {
  companyId: string
  representativeId?: string
}

export function RepresentativeModal({
  companyId,
  representativeId
}: RepresentativeModalProps) {
  const { representatives } = useContext(CCompany)

  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: { representativeId }
  })

  async function onSubmit(data: FormValues) {
    const [isOk, response] = await updateCompanyRepresentative(companyId, {
      representativeId: data.representativeId ?? ''
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
    reset()
    onClose()
  }

  return (
    <>
      <ReportButton
        label="Alterar Representante"
        icon={IoPersonOutline}
        color="#0088cc"
        onClick={onOpen}
      />
      <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">
            Recuperar senha do usuário principal
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <ChakraSelect
                label="Representante"
                size="sm"
                placeholderOption="Nenhum representante selecionado"
                options={representatives.map(r => ({
                  text: r.fantasyName,
                  value: r.id
                }))}
                {...register('representativeId')}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button variant="ghost" onClick={handleClose}>
                Fechar
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
                Concluir
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
