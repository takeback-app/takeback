import React, { useState } from 'react'

import { Feather } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { Center, Flex, HStack, Text } from 'native-base'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AlertComponent } from '../../../components/alert'
import { CodeFields } from '../../../components/input/CodeFields'
import { checkPassword, createPaymentSolicitation } from '../../../services'
import { usePaymentStore } from './state'
import { StackActions } from '@react-navigation/native'

export function PaymentPassword({ navigation }) {
  const { totalAmount, paymentMethodId, company } = usePaymentStore()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { bottom: bottomHeight } = useSafeAreaInsets()

  async function handleSubmit() {
    setIsLoading(true)

    if (!paymentMethodId || !company) {
      setIsLoading(false)

      return setError('Por favor, tente novamente mais tarde.')
    }

    const [isPasswordOk, passwordData] = await checkPassword(password)

    if (!isPasswordOk) {
      setIsLoading(false)

      return setError(passwordData.message)
    }

    const [isGenerateOk, generateData] = await createPaymentSolicitation({
      value: totalAmount,
      companyPaymentMethodId: paymentMethodId,
      companyId: company.id
    })

    if (!isGenerateOk) {
      setIsLoading(false)

      return setError(generateData.message)
    }

    navigation.dispatch(StackActions.replace('paymentConfirmation'))
  }

  if (isLoading) {
    return (
      <Center flex={1} bg="white">
        <ActivityIndicator size="large" color="#449FE7" />
      </Center>
    )
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        keyboardVerticalOffset={bottomHeight + 8}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style="light" />
        <HStack p={4}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" color="#52525b" size={24} />
          </Pressable>
        </HStack>

        <Flex px={4} pb={bottomHeight} flex={1} mt={2}>
          <Text fontSize="xl" fontWeight="bold">
            <Text fontWeight="medium">Digite a </Text>
            <Text color="blue.700">senha de 6 dígitos da sua conta</Text>
          </Text>

          <Flex flex={1} px={2} justify="center">
            <CodeFields
              onBlur={handleSubmit}
              autoFocus={true}
              setValue={setPassword}
              value={password}
            />
          </Flex>

          <AlertComponent
            status="error"
            title="Houve um erro"
            message={error}
            showAlert={!!error}
            closeAlert={() => setError('')}
          />
        </Flex>
      </KeyboardAvoidingView>
    </>
  )
}
