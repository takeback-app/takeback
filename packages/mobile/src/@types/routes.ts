import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type PublicRouteParam = {
  welcome: undefined
  signIn: undefined
  signInPassword: {
    cpf: string
  }
  createAccount: undefined
  forgotPasswordStart: undefined
  forgotPasswordGetCpf: undefined
  forgotPasswordSuccess: undefined
}

export type PrivateRouteParam = {
  askPassword: undefined
  home: undefined
  profile: undefined
  profileData: undefined
  profileEmail: undefined
  profileEmailVerify: undefined
  profilePhone: undefined
  notifications: undefined
  extract: undefined
  extractDetails: undefined
  paymentValue: undefined
  qrcode: undefined
  paymentPassword: {
    value?: number
  }
  paymentCode: {
    code?: number
    transactionId?: number
  }
  transferStart: undefined
  transferUser: undefined
  transferValue: {
    userId?: string
    userName?: string
  }
  transferConfirmation: {
    userId?: string
    userName?: string
    value?: number
  }
  transferPassword: {
    userId?: string
    userName?: string
    value?: number
  }
  transferSuccess: {
    userName?: string
    value?: number
  }
  recommendationStart: undefined
  raffles: undefined
  raffleTickets: undefined
  raffleRules: undefined
  raffleDetail: {
    id: string
  }
  storeProducts: undefined
  productDetail: {
    id: string
  }
  orderDetail: {
    id: string
  }
  transactionDetails: {
    id: number
  }
  transferDetails: {
    id: number
  }
  companyDetails: {
    companyId?: string
  }
  balanceSaved: undefined
  newPayment: undefined
  takebackPayment: undefined
  deposit: undefined
  electricDiscount: undefined

  referrals: undefined
  createReferral: undefined
}

export type PublicRouteProps<T extends keyof PublicRouteParam> =
  NativeStackScreenProps<PublicRouteParam, T>

export type PrivateRouteProps<T extends keyof PrivateRouteParam> =
  NativeStackScreenProps<PrivateRouteParam, T>

// type ScreenNavigationProp<T extends keyof SignUpStackParamList> =
//   StackNavigationProp<SignUpStackParamList, T>

// type ScreenRouteProp<T extends keyof SignUpStackParamList> = RouteProp<
//   SignUpStackParamList,
//   T
// >

// export type Props<T extends keyof SignUpStackParamList> = {
//   route: ScreenRouteProp<T>
//   navigation: ScreenNavigationProp<T>
// }
