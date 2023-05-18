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
  const [cashbacksByMethod, setCashbacksByMethod] = useState({} as IReports)
  const [companyAmount, setCompanyAmount] = useState({} as IAmount)

  const [loading, setLoading] = useState(true)

  const findData = () => {
    API.get(`/company/data/dashboard`)
      .then(response => {
        setCashbacksByMethod({
          labels: response.data.cashbacksByMethods.labels,
          values: response.data.cashbacksByMethods.values
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
            title="Faturamento"
            label="Total em faturamento"
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
            title="Cashback"
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
            title="Cashbacks por forma de pagamento"
            subtitle="Últimos sete dias"
            loading={loading}
          >
            {cashbacksByMethod.values && cashbacksByMethod.values.length > 0 ? (
              <DoughnutChart
                data={{
                  labels: cashbacksByMethod.labels,
                  datasets: [
                    {
                      data: cashbacksByMethod.values,
                      label: '',
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                    }
                  ]
                }}
              />
            ) : (
              <S.NoDataLabel>Nenhum cashback</S.NoDataLabel>
            )}
          </LargeCard>
          <LargeCard
            title="Cashbacks emitidos por dia"
            subtitle="Últimos sete dias"
            loading={loading}
          >
            {cashbacksByPeriod.values && cashbacksByPeriod.values.length > 0 ? (
              <LineChart
                data={{
                  labels: cashbacksByPeriod.labels,
                  datasets: [
                    {
                      data: cashbacksByPeriod.values,
                      label: '',
                      borderColor: 'rgb(255, 99, 132)',
                      fill: false,
                      tension: 0.4
                    }
                  ]
                }}
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
