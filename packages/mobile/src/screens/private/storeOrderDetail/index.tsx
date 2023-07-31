import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { OrderDetail } from './pages/OrderDetail'
import { PasswordConfirmation } from './pages/PasswordConfirmation'
import { WithdrawalCode } from './pages/WithdrawalCode'

const Stack = createNativeStackNavigator()

export function OrderDetailStack({ route }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen
        name="index"
        initialParams={{ id: route.params.id }}
        component={OrderDetail}
      />
      <Stack.Screen
        name="passwordConfirmation"
        component={PasswordConfirmation}
      />
      {/* <Stack.Screen
        name="withdrawalConfirmation"
        component={WithdrawalConfirmation}
      /> */}
      <Stack.Screen name="withdrawalCode" component={WithdrawalCode} />
    </Stack.Navigator>
  )
}
