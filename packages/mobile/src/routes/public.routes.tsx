import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PublicRouteParam } from '../@types/routes'

const { Group, Navigator, Screen } =
  createNativeStackNavigator<PublicRouteParam>()

import { Welcome } from '../screens/public/welcome'
import { SignIn } from '../screens/public/signIn'
import { SignInPassword } from '../screens/public/signInPassword'
import { ForgotPasswordStart } from '../screens/public/forgotPasswordStart'
import { ForgotPasswordGetCpf } from '../screens/public/forgotPasswordGetCpf'
import { ForgotPasswordSuccess } from '../screens/public/forgotPasswordSuccess'
import { CreateAccountStack } from '../screens/public/createAccount'

export function PublicRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Group>
        <Screen name="welcome" component={Welcome} />
        <Screen name="signIn" component={SignIn} />
        <Screen name="signInPassword" component={SignInPassword} />
      </Group>
      <Group>
        <Screen name="createAccount" component={CreateAccountStack} />
      </Group>
      <Group>
        <Screen name="forgotPasswordStart" component={ForgotPasswordStart} />
        <Screen name="forgotPasswordGetCpf" component={ForgotPasswordGetCpf} />
        <Screen
          name="forgotPasswordSuccess"
          component={ForgotPasswordSuccess}
          options={{ gestureEnabled: false }}
        />
      </Group>
    </Navigator>
  )
}
