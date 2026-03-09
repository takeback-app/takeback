import React, { useState, useEffect, useContext } from 'react'
import {
  IoWalletOutline,
  IoReceiptOutline,
  /* IoPeopleOutline, */
  IoLogoUsd
} from 'react-icons/io5'

import { API } from '../../../services/API'
import { AuthContext } from '../../../contexts/AuthContext'

import { Layout } from '../../../components/ui/layout'
import { SmallCard } from '../../../components/cards/smallCard'
import { LargeCard } from '../../../components/cards/largeCard'
import { LineChart } from '../../../components/charts/lineChart'
import { DoughnutChart } from '../../../components/charts/doughnutChart'

import * as S from './styles'
import { BarChart } from '../../../components/charts/barChart'

interface IReports {
  labels: Array<string>
  values: Array<number>
}

interface IAmount {
  billingAmount: number
  cashbackAmount: number
  balanceAmount: number
  cashbackToPayAmount: number
}

export const Dashboard: React.FC = () => {
  const { userName } = useContext(AuthContext)

  const [cashbacksByPeriod, setCashbacksByPeriod] = useState({} as IReports)
  const [billingsByPeriod, setBillingsByPeriod] = useState({} as IReports)
  const [companyAmount, setCompanyAmount] = useState({} as IAmount)

  const [loading, setLoading] = useState(true)

  const currentMonth = new Intl.DateTimeFormat('pt-BR', {
    month: 'long'
  }).format(new Date())

  const findData = () => {
    API.get(`/company/data/dashboard`)
      .then(response => {
        setBillingsByPeriod({
          labels: response.data.billingsByPeriod.labels,
          values: response.data.billingsByPeriod.values
        })

        setCashbacksByPeriod({
          labels: response.data.cashbacksByPeriod.labels,
          values: response.data.cashbacksByPeriod.values
        })

        setCompanyAmount({
          balanceAmount: response.data.companyAmount.balanceAmount,
          billingAmount: response.data.companyAmount.billingAmount,
          cashbackAmount: response.data.companyAmount.cashbackAmount,
          cashbackToPayAmount: response.data.companyAmount.cashbackToPayAmount
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getFirstName = (userName: string) => {
    const [firstName] = userName.split(' ')

    return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)}`
  }

  useEffect(() => {
    findData()

    // eslint-disable-next-line
  }, [])

  return (
    <Layout title={`Bem vindo, ${getFirstName(userName || '')}!`}>
      <S.Container>
        <S.SmallCardsWrapper>
          <SmallCard
            title={'Faturamento de ' + currentMonth}
            label="Total em faturamento do mês"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(companyAmount.billingAmount)}
            icon={IoLogoUsd}
            color="#00BF78"
            loading={loading}
          />
          <SmallCard
            title="Cashback a pagar"
            label="Total de cashback a pagar"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(companyAmount.cashbackToPayAmount)}
            icon={IoLogoUsd}
            color="#ff6666"
            loading={loading}
          />
          <SmallCard
            title={'Cashbacks de ' + currentMonth}
            label="Total dos cashbacks emitidos"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(companyAmount.cashbackAmount)}
            icon={IoReceiptOutline}
            color="#ff9f40"
            loading={loading}
          />
          <SmallCard
            title="Meu saldo"
            label="Valor disponível em sua conta"
            description={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(companyAmount.balanceAmount)}
            icon={IoWalletOutline}
            color="#36a2eb"
            loading={loading}
          />
        </S.SmallCardsWrapper>

        <S.LargeCardsWrapper>
          <LargeCard
            title="Faturamento"
            subtitle="Resultado por mês"
            loading={loading}
          >
            {billingsByPeriod.values && billingsByPeriod.values.length > 0 ? (
              <BarChart
                data={{
                  labels: billingsByPeriod.labels,
                  datasets: [
                    {
                      data: billingsByPeriod.values,
                      label: '',
                      backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 0,
                      borderRadius: 10
                    }
                  ]
                }}
                tooltipFormat="currency"
                datalabels={false}
              />
            ) : (
              <S.NoDataLabel>Nenhum cashback</S.NoDataLabel>
            )}
          </LargeCard>
          <LargeCard
            title="Cashbacks emitidos"
            subtitle="Resultado por mês"
            loading={loading}
          >
            {cashbacksByPeriod.values && cashbacksByPeriod.values.length > 0 ? (
              <BarChart
                data={{
                  labels: cashbacksByPeriod.labels,
                  datasets: [
                    {
                      data: cashbacksByPeriod.values,
                      label: '',
                      backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 0,
                      borderRadius: 10
                    }
                  ]
                }}
                tooltipFormat="currency"
                datalabels={false}
              />
            ) : (
              <S.NoDataLabel>Nenhum cashback</S.NoDataLabel>
            )}
          </LargeCard>
        </S.LargeCardsWrapper>
        <S.FooterDevelopment>
          <S.DevelopmentFont href="https://desencoder.com.br/" target="_blank">
            Desenvolvido por DesenCoder
          </S.DevelopmentFont>
        </S.FooterDevelopment>
      </S.Container>
    </Layout>
  )
}
