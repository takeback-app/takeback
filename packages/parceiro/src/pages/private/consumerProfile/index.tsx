import React from 'react'
import { IoLogoUsd } from 'react-icons/io5'

import { Layout } from '../../../components/ui/layout'
import { SmallCard } from '../../../components/cards/smallCard'
import { LargeCard } from '../../../components/cards/largeCard'
import { DoughnutChart } from '../../../components/charts/doughnutChart'

import * as S from './styles'
import useSWR from 'swr'
import { BarChart } from '../../../components/charts/barChart'

interface GraphTypes {
  company: Graph
  city: Graph
}

interface ConsumerAvarage {
  company: number
  city: number
}

interface Graph {
  labels: string[]
  values: number[]
}

interface GraphResponse {
  consumerSex: GraphTypes
  consumerChildrens: GraphTypes
  consumerSchooling: GraphTypes
  consumerMonthlyIncomes: GraphTypes
  constumerTimeRange: GraphTypes
  consumersAverage: ConsumerAvarage
}

export function ConsumerProfile() {
  const { data: graphData, isLoading } = useSWR<GraphResponse>(
    'company/consumers/report'
  )

  return (
    <Layout title="Perfil do Cliente">
      <S.Container>
        <S.SmallCardsWrapper>
          <SmallCard
            title="Média de compra por cliente"
            label="Sua empresa"
            description={Intl.NumberFormat('pt-BR', {
              minimumFractionDigits: 2
            }).format(graphData?.consumersAverage.company || 0)}
            icon={IoLogoUsd}
            color="#00BF78"
            loading={isLoading}
          />
          <SmallCard
            title="Média de compra por cliente"
            label="Sua cidade"
            description={Intl.NumberFormat('pt-BR', {
              minimumFractionDigits: 2
            }).format(graphData?.consumersAverage.city || 0)}
            icon={IoLogoUsd}
            color="#00BF78"
            loading={isLoading}
          />
        </S.SmallCardsWrapper>

        <S.LargeCardsWrapper>
          <LargeCard
            title="Clientes com filhos"
            subtitle="Sua empresa"
            loading={isLoading}
          >
            <DoughnutChart
              data={{
                labels: graphData?.consumerChildrens?.company?.labels,
                datasets: [
                  {
                    data: graphData?.consumerChildrens?.company?.values ?? [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)'
                    ],
                    borderWidth: 1,
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    label: ''
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Clientes com filhos"
            subtitle="Sua cidade"
            loading={isLoading}
          >
            <DoughnutChart
              data={{
                labels: graphData?.consumerChildrens?.city?.labels,
                datasets: [
                  {
                    data: graphData?.consumerChildrens?.city?.values ?? [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)'
                    ],
                    borderWidth: 1,
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    label: ''
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Faixa Salarial dos clientes"
            subtitle="Sua empresa"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.consumerMonthlyIncomes?.company?.labels,
                datasets: [
                  {
                    data:
                      graphData?.consumerMonthlyIncomes?.company?.values ?? [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Faixa Salarial dos clientes"
            subtitle="Sua cidade"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.consumerMonthlyIncomes?.city?.labels,
                datasets: [
                  {
                    data: graphData?.consumerMonthlyIncomes?.city?.values ?? [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Escolaridade dos clientes"
            subtitle="Sua empresa"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.consumerSchooling?.company?.labels,
                datasets: [
                  {
                    data: graphData?.consumerSchooling?.company?.values ?? [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Escolaridade dos clientes"
            subtitle="Sua cidade"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.consumerSchooling?.city?.labels,
                datasets: [
                  {
                    data: graphData?.consumerSchooling?.city?.values ?? [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Sexo dos clientes"
            subtitle="Sua empresa"
            loading={isLoading}
          >
            <DoughnutChart
              data={{
                labels: graphData?.consumerSex?.company?.labels,
                datasets: [
                  {
                    data: graphData?.consumerSex?.company?.values ?? [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)'
                    ],
                    borderWidth: 1,
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    label: ''
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Sexo dos clientes"
            subtitle="Sua cidade"
            loading={isLoading}
          >
            <DoughnutChart
              data={{
                labels: graphData?.consumerSex?.city?.labels,
                datasets: [
                  {
                    data: graphData?.consumerSex?.city?.values ?? [],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)'
                    ],
                    borderWidth: 1,
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    label: ''
                  }
                ]
              }}
              tooltipFormat="percent"
            />
          </LargeCard>
          <LargeCard
            title="Compras em um Intervalo"
            subtitle="Sua empresa"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.constumerTimeRange?.company?.labels,
                datasets: [
                  {
                    data: graphData?.constumerTimeRange?.company?.values ?? [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
              tooltipFormat="decimal"
            />
          </LargeCard>
          <LargeCard
            title="Compras em um Intervalo"
            subtitle="Sua cidade"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.constumerTimeRange?.city?.labels,
                datasets: [
                  {
                    data: graphData?.constumerTimeRange?.city?.values ?? [],
                    label: '',
                    backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderRadius: 4
                  }
                ]
              }}
              tooltipFormat="decimal"
            />
          </LargeCard>
        </S.LargeCardsWrapper>
      </S.Container>
    </Layout>
  )
}
