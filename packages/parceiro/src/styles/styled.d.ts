import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string

    colors: {
      'white-100': string
      'white-300': string
      'blue-500': string
      'blue-600': string
      'blue-700': string
      'slate-600': string
      'slate-300': string
      'gray-300': string
      'gray-600': string
      'gray-700': string
      'gray-900': string
      'red-400': string
      'red-500': string
      'green-500': string
      'green-600': string
      'yellow-400': string
    }

    breakpoints: {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
    }

    shadows: {
      sm: string
      md: string
      lg: string
    }
  }
}
