import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/pt-br'

import AuthProvider from './contexts/AuthContext'
import AppDataProvider from './contexts/CAppData'
import DrawerProvider from './contexts/DrawerContext'
import UserProvider from './contexts/CUser'
import CompanyProvider from './contexts/CCompany'
import ConsumerProvider from './contexts/CConsumer'

import { Root } from './navigations/Root'
import { SWRConfig } from 'swr'
import { axiosFetcher } from './services/API'

const App: React.FC<React.PropsWithChildren<unknown>> = () => {
  moment.locale('pt-br')

  return (
    <BrowserRouter>
      <AuthProvider>
        <SWRConfig value={{ fetcher: axiosFetcher }}>
          <AppDataProvider>
            <UserProvider>
              <CompanyProvider>
                <ConsumerProvider>
                  <DrawerProvider>
                    <Root />
                  </DrawerProvider>
                </ConsumerProvider>
              </CompanyProvider>
            </UserProvider>
          </AppDataProvider>
        </SWRConfig>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
