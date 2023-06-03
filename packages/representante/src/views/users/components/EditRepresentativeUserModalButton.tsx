import React, { useEffect } from 'react'

import {
  Button,
  ButtonGroup,
  IconButton,
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
import { IoCreateOutline } from 'react-icons/io5'

import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { editRepresentativeUser } from '../services/api'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { validCpf } from '../../../utils/validate'
import { maskCPF, maskPhone } from '../../../utils/masks'
import { ChakraPasswordInput } from '../../../components/chakra/ChakraPasswordInput'
import { RepresentativeUsers } from '../../../types/TRepresentativeUsers'
import moment from 'moment'
import { mutate } from 'swr'

interface Props {
  user: RepresentativeUsers
}

const schema = z
  .object({
    name: z.string().nonempty(),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(15, 'Telefone inválido'),
    birthday: z.string().min(10, 'Data inválida'),
    cpf: z.string().min(14, 'CPF inválido'),
    password: z
      .string()
      .min(6, 'Senha muito curta')
      .optional()
      .or(z.literal('')),
    passwordConfirmation: z
      .string()
      .min(6, 'Senha muito curta')
      .optional()
      .or(z.literal(''))
  })
  .refine(
    ({ password, passwordConfirmation }) => {
      if (!password) return true

      return password === passwordConfirmation
    },
    {
      path: ['passwordConfirmation'],
      message: 'As senhas não coincidem'
    }
  )
  .refine(data => validCpf(data.cpf), {
    path: ['cpf'],
    message: 'CPF inválido'
  })

type RepresentativeUserForm = z.infer<typeof schema>

export function EditRepresentativeUserModalButton({ user }: Props) {
  const toast = useToast(chakraToastConfig)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit, formState, setValue } =
    useForm<RepresentativeUserForm>({
      resolver: zodResolver(schema)
    })

  async function onSubmit(data: RepresentativeUserForm) {
    const [isOk, response] = await editRepresentativeUser(user.id, data)

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

    await mutate('/representative/consultants')

    onClose()
  }

  useEffect(() => {
    setValue('name', user.name)
    setValue('email', user.email)
    setValue('phone', maskPhone(user.phone))
    setValue('cpf', maskCPF(user.cpf))
    setValue(
      'birthday',
      moment({
        year: user.birthYear,
        month: user.birthMonth,
        day: user.birthDay
      }).format('YYYY-MM-DD')
    )
  }, [user, setValue])

  return (
    <>
      <IconButton
        size={'sm'}
        colorScheme="blue"
        onClick={onOpen}
        icon={<IoCreateOutline />}
        aria-label="Editar"
      />
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
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
                error={formState.errors.cpf?.message}
                isRequired
                {...register('cpf', {
                  onChange: e => {
                    e.target.value = maskCPF(e.target.value)
                  }
                })}
              />
              <ChakraInput
                label="Email"
                size="sm"
                isRequired
                {...register('email')}
                error={formState.errors.email?.message}
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
              <ChakraPasswordInput
                label="Senha"
                size="sm"
                {...register('password')}
                error={formState.errors.password?.message}
              />
              <ChakraPasswordInput
                label="Confirmação de Senha"
                size="sm"
                {...register('passwordConfirmation')}
                error={formState.errors.passwordConfirmation?.message}
              />
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
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
