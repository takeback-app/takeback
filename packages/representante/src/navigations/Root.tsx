/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Navigation } from './Navigation'
import { AuthContext } from '../contexts/AuthContext'
import { DrawerContext } from '../contexts/DrawerContext'
import { API } from '../services/API'

import LoadingPage from '../components/loaders/primaryLoader'

const Root: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()

  const {
    setIsSignedIn,
    setUserEmail,
    setUserName,
    setUserId,
    setRole,
    setRepresentativeName,
    setRepresentativeId
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

        API.get('/manager/verify-token')
          .then(response => {
            setRepresentativeName(response.data.representativeName)
            setRepresentativeId(response.data.representativeId)
            setUserEmail(response.data.email)
            setUserName(response.data.name)
            setUserId(response.data.id)
            setRole(response.data.role)

            setIsSignedIn(true)
            navigateTo('/dashboard')
          })
          .catch(() => {
            setLoading(false)
            navigateTo('/')
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
  }, [setIsSignedIn])

  return loading ? <LoadingPage /> : <Navigation />
}

export { Root }
