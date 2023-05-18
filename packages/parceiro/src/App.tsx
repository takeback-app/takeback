import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import moment from 'moment'
import 'moment/locale/pt-br'
import theme from './styles/themes/light'

import AuthProvider from './contexts/AuthContext'
import CashbacksProvider from './contexts/CCashbacks'
import CData from './contexts/CData'
import DrawerProvider from './contexts/DrawerContext'

import { Root } from './navigations/Root'
import { SWRConfig } from 'swr'
import { axiosFetcher } from './services/API'

export default function App() {
  moment.locale('pt-br')

  return (
    <ThemeProvider theme={theme}>
      <SWRConfig value={{ fetcher: axiosFetcher }}>
        <CData>
          <BrowserRouter>
            <AuthProvider>
              <DrawerProvider>
                <CashbacksProvider>
                  <Root />
                </CashbacksProvider>
              </DrawerProvider>
            </AuthProvider>
          </BrowserRouter>
        </CData>
      </SWRConfig>
    </ThemeProvider>
  )
}
