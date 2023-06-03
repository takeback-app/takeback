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
  SimpleGrid,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { IoCreateOutline, IoKeyOutline } from 'react-icons/io5'

import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { createRepresentativeUser } from '../services/api'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { validCpf } from '../../../utils/validate'
import { maskPhone } from '../../../utils/masks'

const schema = z
  .object({
    name: z.string().nonempty(),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
    birthday: z.string().min(10, 'Data inválida'),
    cpf: z.string().min(14, 'CPF inválido'),
    password: z.string().min(6, 'Senha muito curta'),
    passwordConfirmation: z.string().min(6, 'Senha muito curta')
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Senhas não conferem',
    path: ['passwordConfirmation']
  })
  .refine(data => validCpf(data.cpf), {
    path: ['cpf'],
    message: 'CPF inválido'
  })

type RepresentativeUserForm = z.infer<typeof schema>

export function EditRepresentativeUserModalButton() {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, reset, handleSubmit, formState } =
    useForm<RepresentativeUserForm>({
      resolver: zodResolver(schema)
    })

  async function onSubmit(data: RepresentativeUserForm) {
    const [isOk, response] = await createRepresentativeUser(data)

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
      <Button size={'sm'} colorScheme="blue" onClick={onOpen}>
        <IoCreateOutline />
      </Button>
      <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Editar Consultor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={[1, 2, 3]} gap={8}>
              <ChakraInput
                label="Nome"
                size="sm"
                isRequired
                error={formState.errors.name?.message}
                {...register('name')}
              />
              <ChakraInput
                label="CPF"
                size="sm"
                isRequired
                error={formState.errors.cpf?.message}
                {...register('cpf')}
              />
              <ChakraInput
                label="Email"
                size="sm"
                isRequired
                error={formState.errors.email?.message}
                {...register('email')}
              />
              <ChakraInput
                label="Telefone"
                size="sm"
                isRequired
                error={formState.errors.phone?.message}
                {...register('phone', {
                  onChange: e => {
                    e.target.value = maskPhone(e.target.value)
                  }
                })}
              />
              <ChakraInput
                label="Data de nascimento"
                size="sm"
                type="date"
                isRequired
                {...register('birthday')}
                error={formState.errors.birthday?.message}
              />
              <ChakraInput
                label="Senha"
                size="sm"
                isRequired
                {...register('password')}
                error={formState.errors.password?.message}
              />
              <ChakraInput
                label="Confimação de Senha"
                size="sm"
                isRequired
                {...register('passwordConfirmation')}
                error={formState.errors.passwordConfirmation?.message}
              />
            </SimpleGrid>
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
