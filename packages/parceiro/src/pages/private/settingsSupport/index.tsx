import React, { useEffect, useState } from 'react'

import { API } from '../../../services/API'

import { Layout } from '../../../components/ui/layout'
import { PrimaryLoader } from '../../../components/loaders/primaryLoader'
import { Loader } from '../../../components/ui/loader'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

export const Support: React.FC = () => {
  const toast = useToast(chakraToastOptions)

  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [allowedAccess, setAllowedAccess] = useState<boolean>()

  useEffect(() => {
    function findAccessStatus() {
      setPageLoading(true)
      API.get('/company/support/find/permission')
        .then(res => {
          setAllowedAccess(res.data.permissionToSupportAccess)
        })
        .finally(() => {
          setPageLoading(false)
        })
    }

    findAccessStatus()
  }, [])

  function allowSupportAccess() {
    setLoading(true)
    API.put('/company/support/update/permission', {
      permission: !allowedAccess
    })
      .then(res => {
        setAllowedAccess(res.data.permissionStatus.permissionToSupportAccess)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function revogueSupportAccess() {
    setLoading(true)
    API.put('/company/support/update/permission', {
      permission: !allowedAccess
    })
      .then(res => {
        setAllowedAccess(res.data.permissionToSupportAccess)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Layout title="Suporte">
      {pageLoading ? (
        <PrimaryLoader label="Carregando informações..." />
      ) : (
        <S.Container>
          <h4>Acesso do suporte</h4>
          <S.Description>
            {allowedAccess
              ? 'O suporte tem acesso ao seu sistema!'
              : 'Habilite essa opção para permitir que o suporte da TakeBack acesso o seu sistema. Você pode revogar o acesso a qualquer momento.'}
          </S.Description>
          {allowedAccess ? (
            <S.Toggle disabled={loading} onClick={revogueSupportAccess}>
              {loading ? <Loader color="#333" /> : 'Revogar Acesso'}
            </S.Toggle>
          ) : (
            <S.Toggle disabled={loading} onClick={allowSupportAccess}>
              {loading ? <Loader color="#333" /> : 'Permitir Acesso'}
            </S.Toggle>
          )}
        </S.Container>
      )}
    </Layout>
  )
}
