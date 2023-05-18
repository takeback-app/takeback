/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import App from './App'
import reportWebVitals from './reportWebVitals'

import './styles/ResetCSS.css'

const container = document.getElementById('root')

const root = createRoot(container!)

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
  }
})

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)

reportWebVitals()
