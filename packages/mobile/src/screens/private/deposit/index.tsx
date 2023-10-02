import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { DepositConfirmation } from './DepositConfirmation'
import { DepositPassword } from './DepositPassword'
import { DepositValue } from './DepositValue'
import { DepositCheckout } from './DepositCheckout'

const Stack = createNativeStackNavigator()

export function DepositStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="depositValue" component={DepositValue} />
      {/* <Stack.Screen
        name="paymentSelectCompany"
        component={PaymentSelectCompany}
      /> */}
      <Stack.Screen name="depositCheckout" component={DepositCheckout} />
      <Stack.Screen name="depositPassword" component={DepositPassword} />
      <Stack.Screen
        name="depositConfirmation"
        component={DepositConfirmation}
      />
    </Stack.Navigator>
  )
}
