import React from 'react'
import {
  IoWalletOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoStorefrontSharp
} from 'react-icons/io5'

import useSWR from 'swr'

import Layout from '../../components/ui/Layout'
import SmallCard from '../../components/cards/SmallCard'
import LargeCard from '../../components/cards/LargeCard'
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
  representativeBalance: number
  pendingCashbackAmount: number
  commissionAmountPending: number
  pendingFeeAmount: number
  consumerCount: number
  companyCount: number
  activeCompanies: number
  overdueCompanies: number
  activeConsumers: number
  inactiveConsumers: number
  newConsumers: number
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

  const { data: storeValueGraph, isLoading: isStoreValueGraphLoading } =
    useSWR<GraphResponse>('manager/dashboard/store-value')

  const { data: storeCreditGraph, isLoading: isStoreCreditGraphLoading } =
    useSWR<GraphResponse>('manager/dashboard/store-credit')

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
                (totalizer?.consumerBalance || 0) +
                (totalizer?.representativeBalance || 0)
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
            title="Saldo em representantes"
            label="Saldo takeback dos representantes"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(totalizer?.representativeBalance || 0)}
            icon={IoStorefrontSharp}
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
          <SmallCard
            title="Comissões pendentes"
            label="Previsão de comissões"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(totalizer?.commissionAmountPending || 0)}
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
        <S.LargeCardsWrapper2>
          <LargeCard
            title="Faturamento loja de ofertas"
            subtitle="Resultado por mês"
            loading={isStoreValueGraphLoading}
          >
            <BarChart
              data={{
                labels: storeValueGraph?.labels,
                datasets: [
                  {
                    data: storeValueGraph?.values || [],
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
            title="Despesa loja de ofertas"
            subtitle="Resultado por mês"
            loading={isStoreCreditGraphLoading}
          >
            <BarChart
              data={{
                labels: storeCreditGraph?.labels,
                datasets: [
                  {
                    data: storeCreditGraph?.values || [],
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
            subtitle="Emissão de Cashbacks"
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
        </S.LargeCardsWrapper2>
        <S.SmallCardsWrapper2>
          <SmallCard
            title="Clientes Ativos"
            description={(totalizer?.activeConsumers || 0).toString()}
            icon={IoPeopleOutline}
            color="#00BF78"
            loading={isTotalizerLoading}
            label="Clientes que usaram o app nos ultimos 4 meses"
          />
          <SmallCard
            title="Clientes Inativos"
            description={(totalizer?.inactiveConsumers || 0).toString()}
            icon={IoPeopleOutline}
            color="#ff0000"
            loading={isTotalizerLoading}
            label="Clientes que não usaram o app nos ultimos 4 meses"
          />
          <SmallCard
            title="Novos Clientes"
            description={(totalizer?.newConsumers || 0).toString()}
            icon={IoPeopleOutline}
            color="#ff9f40"
            loading={isTotalizerLoading}
            label="Clientes que ainda não baixaram o app"
          />
          <SmallCard
            title="Empresas Ativas"
            description={(totalizer?.activeCompanies || 0).toString()}
            icon={IoStorefrontOutline}
            color="#00BF78"
            loading={isTotalizerLoading}
            label="Empresas com tudo em dia"
          />
          <SmallCard
            title="Empresas Inadimplentes"
            description={(totalizer?.overdueCompanies || 0).toString()}
            icon={IoStorefrontOutline}
            color="#ff0000"
            loading={isTotalizerLoading}
            label="Empresas inadimplentes por cashback ou mensalidade"
          />
        </S.SmallCardsWrapper2>
      </S.Container>
    </Layout>
  )
}

export default Dashboard
