import React from 'react'
import { useNavigate } from 'react-router'
import {
  IoPersonOutline,
  IoCardOutline,
  IoBusinessOutline,
  IoBasketOutline,
  IoConstructOutline
} from 'react-icons/io5'

import Layout from '../../../components/ui/Layout'

import * as S from './styles'

const settingsOptions = [
  {
    title: 'Usuários do sistema',
    icon: IoPersonOutline,
    navTo: '/configuracoes/usuarios',
    color: '#006666'
  },
  {
    title: 'Métodos de pagamento',
    icon: IoCardOutline,
    navTo: '/configuracoes/metodos-de-pagamento',
    color: '#339933'
  },
  {
    title: 'Ramos de atividade',
    icon: IoBusinessOutline,
    navTo: '/configuracoes/ramos-de-atividade',
    color: '#54c3c7'
  },
  {
    title: 'Planos e mensalidade',
    icon: IoBasketOutline,
    navTo: '/configuracoes/planos-e-mensalidade',
    color: '#3366cc'
  },
  {
    title: 'Suporte',
    icon: IoConstructOutline,
    navTo: '/configuracoes/suporte',
    color: '#13383a'
  }
]

const Settigns: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()

  return (
    <Layout title="Configurações">
      <S.Content>
        {settingsOptions.map(item => (
          <S.Card
            key={item.navTo}
            color={item.color}
            onClick={() => navigateTo(item.navTo)}
          >
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

export default Settigns
