/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts
} from '@expo-google-fonts/montserrat'
import * as Notifications from 'expo-notifications'
import * as SplashScreen from 'expo-splash-screen'
import moment from 'moment'
import 'moment/locale/pt-br'
import { NativeBaseProvider } from 'native-base'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import AuthProvider from './src/contexts/AuthContext'
import ExtractDataContext from './src/contexts/ExtractDataContext'
import UserDataContext from './src/contexts/UserDataContext'
import { RootNavigation } from './src/routes'

import { SWRConfig } from 'swr'
import { API, axiosFetcher } from './src/services/API'
import { useNotification } from './src/stores/useNotification'
import { theme } from './src/styles/theme'
import { cacheImages } from './src/utils/cache'
import { initFocus } from './src/utils/initFocus'
import { registerForPushNotificationsAsync } from './src/utils/notifications'
import * as Application from 'expo-application'

moment.locale('pt-BR')

SplashScreen.preventAutoHideAsync()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowAlert: true,
    shouldShowList: true
  })
})

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false)
  const setToken = useNotification(state => state.setToken)
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold
  })

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()

    const imageAssets = cacheImages([
      require('./assets/img/bg.png'),
      require('./assets/logos/cemig-logo.png'),
      require('./assets/logos/igreen-energy-logo.png')
    ])

    loadResourcesAndDataAsync()

    async function loadResourcesAndDataAsync() {
      try {
        const token = await registerForPushNotificationsAsync()

        setToken(token)

        await Promise.all([...imageAssets])
        await API.post('costumer/app-version', {
          appVersion: Application.nativeApplicationVersion
        })
      } catch (e) {
        // console.warn(e)
      } finally {
        setAppIsReady(true)
        SplashScreen.hideAsync()
      }
    }
  }, [setToken])

  if (!fontsLoaded || !appIsReady) {
    return null
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserDataContext>
          <ExtractDataContext>
            <NativeBaseProvider theme={theme}>
              <SWRConfig
                value={{
                  fetcher: axiosFetcher,
                  provider: () => new Map(),
                  isVisible: () => true,
                  initFocus
                }}
              >
                <RootNavigation />
              </SWRConfig>
            </NativeBaseProvider>
          </ExtractDataContext>
        </UserDataContext>
      </GestureHandlerRootView>
    </AuthProvider>
  )
}

export default App
