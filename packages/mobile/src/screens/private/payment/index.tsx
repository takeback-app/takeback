import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PaymentConfirmation } from './PaymentConfirmation'
import { PaymentPassword } from './PaymentPassword'
import { PaymentSelectCompany } from './PaymentSelectCompany'
import { PaymentValue } from './PaymentValue'
import { PaymentCheckout } from './PaymentCheckout'

const Stack = createNativeStackNavigator()

export function TakebackPaymentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="paymentValue" component={PaymentValue} />
      <Stack.Screen
        name="paymentSelectCompany"
        component={PaymentSelectCompany}
      />
      <Stack.Screen name="paymentCheckout" component={PaymentCheckout} />
      <Stack.Screen name="paymentPassword" component={PaymentPassword} />
      <Stack.Screen
        name="paymentConfirmation"
        component={PaymentConfirmation}
      />
    </Stack.Navigator>
  )
}
