import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { DrawerContext } from '../contexts/DrawerContext'
import { useNavigate } from 'react-router'

import { API } from '../services/API'
import { Navigation } from './Navigation'

import { PrimaryLoader } from '../components/loaders/primaryLoader'
import Toaster, { toast } from '../components/ui/toast'
import { AxiosResponse } from 'axios'

const Root: React.FC = () => {
  const navigateTo = useNavigate()
  const {
    setIsSignedIn,
    setUserName,
    setIsManager,
    setOffice,
    setIsRootUser,
    setUserId,
    setGenerateCashback,
    setCompanyName,
    setAccessControl
  } = useContext(AuthContext)
  const { setIsOpen } = useContext(DrawerContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const modeOfDrawer = () => {
      window.innerWidth < 1024 ? setIsOpen(false) : setIsOpen(true)
    }

    function verifyIfUserIsAtenticated() {
      const tokenInSessionStorage = sessionStorage.getItem('token')
      const tokenInLocalStorage = localStorage.getItem('token')

      const token = tokenInSessionStorage || tokenInLocalStorage

      if (token) {
        API.defaults.headers.common.Authorization = `Bearer ${token}`

        API.get('/company/verify-token')
          .then(({ data }: AxiosResponse) => {
            setUserName(data.name)
            setOffice(data.office)
            setIsManager(data.isManager)
            setIsRootUser(data.isRootUser)
            setUserId(data.userId)
            setCompanyName(data.companyName)
            setGenerateCashback(data.generateCashback)
            setAccessControl(data.accessControl)

            setIsSignedIn(true)

            if (data.isManager) {
              navigateTo('/painel')
            } else if (data.generateCashback && data.office === 'Caixa') {
              navigateTo('/caixa')
            } else {
              localStorage.clear()
              sessionStorage.clear()

              toast({
                title: 'Ops :(',
                description: 'Não é possível acessar o caixa no momento',
                type: 'warn',
                position: 'top-right'
              })
              setIsSignedIn(false)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }

    verifyIfUserIsAtenticated()
    modeOfDrawer()
    // eslint-disable-next-line
  }, [setIsSignedIn])

  return loading ? (
    <PrimaryLoader />
  ) : (
    <>
      <Navigation />
      <Toaster />
    </>
  )
}

export { Root }
