import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './styles/ResetCSS.css'

import {
  ChakraProvider,
  createMultiStyleConfigHelpers,
  extendTheme
} from '@chakra-ui/react'

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container as HTMLElement)

const helpers = createMultiStyleConfigHelpers(['table', 'td', 'th'])

const Table = helpers.defineMultiStyleConfig({
  baseStyle: {
    td: {
      padding: '0.5rem !important'
    },
    th: {
      padding: '0.5rem !important'
    }
  }
})

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`
  },
  components: {
    Table
  }
})

root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)

reportWebVitals()
