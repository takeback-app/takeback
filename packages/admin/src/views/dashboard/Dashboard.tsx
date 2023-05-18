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

interface GraphResponse {
  labels: [string]
  values: [number]
}

interface TotalizerResponse {
  consumerBalance: number
  companyBalance: number
  pendingCashbackAmount: number
  pendingFeeAmount: number
  consumerCount: number
  companyCount: number
}

export function Dashboard() {
  const { data: totalizer, isLoading: isTotalizerLoading } =
    useSWR<TotalizerResponse>('manager/dashboard/totalizer')

  const { data: feeGraph, isLoading: isFeeGraphLoading } =
    useSWR<GraphResponse>('manager/dashboard/fee-graph')

  const { data: cashbackGraph, isLoading: isCashbackGraphLoading } =
    useSWR<GraphResponse>('manager/dashboard/cashback-graph')

  const { data: bonusGraph, isLoading: isBonusGraphLoading } =
    useSWR<GraphResponse>('manager/dashboard/bonus-graph')

  const { data: expireBalanceGraph, isLoading: isExpireBalanceGraphLoading } =
    useSWR<GraphResponse>('manager/dashboard/expire-balance-graph')

  // const { data: expireForecastGraph, isLoading: isExpireForecastGraphLoading } =
  //   useSWR<GraphResponse>('manager/dashboard/expire-balance-forecast-graph')

  return (
    <Layout title="Bem vindo!">
      <S.Container>
        <S.SmallCardsWrapper>
          <SmallCard
            title="Saldo em conta"
            label="Total à pagar"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(
              (totalizer?.companyBalance || 0) +
                (totalizer?.consumerBalance || 0)
            )}
            icon={IoWalletOutline}
            color="#00BF78"
            loading={isTotalizerLoading}
          />
          <SmallCard
            title="Saldo em usuários"
            label="Saldo disponível dos usuários"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(totalizer?.consumerBalance || 0)}
            icon={IoPeopleOutline}
            color="#00BF78"
            loading={isTotalizerLoading}
          />
          <SmallCard
            title="Saldo em empresas"
            label="Saldo takeback das empresas"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(totalizer?.companyBalance || 0)}
            icon={IoStorefrontOutline}
            color="#00BF78"
            loading={isTotalizerLoading}
          />
          <SmallCard
            title="Pendentes"
            label="Empresas devem para aos usuários"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(totalizer?.pendingCashbackAmount || 0)}
            icon={IoStorefrontOutline}
            color="#ff0000"
            loading={isTotalizerLoading}
          />
          <SmallCard
            title="Taxas pendentes"
            label="Previsão de faturamento"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(totalizer?.pendingFeeAmount || 0)}
            icon={IoReceiptOutline}
            color="#ff9f40"
            loading={isTotalizerLoading}
          />
        </S.SmallCardsWrapper>
        <S.LargeCardsWrapper2>
          <LargeCard
            title="Faturamento Takeback"
            subtitle="Taxas por mês"
            loading={isFeeGraphLoading}
          >
            <BarChart
              data={{
                labels: feeGraph?.labels,
                datasets: [
                  {
                    data: feeGraph?.values || [],
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
          <LargeCard
            title="Despesa Takeback"
            subtitle="Gratificações por mês"
            loading={isBonusGraphLoading}
          >
            <BarChart
              data={{
                labels: bonusGraph?.labels,
                datasets: [
                  {
                    data: bonusGraph?.values || [],
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
          <LargeCard
            title="Faturamento Takeback"
            subtitle="Saldos expirados por mês"
            loading={isExpireBalanceGraphLoading}
          >
            <BarChart
              data={{
                labels: expireBalanceGraph?.labels,
                datasets: [
                  {
                    data: expireBalanceGraph?.values || [],
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
          {/* <LargeCard
            title="Faturamento Takeback"
            subtitle="Projeção do saldos expirados por mês"
            loading={isExpireForecastGraphLoading}
          >
            <BarChart
              data={{
                labels: expireForecastGraph?.labels,
                datasets: [
                  {
                    data: expireForecastGraph?.values || [],
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
          </LargeCard> */}
        </S.LargeCardsWrapper2>
        <S.LargeCardsWrapper>
          <LargeCard
            subtitle="Taxas dos Cashbacks por mês"
            loading={isCashbackGraphLoading}
          >
            <LineChart
              data={{
                labels: cashbackGraph?.labels,
                datasets: [
                  {
                    data: cashbackGraph?.values || [],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.4
                  }
                ]
              }}
            />
          </LargeCard>
          <LargeCard
            title="Totalizador"
            subtitle="Clientes x Empresas"
            loading={isTotalizerLoading}
          >
            <DoughnutChart
              data={{
                labels: ['Empresas', 'Clientes'],
                datasets: [
                  {
                    data: [
                      totalizer?.companyCount || 0,
                      totalizer?.consumerCount || 0
                    ],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                  }
                ]
              }}
            />
          </LargeCard>
        </S.LargeCardsWrapper>
      </S.Container>
    </Layout>
  )
}

export default Dashboard
