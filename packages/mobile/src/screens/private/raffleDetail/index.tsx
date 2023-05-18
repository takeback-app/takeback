import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RaffleDetail } from './pages/RaffleDetail'
import { PasswordConfirmation } from './pages/PasswordConfirmation'
import { RaffleCode } from './pages/RaffleCode'

const Stack = createNativeStackNavigator()

export function RaffleDetailStack({ route }) {
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
        component={RaffleDetail}
      />
      <Stack.Screen
        name="passwordConfirmation"
        component={PasswordConfirmation}
      />
      <Stack.Screen name="raffleCode" component={RaffleCode} />
    </Stack.Navigator>
  )
}
