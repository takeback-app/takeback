import React, { useEffect } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import useSWR from 'swr'

import { FieldsPage } from './FieldsPage'
import { UpdateSuccessPage } from './UpdateSuccessPage'
import { Center } from 'native-base'
import { ActivityIndicator } from 'react-native'
import { useStorage } from '../../../hooks/useStorage'

const Stack = createNativeStackNavigator()

interface Data {
  fields: string[]
}

export function UpdateAccountStack() {
  const { setAccountUpdate } = useStorage()

  const { data, isLoading } = useSWR<Data>('costumer/missing-fields', {
    revalidateOnMount: true
  })

  useEffect(() => {
    if (data?.fields.length === 0) {
      setAccountUpdate(true)
    }
  }, [data, setAccountUpdate])

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
