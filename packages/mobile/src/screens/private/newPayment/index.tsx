import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useSWR from 'swr'

import { PaymentValue } from './PaymentValue'
import { PaymentSelectMethod } from './PaymentSelectMethod'
// import { PaymentPassword } from './PaymentPassword'
import { PaymentConfirmation } from './PaymentConfirmation'
import { usePaymentStore } from './state'
import { View } from 'native-base'
import { ActivityIndicator } from 'react-native'
import { PaymentCheckout } from './PaymentCheckout'
import { QRCode } from './QRCodeScreens'
import { QRCodeSelectCompanyUser } from './QRCodeScreens/QRCodeSelectCompanyUser'

export interface Company {
  id: string
  fantasyName: string
  email: string
  phone: string
  companyAddress: {
    street: string
    number: string
    district: string
  }
  companyPaymentMethods: CompanyPaymentMethod[]
  companyUsers: CompanyUser[]
}

export interface CompanyPaymentMethod {
  id: number
  cashbackPercentage: string
  paymentMethod: {
    description: true
  }
}

export interface CompanyUser {
  id: string
  name: string
}

const Stack = createNativeStackNavigator()

export function PaymentStack({ route }) {
  const { companyId } = route.params

  const { setCompany } = usePaymentStore()

  const { isLoading } = useSWR<Company>(
    `costumer/company/find/one/${companyId}`,
    {
      onSuccess: data => {
        setCompany(data)
      }
    }
  )

  const { data, isLoading: isLoadingIntegrationType } = useSWR<{
    integrationType: string
  }>(`costumer/companies/${companyId}/integrations/type`)

  if (isLoading || isLoadingIntegrationType) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (data?.integrationType === 'QRCODE') {
    return (
      <Stack.Navigator
        initialRouteName="qrCode"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="qrCode" component={QRCode} />
        <Stack.Screen
          name="qrCodeSelectCompanyUser"
          component={QRCodeSelectCompanyUser}
        />
        <Stack.Screen
          name="paymentConfirmation"
          component={PaymentConfirmation}
        />
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator
      initialRouteName="paymentSelectMethod"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="paymentValue" component={PaymentValue} />
      <Stack.Screen
        name="paymentSelectMethod"
        component={PaymentSelectMethod}
      />

      <Stack.Screen name="paymentCheckout" component={PaymentCheckout} />
      {/* <Stack.Screen name="paymentPassword" component={PaymentPassword} /> */}
      <Stack.Screen
        name="paymentConfirmation"
        component={PaymentConfirmation}
      />
    </Stack.Navigator>
  )
}
