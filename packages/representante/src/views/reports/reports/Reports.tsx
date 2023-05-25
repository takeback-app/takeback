import React from 'react'
import { useNavigate } from 'react-router'
import {
  IoCalendarClearOutline,
  IoLogoUsd,
  IoStorefrontOutline
} from 'react-icons/io5'

import Layout from '../../../components/ui/Layout'

import * as S from './styles'

const ReportsOptions = [
  {
    title: 'Ordens de pagamento',
    icon: IoLogoUsd,
    navTo: '/relatorios/ordem-de-pagamento'
  },
  {
    title: 'Mensalidades',
    icon: IoCalendarClearOutline,
    navTo: '/relatorios/mensalidades'
  },
  {
    title: 'Empresas',
    icon: IoStorefrontOutline,
    navTo: '/relatorios/empresas'
  },
  {
    title: 'Cashbacks',
    icon: IoCalendarClearOutline,
    navTo: '/relatorios/cashbacks'
  }
]

const Reports: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()

  return (
    <Layout title="Relatórios">
      <S.Content>
        {ReportsOptions.map(item => (
          <S.Card key={item.navTo} onClick={() => navigateTo(item.navTo)}>
            <S.CardIconWrapper>
              <item.icon size={80} color="#ffffff2b" />
            </S.CardIconWrapper>
            <S.CardTitle>{item.title}</S.CardTitle>
          </S.Card>
        ))}
      </S.Content>
    </Layout>
  )
}

export default Reports
