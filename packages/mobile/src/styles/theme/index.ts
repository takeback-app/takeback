import { extendTheme } from 'native-base'

export const theme = extendTheme({
  components: {
    Heading: {
      defaultProps: {
        allowFontScaling: false
      }
    },
    Text: {
      defaultProps: {
        allowFontScaling: false
      }
    },
    TextInput: {
      defaultProps: {
        allowFontScaling: false
      }
    },
    Input: {
      defaultProps: {
        allowFontScaling: false
      }
    }
  },
  fontConfig: {
    Montserrat: {
      100: {
        normal: 'Montserrat_100Thin'
      },
      200: {
        normal: 'Montserrat_200ExtraLight'
      },
      300: {
        normal: 'Montserrat_300Light'
      },
      400: {
        normal: 'Montserrat_400Regular'
      },
      500: {
        normal: 'Montserrat_500Medium'
      },
      600: {
        normal: 'Montserrat_600SemiBold'
      },
      700: {
        normal: 'Montserrat_700Bold'
      },
      800: {
        normal: 'Montserrat_800ExtraBold'
      }
    }
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Montserrat'
  },
  colors: {
    blue: {
      300: '#8EC5F0',
      600: '#449FE7',
      700: '#0984E3',
      800: '#1566A6',
      900: '#0F4774'
    },
    gray: {
      100: '#FFFFFF',
      200: '#FAFAFA',
      300: '#F5F5F5',
      400: '#CDCDCD',
      600: '#838383',
      800: '#333333'
    },
    red: {
      400: '#ff6666',
      500: '#EF4444'
    },
    yellow: {
      500: '#F2C715'
    },
    black: {
      900: '#000000'
    }
  }
})

type CustomThemeType = typeof theme

declare module 'native-base' {
  type ICustomTheme = CustomThemeType
}
