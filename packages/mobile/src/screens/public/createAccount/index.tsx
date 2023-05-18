import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StartPage } from './StartPage'
import { GetCpfPage } from './GetCpfPage'
import { GetDataPage } from './GetDataPage'
import { GetContactPage } from './GetContactPage'
import { SetPasswordPage } from './SetPasswordPage'
import { SignUpSuccess } from './SignUpSuccess'

const Stack = createNativeStackNavigator()

export function CreateAccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="startPage" component={StartPage} />
      <Stack.Screen name="getCpfPage" component={GetCpfPage} />
      <Stack.Screen name="getDataPage" component={GetDataPage} />
      <Stack.Screen name="getContactsPage" component={GetContactPage} />
      <Stack.Screen name="setPasswordPage" component={SetPasswordPage} />
      <Stack.Screen name="signUpSuccess" component={SignUpSuccess} />
    </Stack.Navigator>
  )
}
