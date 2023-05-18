/* eslint-disable camelcase */
import React, { useState } from 'react'
import Loader from 'react-spinners/PulseLoader'

import { Layout } from '../../../components/ui/layout'

import * as S from './styles'

export const CashbacksToReceive: React.FC = () => {
  // eslint-disable-next-line
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  return (
    <Layout title="Cashbacks à Receber">
      {isLoadingPage ? (
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
        </S.ContainLoader>
      ) : (
        <h2>À Receber</h2>
      )}
    </Layout>
  )
}
