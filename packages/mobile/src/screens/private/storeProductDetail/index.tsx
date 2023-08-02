import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ProductDetail } from './pages/ProductDetail'
import { PasswordConfirmation } from './pages/PasswordConfirmation'
import { PurchaseConfirmation } from './pages/PurchaseConfirmation'

const Stack = createNativeStackNavigator()

export function ProductDetailStack({ route }) {
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
        component={ProductDetail}
      />
      <Stack.Screen
        name="passwordConfirmation"
        component={PasswordConfirmation}
      />
      <Stack.Screen
        name="storePurchaseConfirmation"
        component={PurchaseConfirmation}
      />
    </Stack.Navigator>
  )
}
