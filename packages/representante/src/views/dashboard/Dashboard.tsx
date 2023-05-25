import React from 'react'
import {
  IoWalletOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoStorefrontOutline
} from 'react-icons/io5'

import Layout from '../../components/ui/Layout'

import * as S from './styles'

export function Dashboard() {
  // const { data: expireForecastGraph, isLoading: isExpireForecastGraphLoading } =
  //   useSWR<GraphResponse>('manager/dashboard/expire-balance-forecast-graph')

  return (
    <Layout title="Bem vindo!">
      <S.Container></S.Container>
    </Layout>
  )
}

export default Dashboard
