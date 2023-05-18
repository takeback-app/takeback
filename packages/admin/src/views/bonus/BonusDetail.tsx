import React from 'react'

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import { ChakraInput } from '../../components/chakra/ChakraInput'
import PageLoader from '../../components/loaders/primaryLoader'
import Layout from '../../components/ui/Layout'
import { maskCPF, maskCurrency } from '../../utils/masks'
import { BonusType, typeText } from './'

interface BonusDetails {
  id: string
  type: BonusType
  value: number
  consumerId: string
  transactionId?: number
  createdAt: Date
  consumer: {
    fullName: string
    cpf: string
  }
  transaction: {
    company: {
      id: string
      fantasyName: string
    }
    consumer: { fullName: string }
    companyUser: {
      cpf: string
      name: string
    }
  }
}

export function BonusDetail() {
  const { id } = useParams()

  const navigateTo = useNavigate()

  const { data: bonus, isLoading } = useSWR<BonusDetails>(`manager/bonus/${id}`)

  if (isLoading || !bonus) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Detalhes da gratificação" goBack={() => navigateTo(-1)}>
      <Stack overflowX="scroll" h="full" p={4}>
        <Card>
          <CardHeader>
            <Heading fontSize="md">Detalhes</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody>
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Nome do Cliente"
                size="sm"
                isReadOnly
                value={bonus.consumer.fullName}
              />
              <ChakraInput
                label="CPF do Cliente"
                size="sm"
                isReadOnly
                value={maskCPF(bonus.consumer.cpf)}
              />
              <ChakraInput
                label="Valor da Gratificação"
                size="sm"
                isReadOnly
                value={maskCurrency(bonus.value)}
              />

              <ChakraInput
                label="Tipo"
                size="sm"
                isReadOnly
                value={typeText[bonus.type]}
              />
              <ChakraInput
                label="Data de criação"
                size="sm"
                isReadOnly
                value={new Date(bonus.createdAt).toLocaleString()}
              />
            </SimpleGrid>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading fontSize="md">Transação originaria</Heading>
          </CardHeader>
          <Divider borderColor="gray.300" />
          <CardBody as={Stack} overflowX="auto" maxH="48">
            <SimpleGrid columns={[1, 2, 3, 4]} gap={8}>
              <ChakraInput
                label="Empresa"
                size="sm"
                isReadOnly
                value={bonus.transaction.company.fantasyName}
              />
              <ChakraInput
                label="Nome do Cliente"
                size="sm"
                isReadOnly
                value={bonus.transaction.consumer.fullName}
              />
              <ChakraInput
                label="Nome do Usuário da Empresa"
                size="sm"
                isReadOnly
                value={bonus.transaction.companyUser.name}
              />
              <ChakraInput
                label="CPF do Usuário da Empresa"
                size="sm"
                isReadOnly
                value={maskCPF(bonus.transaction.companyUser.cpf)}
              />
            </SimpleGrid>
          </CardBody>
        </Card>
      </Stack>
    </Layout>
  )
}
