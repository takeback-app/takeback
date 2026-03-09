import React, { useContext } from 'react'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import Layout from '../components/ui/Layout'
import { ChakraInput } from '../components/chakra/ChakraInput'
import { chakraToastConfig } from '../styles/chakraToastConfig'
import { axiosFetcher } from '../services/API'
import { useForm } from 'react-hook-form'
import { updateCompany } from '../services/company'
import { IoCheckmarkSharp, IoIdCard, IoKey } from 'react-icons/io5'
import { maskCNPJ, maskPhone } from '../utils/masks'
import { ChakraSelect, Option } from '../components/chakra/ChakraSelect'
import { RecoverPasswordModalButton } from '../components/modals/RecoverPasswordModalButton'
import { ChangeConsultantModalButton } from '../components/modals/ChangeConsultantModalButton'
import { AuthContext } from '../contexts/AuthContext'

interface CompanyDetail {
  id?: string
  corporateName: string
  fantasyName: string
  registeredNumber: string
  email: string
  phone: string
  contactPhone: string
  industryId: number
  statusId: number
  consultantId: string
  companyStatus?: {
    description: string
  }
  companyAddress: {
    id?: number
    street: string
    district: string
    number: string
    complement: string
    cityId: number
    latitude: number
    longitude: number
  }
  paymentPlan: {
    id?: number
    description: string
    value: string
  }
  useQRCode: boolean
  integrationType: string
}

export function CompanyDetails() {
  const { isAdmin } = useContext(AuthContext)

  const { data: industries } = useSWR<Option[]>('representative/industries')
  const { data: cities } = useSWR<Option[]>('representative/cities')

  const { id } = useParams()

  const navigateTo = useNavigate()

  const toast = useToast(chakraToastConfig)

  const { register, handleSubmit, formState, setError } =
    useForm<CompanyDetail>({
      defaultValues: async () => axiosFetcher(`representative/companies/${id}`)
    })

  async function handleUpdate(data: CompanyDetail) {
    if (!id) return
    const latitude = Number(data.companyAddress.latitude)
    const longitude = Number(data.companyAddress.longitude)
    const error = {
      message: 'Valor inválido. Use apenas números e um ponto decimal opcional.'
    }
    if (isNaN(latitude)) {
      return setError('companyAddress.latitude', error)
    }
    if (isNaN(longitude)) {
      return setError('companyAddress.longitude', error)
    }

    data.registeredNumber = data.registeredNumber.replace(/\D/g, '')
    data.phone = data.phone.replace(/\D/g, '')
    data.contactPhone = data.contactPhone.replace(/\D/g, '')
    data.companyAddress.latitude = latitude
    data.companyAddress.longitude = longitude

    const [isOk, response] = await updateCompany(id, data)

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
    <Layout title="Editar empresa" goBack={() => navigateTo(-1)}>
      <Stack
        as="form"
        onSubmit={handleSubmit(handleUpdate)}
        overflowX="scroll"
        h="full"
        p={4}
      >
        {formState.isLoading ? (
          <Spinner size="sm" colorScheme="green" />
        ) : (
          <ButtonGroup display={isAdmin ? 'flex' : 'none'}>
            {!!id && <RecoverPasswordModalButton companyId={id} />}

            {!!id && (
              <ChangeConsultantModalButton
                companyId={id}
                consultantId={formState.defaultValues?.consultantId || ''}
              />
            )}
          </ButtonGroup>
        )}

        <Card>
          <CardHeader>
            <Heading fontSize="md">Detalhes</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Nome Fantasia"
                size="sm"
                isReadOnly={!isAdmin}
                isRequired
                {...register('fantasyName')}
              />
              <ChakraInput
                label="Razão Social"
                size="sm"
                isReadOnly={!isAdmin}
                isRequired
                {...register('corporateName')}
              />
              <ChakraInput
                label="CNPJ"
                size="sm"
                isReadOnly={!isAdmin}
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
                size="sm"
                isReadOnly={!isAdmin}
                {...register('email')}
              />
              <ChakraInput
                label="Telefone de Suporte"
                size="sm"
                isReadOnly={!isAdmin}
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
                isReadOnly={!isAdmin}
                isRequired
                {...register('contactPhone', {
                  onChange: e => {
                    e.target.value = maskPhone(e.target.value)
                  }
                })}
              />
              <ChakraSelect
                label="Ramo de atividade"
                size="sm"
                isReadOnly={!isAdmin}
                options={industries ?? []}
                isRequired
                {...register('industryId')}
              />
              <ChakraInput
                label="Status"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('companyStatus.description')}
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
                isReadOnly={!isAdmin}
                {...register('companyAddress.street')}
              />
              <ChakraInput
                label="Número"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('companyAddress.number')}
              />
              <ChakraInput
                label="Bairro"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('companyAddress.district')}
              />
              <ChakraSelect
                label="Cidade"
                size="sm"
                isReadOnly={!isAdmin}
                options={cities ?? []}
                isRequired
                {...register('companyAddress.cityId')}
              />
              <ChakraInput
                label="Longitude"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('companyAddress.longitude')}
                error={formState.errors.companyAddress?.longitude?.message}
              />
              <ChakraInput
                label="Latitude"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('companyAddress.latitude')}
                error={formState.errors.companyAddress?.latitude?.message}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading fontSize="md">Taxas e planos</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Taxa"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('paymentPlan.description')}
              />
              <ChakraInput
                label="Valor da Taxa"
                size="sm"
                isReadOnly={!isAdmin}
                {...register('paymentPlan.value')}
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <ButtonGroup
          display={isAdmin ? 'flex' : 'none'}
          justifyContent="flex-end"
        >
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
