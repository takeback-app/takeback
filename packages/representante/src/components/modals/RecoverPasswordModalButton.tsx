import React from 'react'

import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
import { IoKey } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { axiosFetcher } from '../../services/API'
import { resetRootUser } from '../../services/company'
import { chakraToastConfig } from '../../styles/chakraToastConfig'

interface FormValues {
  name: string
  email: string
  isDifferentName: boolean
  isDifferentEmail: boolean
}

interface RecoverPasswordModalButtonProps {
  companyId: string
}

export function RecoverPasswordModalButton({
  companyId
}: RecoverPasswordModalButtonProps) {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, formState, setValue, watch, reset, handleSubmit } =
    useForm<FormValues>({
      defaultValues: async () =>
        axiosFetcher(`representative/companies/${companyId}/root-user`)
    })

  async function onSubmit(data: FormValues) {
    const [isOk, response] = await resetRootUser(companyId, {
      userName: data.name,
      email: data.email
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
      <Button colorScheme="blue" onClick={onOpen} leftIcon={<IoKey />}>
        Recuperar Senha
      </Button>
      <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">
            Recuperar senha do usuário principal
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl
                isInvalid={
                  !!formState.errors.isDifferentName || !!formState.errors.name
                }
              >
                <Flex mb={2} align="center">
                  <FormLabel
                    mb={0}
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                  >
                    Nome de usuário:
                  </FormLabel>
                  <Checkbox
                    size="sm"
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    {...register('isDifferentName', {
                      onChange: () => {
                        setValue('name', formState.defaultValues?.name || '')
                      }
                    })}
                  >
                    utilizar outro nome
                  </Checkbox>
                </Flex>
                <Input
                  isDisabled={!watch('isDifferentName')}
                  size="sm"
                  min={13}
                  step={1}
                  {...register('name')}
                />
                <FormErrorMessage>
                  {formState.errors.isDifferentName?.message ||
                    formState.errors.name?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!formState.errors.isDifferentEmail ||
                  !!formState.errors.email
                }
              >
                <Flex mb={2} align="center">
                  <FormLabel
                    mb={0}
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                  >
                    Email:
                  </FormLabel>
                  <Checkbox
                    size="sm"
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    {...register('isDifferentEmail', {
                      onChange: () => {
                        setValue('email', formState.defaultValues?.email || '')
                      }
                    })}
                  >
                    utilizar outro e-mail
                  </Checkbox>
                </Flex>
                <Input
                  isDisabled={!watch('isDifferentEmail')}
                  size="sm"
                  min={13}
                  step={1}
                  {...register('email')}
                />
                <FormErrorMessage>
                  {formState.errors.isDifferentEmail?.message ||
                    formState.errors.email?.message}
                </FormErrorMessage>
              </FormControl>
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
