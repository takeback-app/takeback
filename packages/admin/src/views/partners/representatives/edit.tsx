import React from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import PageLoader from '../../../components/loaders/primaryLoader'

import { useForm } from 'react-hook-form'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { maskCEP, maskCNPJ, maskCPF, maskPhone } from '../../../utils/masks'
import { ChakraSelect, Option } from '../../../components/chakra/ChakraSelect'
import { z } from 'zod'
import { validCnpj, validCpf } from '../../../utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '../../../components/ui/Layout/Layout'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'
import { ChakraInput } from '../../../components/chakra/ChakraInput'
import { updateRepresentative } from './services/api'
import { axiosFetcher } from '../../../services/API'
import { ChangeActiveModalButton } from '../../../components/modals/ChangeActiveModalButton'

const schema = z
  .object({
    fantasyName: z.string().min(3, 'Nome muito curto'),
    cnpj: z.string().min(18, 'CNPJ inválido'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
    isActive: z.boolean().optional(),
    commissionPercentage: z.string(),
    consultantBonusPercentage: z.string(),
    address: z.object({
      street: z.string(),
      district: z.string(),
      number: z.string(),
      complement: z.string(),
      zipCode: z.string(),
      cityId: z.string()
    }),
    user: z.object({
      name: z.string().nonempty(),
      email: z.string().email('E-mail inválido'),
      phone: z.string().min(14, 'Telefone inválido'),
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
  })
  .refine(
    ({ user: { password, passwordConfirmation } }) => {
      if (!password || !passwordConfirmation) return true

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

type EditRepresentativeForm = z.infer<typeof schema>

export function EditRepresentative() {
  const { data: cities } = useSWR<Option[]>('manager/cities')

  const { id } = useParams()

  const navigateTo = useNavigate()

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState } = useForm<EditRepresentativeForm>(
    {
      defaultValues: async () => axiosFetcher(`manager/representatives/${id}`),
      resolver: zodResolver(schema)
    }
  )

  async function handleUpdate(data: EditRepresentativeForm) {
    if (!id) return

    data.cnpj = data.cnpj.replace(/\D/g, '')
    data.phone = data.phone.replace(/\D/g, '')
    data.user.cpf = data.user.cpf.replace(/\D/g, '')
    data.user.phone = data.user.phone.replace(/\D/g, '')

    const [isOk, response] = await updateRepresentative(id, {
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

  if (formState.isLoading) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Editar Representante" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleUpdate)}
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
                label="Rua"
                size="sm"
                isRequired
                error={formState.errors.address?.street?.message}
                {...register('address.street')}
              />
              <ChakraInput
                label="Número"
                size="sm"
                isRequired
                error={formState.errors.address?.number?.message}
                {...register('address.number')}
              />
              <ChakraInput
                label="Complemento"
                size="sm"
                error={formState.errors.address?.complement?.message}
                {...register('address.complement')}
              />

              <ChakraInput
                label="Bairro"
                size="sm"
                isRequired
                error={formState.errors.address?.district?.message}
                {...register('address.district')}
              />

              <ChakraInput
                label="CEP"
                size="sm"
                isRequired
                error={formState.errors.address?.zipCode?.message}
                {...register('address.zipCode', {
                  onChange: e => {
                    e.target.value = maskCEP(e.target.value)
                  }
                })}
              />

              <ChakraSelect
                label="Cidade"
                size="sm"
                options={cities ?? []}
                isRequired
                placeholderOption="Selecione uma cidade"
                error={formState.errors.address?.cityId?.message}
                {...register('address.cityId')}
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
                {...register('user.password')}
              />

              <ChakraInput
                label="Confimação de Senha"
                size="sm"
                error={formState.errors.user?.passwordConfirmation?.message}
                {...register('user.passwordConfirmation')}
              />
            </SimpleGrid>
          </CardBody>
        </Card>
        <ButtonGroup justifyContent="space-between">
          <ChangeActiveModalButton
            representativeId={id || ''}
            isActive={!!formState.defaultValues?.isActive}
          />
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
