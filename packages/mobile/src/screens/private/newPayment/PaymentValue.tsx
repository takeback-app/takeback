import React, { useContext, useMemo } from 'react'

import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Pressable,
  Stack,
  Text
} from 'native-base'
import { MaskedTextInput, mask } from 'react-native-mask-text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UserDataContext } from '../../../contexts/UserDataContext'
import { createWhatsAppMessage, masks } from '../../../utils'
import { usePaymentStore } from './state'

export function PaymentValue({ navigation }) {
  const { balance } = useContext(UserDataContext)

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const { setTotalAmount, totalAmount, company } = usePaymentStore()

  const address = useMemo(() => {
    if (!company?.companyAddress) return

    const { district, number, street } = company.companyAddress

    return [street, number, district].filter(i => i).join(', ')
  }, [company])

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

          <Stack mt={8} alignItems="center">
            <Text
              color="gray.800"
              textAlign="center"
              textTransform="capitalize"
              fontWeight="bold"
            >
              {company.fantasyName}
            </Text>
            {address ? (
              <Text
                color="gray.600"
                textAlign="center"
                textTransform="capitalize"
                fontWeight="medium"
              >
                {address}
              </Text>
            ) : null}
            <Text
              color="gray.600"
              textAlign="center"
              textTransform="lowercase"
              fontWeight="medium"
            >
              {company.email}
            </Text>

            <Text
              color="gray.600"
              textAlign="center"
              textTransform="lowercase"
              fontWeight="medium"
            >
              {mask(company.phone, '(99) 99999-9999')}
            </Text>
            <Button
              size="md"
              mt={4}
              bgColor="#128C7E"
              _pressed={{ bgColor: '#128c7ed8' }}
              rounded="full"
              leftIcon={
                <Icon
                  color="white"
                  as={Ionicons}
                  name="logo-whatsapp"
                  size="4"
                />
              }
              onPress={() => createWhatsAppMessage(company.phone)}
            >
              Fale com a empresa
            </Button>
          </Stack>
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
            onPress={() => navigation.navigate('paymentSelectMethod')}
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
