import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'

import { PublicRoutes } from './public.routes'
import { PrivateRoutes } from './private.routes'

import { API } from '../services/API'
import { AuthContext } from '../contexts/AuthContext'
import { storeData } from '../utils/StoreData'

import { LoadingScreen } from '../screens/public/loadingScreen'
import { NotConnectedScreen } from '../screens/public/notConnectedScreen'
import { saveNotificationToken } from '../services'
import { useNotification } from '../stores/useNotification'

export function RootNavigation() {
  const { isSignedIn, setIsSignedIn, setIsBalanceVisible } =
    useContext(AuthContext)

  const notificationToken = useNotification(state => state.token)
  const [connected, setConnected] = useState<boolean | null>(true)
  const [isLoading, setIsLoading] = useState(true)

  function verifyConnection() {
    NetInfo.addEventListener(state => {
      setConnected(state.isConnected)
    })
  }

  async function checkForCustomerData() {
    setIsLoading(true)
    const ACCESS_TOKEN = await AsyncStorage.getItem('@take-back-user-token')
    const REFRESH_TOKEN = await AsyncStorage.getItem('@take-back-refresh-token')
    const REMEMBER = await AsyncStorage.getItem('@take-back-remember')

    const visibleStoreged = await AsyncStorage.getItem(
      '@take-back-balance-visible'
    )

    if (REMEMBER && ACCESS_TOKEN && REFRESH_TOKEN) {
      if (visibleStoreged) {
        setIsBalanceVisible(JSON.parse(visibleStoreged))
      }

      API.post(`/costumer/refresh-token/${JSON.parse(REFRESH_TOKEN)}`)
        .then(async response => {
          API.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.token}`

          storeData('@take-back-user-token', response.data.token)
          storeData('@take-back-refresh-token', response.data.refreshToken)

          await saveNotificationToken(notificationToken)

          setIsSignedIn(true)
        })
        .catch(() => {
          setIsSignedIn(false)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    verifyConnection()
    checkForCustomerData()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!connected) {
    return <NotConnectedScreen />
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  )
}
