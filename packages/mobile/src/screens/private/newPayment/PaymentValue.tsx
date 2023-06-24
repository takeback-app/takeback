import React, { useContext } from 'react'

import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { Flex, HStack, Heading, IconButton, Pressable, Text } from 'native-base'
import { MaskedTextInput } from 'react-native-mask-text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Layout } from '../../../components/layout'
import { UserDataContext } from '../../../contexts/UserDataContext'
import { masks } from '../../../utils'
import { CompanyInfo } from './components/CompanyInfo'
import { usePaymentStore } from './state'

export function PaymentValue({ navigation }) {
  const { balance } = useContext(UserDataContext)

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const { setTotalAmount, totalAmount } = usePaymentStore()

  return (
    <Layout>
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
            <Feather name="chevron-left" color="#52525b" size={24} />
          </Pressable>
          <Text mt={1} fontSize="md" fontWeight="semibold">
            Solicitação de cashback
          </Text>
        </HStack>

        <Flex px={4} pb={bottomHeight} flex={1} mt={4}>
          <Flex>
            <Heading fontSize="26" fontWeight="semibold">
              Qual é o valor da{'\n'}compra?
            </Heading>

            <Text color="gray.600" fontWeight="medium" mt="3">
              Saldo disponível em conta {masks.maskCurrency(balance)}
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

            <CompanyInfo />
          </Flex>
          <Flex flex={1} pb={4} justify="flex-end" align="flex-end">
            <IconButton
              size="lg"
              p={4}
              isDisabled={!totalAmount}
              variant="solid"
              colorScheme="blue"
              rounded="full"
              _icon={{
                as: MaterialCommunityIcons,
                name: 'arrow-right',
                size: 6
              }}
              onPress={() => navigation.navigate('paymentCheckout')}
            />
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </Layout>
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
