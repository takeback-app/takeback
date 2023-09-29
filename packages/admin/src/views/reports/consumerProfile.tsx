import React from 'react'
import { IoLogoUsd } from 'react-icons/io5'
import * as S from './components/consumerProfile/styles'
import useSWR from 'swr'

import DoughnutChart from '../../components/charts/DoughnutChart'
import Layout from '../../components/ui/Layout'
import BarChart from '../../components/charts/BarChart'
import { currencyFormat } from '../../utils/currencytFormat'
import SmallCard from '../../components/cards/SmallCard'
import LargeCard from '../../components/cards/LargeCard'

interface Graph {
  labels: string[]
  values: number[]
}

interface GraphResponse {
  consumerSex: Graph
  consumerChildrens: Graph
  consumerSchooling: Graph
  consumerMonthlyIncomes: Graph
  constumerTimeRange: Graph
  consumersAverage: number
}

export function ConsumerProfile() {
  const { data: graphData, isLoading } = useSWR<GraphResponse>(
    'manager/report/consumers-profile'
  )

  return (
    <Layout title="Perfil do Cliente">
      <S.Container>
        <S.SmallCardsWrapper>
          <SmallCard
            title="Compra média por cliente"
            label="Sua empresa"
            description={currencyFormat(graphData?.consumersAverage || 0)}
            icon={IoLogoUsd}
            color="#00BF78"
            loading={isLoading}
          />
        </S.SmallCardsWrapper>

        <S.LargeCardsWrapper>
          <LargeCard subtitle="Clientes com filhos" loading={isLoading}>
            <DoughnutChart
              data={{
                labels: graphData?.consumerChildrens?.labels,
                datasets: [
                  {
                    data: graphData?.consumerChildrens?.values ?? [],
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
              activeDataLabels={true}
              aspectRatio={2}
            />
          </LargeCard>
          <LargeCard subtitle="Faixa Salarial dos clientes" loading={isLoading}>
            <BarChart
              data={{
                labels: graphData?.consumerMonthlyIncomes?.labels,
                datasets: [
                  {
                    data: graphData?.consumerMonthlyIncomes?.values ?? [],
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
              datalabels={true}
            />
          </LargeCard>
          <LargeCard subtitle="Escolaridade dos clientes" loading={isLoading}>
            <BarChart
              data={{
                labels: graphData?.consumerSchooling?.labels,
                datasets: [
                  {
                    data: graphData?.consumerSchooling?.values ?? [],
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
              datalabels={true}
            />
          </LargeCard>
          <LargeCard subtitle="Sexo dos clientes" loading={isLoading}>
            <DoughnutChart
              data={{
                labels: graphData?.consumerSex?.labels,
                datasets: [
                  {
                    data: graphData?.consumerSex?.values ?? [],
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
              activeDataLabels={true}
              aspectRatio={2}
            />
          </LargeCard>
          <LargeCard
            subtitle="Horario de compra dos clientes"
            loading={isLoading}
          >
            <BarChart
              data={{
                labels: graphData?.constumerTimeRange?.labels,
                datasets: [
                  {
                    data: graphData?.constumerTimeRange?.values ?? [],
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
              datalabels={true}
            />
          </LargeCard>
        </S.LargeCardsWrapper>
      </S.Container>
    </Layout>
  )
}
