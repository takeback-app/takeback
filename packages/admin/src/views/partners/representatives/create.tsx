import React, { FocusEvent } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
import {
  maskCEP,
  maskCNPJ,
  maskCPF,
  maskPhone,
  removeMask
} from '../../../utils/masks'
import { z } from 'zod'
import { validCnpj, validCpf } from '../../../utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '../../../components/ui/Layout/Layout'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { storeRepresentative } from './services/api'
import axios from 'axios'
import { ViaCepCepResponse } from './types'

const schema = z
  .object({
    fantasyName: z.string().min(3, 'Nome muito curto'),
    cnpj: z.string().min(18, 'CNPJ inválido'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(15, 'Telefone inválido'),
    commissionPercentage: z.string(),
    consultantBonusPercentage: z.string(),
    address: z.object({
      street: z.string(),
      district: z.string(),
      number: z.string(),
      complement: z.string(),
      zipCode: z.string(),
      city: z.string(),
      state: z.string(),
      ibgeCode: z.string().nonempty({ message: 'CEP inválido' })
    }),
    user: z.object({
      name: z.string().nonempty(),
      email: z.string().email('E-mail inválido'),
      phone: z.string().min(15, 'Telefone inválido'),
      birthday: z.string().min(10, 'Data inválida'),
      cpf: z.string().min(14, 'CPF inválido'),
      password: z.string().min(6, 'Senha muito curta'),
      passwordConfirmation: z.string().min(6, 'Senha muito curta')
    })
  })
  .refine(
    ({ user: { password, passwordConfirmation } }) => {
      return password === passwordConfirmation
    },
    {
      path: ['user.passwordConfirmation'],
      message: 'As senhas não coincidem'
    }
  )
  .refine(
    ({ commissionPercentage }) => {
      const number = Number(commissionPercentage)

      if (!number) return false

      return number >= 0 && number <= 100
    },
    {
      path: ['commissionPercentage'],
      message: 'Porcentagem inválida'
    }
  )
  .refine(
    ({ consultantBonusPercentage }) => {
      const number = Number(consultantBonusPercentage)

      if (!number) return false

      return number >= 0 && number <= 100
    },
    {
      path: ['consultantBonusPercentage'],
      message: 'Porcentagem inválida'
    }
  )
  .refine(({ cnpj }) => validCnpj(cnpj), {
    path: ['cnpj'],
    message: 'CNPJ inválido'
  })
  .refine(({ user }) => validCpf(user.cpf), {
    path: ['user.cpf'],
    message: 'CPF inválido'
  })

type CreateRepresentativeForm = z.infer<typeof schema>

export function CreateRepresentative() {
  const [isLoadingAddress, setLoadingAddress] = React.useState(false)

  const navigateTo = useNavigate()

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState, setError, setValue, clearErrors } =
    useForm<CreateRepresentativeForm>({
      resolver: zodResolver(schema)
    })

  async function handleCreate(data: CreateRepresentativeForm) {
    data.cnpj = removeMask(data.cnpj)
    data.phone = removeMask(data.phone)
    data.user.cpf = removeMask(data.user.cpf)
    data.user.phone = removeMask(data.user.phone)

    const [isOk, response] = await storeRepresentative({
      ...data,
      commissionPercentage: Number(data.commissionPercentage) / 100,
      consultantBonusPercentage: Number(data.consultantBonusPercentage) / 100
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

    navigateTo(-1)
  }

  async function searchZipCode(e: FocusEvent<HTMLInputElement>) {
    if (e.target.value.length < 9) return

    setLoadingAddress(true)

    const zipCode = e.target.value

    const { data } = await axios.get<ViaCepCepResponse>(
      `https://viacep.com.br/ws/${zipCode}/json/`
    )

    if (data.erro) {
      setLoadingAddress(false)

      setValue('address.street', '')
      setValue('address.district', '')
      setValue('address.ibgeCode', '')
      setValue('address.city', '')
      setValue('address.complement', '')

      return setError('address.zipCode', { message: 'CEP inválido' })
    }

    clearErrors('address.zipCode')

    setValue('address.street', data.logradouro)
    setValue('address.district', data.bairro)
    setValue('address.ibgeCode', data.ibge)
    setValue('address.city', data.localidade)
    setValue('address.state', data.uf)

    setLoadingAddress(false)
  }

  return (
    <Layout title="Criar Representante" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleCreate)}
        overflowX="scroll"
        h="full"
        p={4}
      >
        <Card>
          <CardHeader>
            <Heading fontSize="md">Dados do Representante</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Nome Fantasia"
                size="sm"
                isRequired
                error={formState.errors.fantasyName?.message}
                {...register('fantasyName')}
              />

              <ChakraInput
                label="CNPJ"
                size="sm"
                error={formState.errors.cnpj?.message}
                isRequired
                {...register('cnpj', {
                  onChange: e => {
                    e.target.value = maskCNPJ(e.target.value)
                  }
                })}
              />
              <ChakraInput
                label="E-mail"
                isRequired
                error={formState.errors.email?.message}
                size="sm"
                {...register('email')}
              />
              <ChakraInput
                label="Telefone"
                size="sm"
                error={formState.errors.phone?.message}
                isRequired
                {...register('phone', {
                  onChange: e => {
                    e.target.value = maskPhone(e.target.value)
                  }
                })}
              />
              <ChakraInput
                label="Porcentagem de comissão"
                size="sm"
                isRequired
                error={formState.errors.commissionPercentage?.message}
                {...register('commissionPercentage')}
              />

              <ChakraInput
                label="Porcentagem de bônus"
                size="sm"
                isRequired
                error={formState.errors.consultantBonusPercentage?.message}
                {...register('consultantBonusPercentage')}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading fontSize="md">Endereço</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="CEP"
                size="sm"
                isDisabled={isLoadingAddress}
                isRequired
                error={
                  formState.errors.address?.zipCode?.message ||
                  formState.errors.address?.ibgeCode?.message
                }
                {...register('address.zipCode', {
                  onChange: e => {
                    e.target.value = maskCEP(e.target.value)
                  },
                  onBlur: searchZipCode
                })}
              />

              <ChakraInput
                label="Rua"
                size="sm"
                isDisabled={isLoadingAddress}
                isRequired
                error={formState.errors.address?.street?.message}
                {...register('address.street')}
              />
              <ChakraInput
                label="Número"
                size="sm"
                isDisabled={isLoadingAddress}
                isRequired
                error={formState.errors.address?.number?.message}
                {...register('address.number')}
              />
              <ChakraInput
                label="Complemento"
                size="sm"
                isDisabled={isLoadingAddress}
                error={formState.errors.address?.complement?.message}
                {...register('address.complement')}
              />

              <ChakraInput
                label="Bairro"
                size="sm"
                isDisabled={isLoadingAddress}
                isRequired
                error={formState.errors.address?.district?.message}
                {...register('address.district')}
              />

              <ChakraInput
                label="Cidade"
                size="sm"
                isReadOnly
                isRequired
                error={formState.errors.address?.city?.message}
                {...register('address.city')}
              />

              <ChakraInput
                label="Estado (UF)"
                size="sm"
                isReadOnly
                isRequired
                error={formState.errors.address?.state?.message}
                {...register('address.state')}
              />

              <ChakraInput
                label="IBGE"
                size="sm"
                hidden
                isDisabled={isLoadingAddress}
                {...register('address.ibgeCode')}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading fontSize="md">Dados do usuário administrador</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Nome"
                size="sm"
                error={formState.errors.user?.name?.message}
                isRequired
                {...register('user.name')}
              />
              <ChakraInput
                label="CPF"
                size="sm"
                error={formState.errors.user?.cpf?.message}
                isRequired
                {...register('user.cpf', {
                  onChange: e => {
                    e.target.value = maskCPF(e.target.value)
                  }
                })}
              />

              <ChakraInput
                label="E-mail"
                isRequired
                error={formState.errors.user?.email?.message}
                size="sm"
                {...register('user.email')}
              />
              <ChakraInput
                label="Telefone"
                size="sm"
                error={formState.errors.user?.phone?.message}
                isRequired
                {...register('user.phone', {
                  onChange: e => {
                    e.target.value = maskPhone(e.target.value)
                  }
                })}
              />

              <ChakraInput
                label="Data de nascimento"
                size="sm"
                type="date"
                error={formState.errors.user?.birthday?.message}
                isRequired
                {...register('user.birthday')}
              />

              <ChakraInput
                label="Senha"
                size="sm"
                error={formState.errors.user?.password?.message}
                isRequired
                {...register('user.password')}
              />

              <ChakraInput
                label="Confimação de Senha"
                size="sm"
                error={formState.errors.user?.passwordConfirmation?.message}
                isRequired
                {...register('user.passwordConfirmation')}
              />
            </SimpleGrid>
          </CardBody>
        </Card>
        <ButtonGroup justifyContent="flex-end">
          <Button
            colorScheme="green"
            leftIcon={<IoCheckmarkSharp />}
            type="submit"
          >
            Salvar
          </Button>
        </ButtonGroup>
      </Stack>
    </Layout>
  )
}
