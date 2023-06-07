import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './styles/ResetCSS.css'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container as HTMLElement)

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
  }
})

root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)

reportWebVitals()
