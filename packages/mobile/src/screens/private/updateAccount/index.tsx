import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useSWR from 'swr'

import { FieldsPage } from './FieldsPage'
import { UpdateSuccessPage } from './UpdateSuccessPage'
import { Center } from 'native-base'
import { ActivityIndicator } from 'react-native'

const Stack = createNativeStackNavigator()

interface Data {
  fields: string[]
}

export function UpdateAccountStack() {
  const { data, isLoading } = useSWR<Data>('costumer/missing-fields', {
    revalidateOnMount: true
  })

  if (isLoading || !data) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" />
      </Center>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen
        name="fieldsPage"
        initialParams={{ fields: data.fields }}
        component={FieldsPage}
      />
      <Stack.Screen name="updateSuccessPape" component={UpdateSuccessPage} />
    </Stack.Navigator>
  )
}
