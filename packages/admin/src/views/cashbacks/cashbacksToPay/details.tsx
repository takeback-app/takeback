/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import Layout from '../../../components/ui/Layout'

import {
  Card,
  Flex,
  Button,
  SimpleGrid,
  Box,
  Text,
  ButtonGroup,
  useToast
} from '@chakra-ui/react'
import PrimaryLoader from '../../../components/loaders/secondaryLoader'
import PrimaryInputNotForm from '../../../components/inputs/PrimaryInputNotForm'
import { maskCurrency } from '../../../utils/masks'
import { IoCheckmarkSharp, IoCloseSharp } from 'react-icons/io5'
import { AxiosError } from 'axios'
import { API } from '../../../services/API'
import { WithdrawStatus } from './index'
import { notifyError } from '../../../components/ui/Toastify'
import { chakraToastConfig } from '../../../styles/chakraToastConfig'

interface Withdraw {
  id: string
  value: string
  pixKey: string
  company: {
    id: string
    fantasyName: string
    positiveBalance: string
  }
  status: {
    id: number
    description: string
  }
  createdAt: string
}

export function WithdrawOrderDetails() {
  const toast = useToast(chakraToastConfig)

  const navigateTo = useNavigate()
  const { id } = useParams()

  const { data, isLoading } = useSWR<Withdraw>(`manager/withdraws/${id}`)

  const hasInvalidValue = useMemo(
    () => Number(data?.value) > Number(data?.company.positiveBalance),
    [data]
  )

  async function approveWithdraw() {
    try {
      await API.patch(`manager/withdraws/${id}/approve`)
      toast({
        title: 'Sucesso',
        description:
          'Saque aprovado com sucesso. Valor já debitado do saldo da empresa.',
        status: 'success'
      })

      navigateTo(-1)

      setTimeout(() => navigateTo(-1), 100)
    } catch (err) {
      const error = err as AxiosError

      notifyError(
        error.response?.data.message || error.message || 'Erro interno'
      )
    }
  }

  async function cancelWithdraw() {
    try {
      await API.patch(`manager/withdraws/${id}/cancel`)

      navigateTo(-1)

      toast({
        title: 'Sucesso',
        description: 'Saque cancelado com sucesso.',
        status: 'info'
      })
    } catch (err) {
      const error = err as AxiosError

      notifyError(
        error.response?.data.message || error.message || 'Erro interno'
      )
    }
  }

  if (isLoading) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PrimaryLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout goBack={() => navigateTo(-1)} goBackTitle={`Detalhes do saque`}>
      <Box p={4}>
        <Card bg="white" p={4}>
          <SimpleGrid columns={3} gap={8}>
            <PrimaryInputNotForm
              label="Nome da Empresa"
              name=""
              value={data?.company.fantasyName}
              readOnly
            />
            <PrimaryInputNotForm
              label="Status"
              name=""
              value={data!.status.description}
              readOnly
            />
            <PrimaryInputNotForm
              label="Data de emissão"
              name=""
              value={new Date(data!.createdAt).toLocaleDateString()}
              readOnly
            />
            <PrimaryInputNotForm
              label="Saldo atual Takeback"
              name=""
              value={maskCurrency(+data!.company.positiveBalance)}
              readOnly
            />

            <PrimaryInputNotForm
              label="Valor do Saque"
              name=""
              value={maskCurrency(+data!.value)}
              readOnly
            />
          </SimpleGrid>
          <Flex
            display={
              data?.status.description === WithdrawStatus.SOLICITADO
                ? 'flex'
                : 'none'
            }
            justify="space-between"
            align="flex-end"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="sm" color="red.500">
              {hasInvalidValue
                ? 'Não é possível aprovar o saque, pois o saldo é inferior.'
                : null}
            </Text>
            <ButtonGroup>
              <Button
                leftIcon={<IoCheckmarkSharp size={20} />}
                isDisabled={hasInvalidValue}
                onClick={approveWithdraw}
                colorScheme="green"
              >
                Aprovar
              </Button>
              <Button
                leftIcon={<IoCloseSharp size={20} />}
                onClick={cancelWithdraw}
                colorScheme="red"
              >
                Cancelar
              </Button>
            </ButtonGroup>
          </Flex>
        </Card>
      </Box>
    </Layout>
  )
}
