import React from 'react'
import { Heading, HStack, Text, VStack } from 'native-base'

import { Layout } from '../../../../components/layout'
import { useWithdrawal } from '../state'
import { Platform, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useSWR from 'swr'

export function WithdrawalCode({ navigation }) {
  const { code, orderId, reset } = useWithdrawal()
  const { top: topHeight } = useSafeAreaInsets()

  function handleExit() {
    navigation.popToTop()
    navigation.goBack(null)
    reset()
  }

  useSWR<{ wasWithdrawal: boolean }>(
    `costumer/store/orders/${orderId}/withdrawal`,
    {
      refreshInterval: 2000,
      onSuccess(data) {
        if (!data.wasWithdrawal) return

        handleExit()
      }
    }
  )

  return (
    <Layout>
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={handleExit}>
          <MaterialCommunityIcons name="close" color="#52525b" size={24} />
        </Pressable>
      </HStack>

      <VStack flex="1" justifyContent="space-between" pb="4" px="4">
        <VStack mt="4">
          <Heading fontSize="3xl" color="gray.800" fontWeight="bold">
            Informe sua chave na retirada da compra
          </Heading>
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            Informe o código abaixo ao atendente
          </Text>

          <Text
            textAlign="center"
            fontSize="6xl"
            fontWeight="semibold"
            color="blue.600"
            mt="12"
          >
            {code}
          </Text>
        </VStack>
      </VStack>
    </Layout>
  )
}
