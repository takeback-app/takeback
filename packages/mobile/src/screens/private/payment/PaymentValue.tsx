import React, { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native'

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'

import { Flex, HStack, Heading, IconButton, Pressable, Text } from 'native-base'

import { MaskedTextInput } from 'react-native-mask-text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useSWR from 'swr'

import { masks } from '../../../utils'
import { usePaymentStore } from './state'
import { validateBalance } from '../../../services'
import { AlertComponent } from '../../../components/alert'

export function PaymentValue({ navigation }) {
  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { setTotalAmount, totalAmount } = usePaymentStore()

  const { data } = useSWR<{ freeBalance: number }>(
    'costumer/balance/payment-free'
  )

  async function handleNext() {
    setIsLoading(true)
    setError('')

    const [isOk, response] = await validateBalance(totalAmount)

    setIsLoading(false)

    if (!isOk) {
      return setError(response.message)
    }

    navigation.navigate('paymentSelectCompany')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={bottomHeight + 8}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
        alignItems="center"
        justifyContent="center"
      >
        <Pressable
          position="absolute"
          left="4"
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" color="#52525b" size={24} />
        </Pressable>
        <Text mt={1} fontSize="md" fontWeight="semibold">
          Pagar
        </Text>
      </HStack>

      <Flex px={4} pb={bottomHeight} flex={1} mt={4}>
        <Flex>
          <Heading fontSize="26" fontWeight="semibold">
            Qual é o valor do{'\n'}pagamento?
          </Heading>

          <Text color="gray.600" fontWeight="medium" mt="3">
            Saldo disponível em conta{' '}
            {masks.maskCurrency(data?.freeBalance || 0)}
          </Text>

          <MaskedTextInput
            keyboardAppearance="light"
            type="currency"
            options={{
              prefix: 'R$ ',
              decimalSeparator: ',',
              groupSeparator: '.',
              precision: 2
            }}
            maxLength={16}
            autoFocus={true}
            onChangeText={(_, rawText) => {
              setTotalAmount(Number(rawText) / 100)
            }}
            style={styles.input}
            keyboardType="numeric"
            selectionColor="#449FE7"
          />
          <Flex mt={4}>
            <AlertComponent
              status="warning"
              title="Não foi possível continuar"
              message={error}
              showAlert={!!error}
              closeAlert={() => setError('')}
            />
          </Flex>
        </Flex>
        <Flex flex={1} pb={4} justify="flex-end" align="flex-end">
          <IconButton
            size="lg"
            p={isLoading ? '25px' : 4}
            isDisabled={!totalAmount || isLoading}
            variant="solid"
            colorScheme="blue"
            rounded="full"
            icon={isLoading ? <ActivityIndicator /> : undefined}
            _icon={{
              as: Feather,
              name: 'arrow-right',
              size: 6
            }}
            onPress={handleNext}
          />
        </Flex>
      </Flex>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#e4e4e7',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 32,
    marginTop: 32,
    paddingBottom: 4
  }
})
