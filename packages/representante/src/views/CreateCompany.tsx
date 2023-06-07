import React from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import useSWR from 'swr'

import Layout from '../components/ui/Layout'
import { ChakraInput } from '../components/chakra/ChakraInput'
import { chakraToastConfig } from '../styles/chakraToastConfig'
import { useForm } from 'react-hook-form'
import { storeCompany } from '../services/company'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { maskCEP, maskCNPJ, maskCPF, maskPhone } from '../utils/masks'
import { ChakraSelect, Option } from '../components/chakra/ChakraSelect'
import { z } from 'zod'
import { validCnpj, validCpf } from '../utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z
  .object({
    corporateName: z.string().min(3, 'Razão social muito curto'),
    fantasyName: z.string().min(3, 'Nome muito curto'),
    registeredNumber: z.string().min(18, 'CNPJ inválido'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(15, 'Telefone inválido'),
    contactPhone: z.string().min(15, 'Telefone inválido'),
    industryId: z.string().min(1, 'Selecione um ramo de atividade'),
    consultantId: z.string().optional(),
    zipCode: z.string(),
    paymentPlanId: z.string().transform(Number),
    companyUserData: z.object({
      useCustomName: z.boolean().optional(),
      customName: z.string().nonempty().optional(),
      useCustomFee: z.boolean().optional(),
      customFee: z.number().optional(),
      cpf: z.string().min(14, 'CPF inválido')
    })
  })
  .refine(({ registeredNumber }) => validCnpj(registeredNumber), {
    path: ['registeredNumber'],
    message: 'CNPJ inválido'
  })
  .refine(({ companyUserData }) => validCpf(companyUserData.cpf), {
    path: ['companyUserData.cpf'],
    message: 'CPF inválido'
  })

type CreateCompanyForm = z.infer<typeof schema>

export function CreateCompany() {
  const { data: industries } = useSWR<Option[]>('representative/industries')
  const { data: consultants } = useSWR<Option[]>('representative/consultants')
  const { data: paymentPlans } = useSWR<Option[]>(
    'representative/payment-plans'
  )

  const navigateTo = useNavigate()

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState, watch } =
    useForm<CreateCompanyForm>({
      defaultValues: { companyUserData: { customName: 'Administrador' } },
      resolver: zodResolver(schema)
    })

  async function handleUpdate(data: CreateCompanyForm) {
    data.registeredNumber = data.registeredNumber.replace(/\D/g, '')
    data.phone = data.phone.replace(/\D/g, '')
    data.contactPhone = data.contactPhone.replace(/\D/g, '')
    data.companyUserData.cpf = data.companyUserData.cpf.replace(/\D/g, '')
    data.companyUserData.useCustomFee = false
    data.companyUserData.customFee = 0

    const [isOk, response] = await storeCompany(data)

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

  return (
    <Layout title="Criar empresa" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleUpdate)}
        overflowX="scroll"
        h="full"
        p={4}
      >
        <Card>
          <CardHeader>
            <Heading fontSize="md">Dados da empresa</Heading>
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
                label="Razão Social"
                size="sm"
                error={formState.errors.corporateName?.message}
                isRequired
                {...register('corporateName')}
              />
              <ChakraInput
                label="CNPJ"
                size="sm"
                error={formState.errors.registeredNumber?.message}
                isRequired
                {...register('registeredNumber', {
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
                label="Telefone de Suporte"
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
                label="Telefone de Contato"
                size="sm"
                isRequired
                error={formState.errors.contactPhone?.message}
                {...register('contactPhone', {
                  onChange: e => {
                    e.target.value = maskPhone(e.target.value)
                  }
                })}
              />
              <ChakraSelect
                label="Ramo de atividade"
                size="sm"
                error={formState.errors.industryId?.message}
                options={industries ?? []}
                isRequired
                placeholderOption="Selecione um ramo de atividade"
                {...register('industryId')}
              />
              <ChakraSelect
                label="Consultor"
                size="sm"
                error={formState.errors.consultantId?.message}
                placeholderOption="Nenhum consultor selecionado"
                options={consultants ?? []}
                {...register('consultantId')}
              />

              <ChakraSelect
                label="Plano"
                size="sm"
                error={formState.errors.paymentPlanId?.message}
                placeholderOption="Selecione um plano"
                options={paymentPlans ?? []}
                isRequired
                {...register('paymentPlanId')}
              />
              <ChakraInput
                label="CEP"
                size="sm"
                isRequired
                {...register('zipCode', {
                  onChange: e => {
                    e.target.value = maskCEP(e.target.value)
                  }
                })}
                error={formState.errors.zipCode?.message}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading fontSize="md">Dados do usuário principal</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="CPF"
                size="sm"
                error={formState.errors.companyUserData?.cpf?.message}
                isRequired
                {...register('companyUserData.cpf', {
                  onChange: e => {
                    e.target.value = maskCPF(e.target.value)
                  }
                })}
              />
              <FormControl
                isRequired={watch('companyUserData.useCustomName')}
                isInvalid={
                  !!formState.errors.companyUserData?.useCustomName ||
                  !!formState.errors.companyUserData?.customName
                }
              >
                <Flex mb={2} align="center">
                  <FormLabel
                    mb={0}
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                  >
                    Nome:
                  </FormLabel>
                  <Checkbox
                    size="sm"
                    color="gray.600"
                    {...register('companyUserData.useCustomName')}
                  >
                    utilizar outro nome
                  </Checkbox>
                </Flex>
                <Input
                  isDisabled={!watch('companyUserData.useCustomName')}
                  isRequired={watch('companyUserData.useCustomName')}
                  size="sm"
                  min={13}
                  step={1}
                  {...register('companyUserData.customName')}
                />
                <FormErrorMessage>
                  {formState.errors.companyUserData?.useCustomFee?.message ||
                    formState.errors.companyUserData?.customName?.message}
                </FormErrorMessage>
              </FormControl>
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
