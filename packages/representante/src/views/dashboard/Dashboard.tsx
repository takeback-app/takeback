import React from 'react'
import {
  IoWalletOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoStorefrontOutline
} from 'react-icons/io5'

import useSWR from 'swr'

import Layout from '../../components/ui/Layout'
import SmallCard from '../../components/cards/SmallCard'
import LargeCard from '../../components/cards/LargeCard'
import DoughnutChart from '../../components/charts/DoughnutChart'
import LineChart from '../../components/charts/LineChart'
import BarChart from '../../components/charts/BarChart'

import * as S from './styles'
import { Flex } from '@chakra-ui/react'

interface GraphResponse {
  labels: [string]
  values: [number]
}

interface DashboardResponse {
  billingAmount: number
  commissionsAmount: number
  commissionAmountPending: number
  cashbackAmount: number
  companiesBalance: number
  balance: number
  cashbackToPayAmount: number
  monthlyPaymentToPayAmount: number
  feeToPayAmount: number
}

export function Dashboard() {
  const { data, isLoading } = useSWR<DashboardResponse>(
    'representative/dashboard'
  )

  const { data: commissionGraph, isLoading: isCommissionGraphLoading } =
    useSWR<GraphResponse>('representative/dashboard/commission-graph')

  return (
    <Layout title="Bem vindo!">
      <S.Container>
        <S.SmallCardsWrapper>
          <SmallCard
            title="Faturamento Empresas"
            label="Total faturado pelas empresas"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.billingAmount || 0)}
            icon={IoStorefrontOutline}
            color="#00BF78"
            loading={isLoading}
          />
          <SmallCard
            title="Comissões Totais"
            label="Total de comissões recebidas"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.commissionsAmount || 0)}
            icon={IoReceiptOutline}
            color="#00BF78"
            loading={isLoading}
          />
          <SmallCard
            title="Saldo em empresas"
            label="Saldo takeback das empresas"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.companiesBalance || 0)}
            icon={IoStorefrontOutline}
            color="#00BF78"
            loading={isLoading}
          />
          <SmallCard
            title="Meu saldo"
            label="Saldo disponível para saque"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.balance || 0)}
            icon={IoWalletOutline}
            color="#00BF78"
            loading={isLoading}
          />
          <SmallCard
            title="Cashbacks Pendentes"
            label="Total de cashbacks pendentes"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.cashbackToPayAmount || 0)}
            icon={IoReceiptOutline}
            color="#ff9f40"
            loading={isLoading}
          />

          <SmallCard
            title="Taxas Pendentes"
            label="Total de taxas pendentes"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.feeToPayAmount || 0)}
            icon={IoReceiptOutline}
            color="#ff9f40"
            loading={isLoading}
          />

          <SmallCard
            title="Mensalidades Pendentes"
            label="Total de mensalidades pendentes"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.monthlyPaymentToPayAmount || 0)}
            icon={IoReceiptOutline}
            color="#ff9f40"
            loading={isLoading}
          />

          <SmallCard
            title="Comissão Pendente"
            label="Total de comissões pendentes"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(data?.commissionAmountPending || 0)}
            icon={IoReceiptOutline}
            color="#ff9f40"
            loading={isLoading}
          />
        </S.SmallCardsWrapper>
        <Flex h="40vh" mt={2}>
          <LargeCard
            title="Comissões"
            subtitle="Comissões por mês"
            loading={isCommissionGraphLoading}
          >
            <BarChart
              data={{
                labels: commissionGraph?.labels,
                datasets: [
                  {
                    data: commissionGraph?.values || [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
            />
          </LargeCard>
        </Flex>
      </S.Container>
    </Layout>
  )
}

export default Dashboard
