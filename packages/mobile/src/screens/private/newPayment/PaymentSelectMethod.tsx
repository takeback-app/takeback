/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'

import {
  Flex,
  HStack,
  Heading,
  IconButton,
  Pressable,
  Radio,
  ScrollView,
  Text
} from 'native-base'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { usePaymentStore } from './state'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { percentageFormatter } from '../../../utils/masks'
import { Platform } from 'react-native'

export function PaymentSelectMethod({ navigation }) {
  const { company, paymentMethodId, setPaymentMethodId } = usePaymentStore()

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  async function handleSubmit() {
    navigation.navigate('paymentCheckout')
  }

  return (
    <Flex flex={1} bg="white">
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#52525b" size={24} />
        </Pressable>
      </HStack>

      <Flex px={4} pb={bottomHeight} flex={1} mt={2}>
        <Heading fontSize="26" fontWeight="semibold">
          Qual é o método de pagamento utilizado?
        </Heading>
        <Text color="gray.600" mt="3">
          Selecione na lista o método de pagamento
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false} mt={8}>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="favorite number"
            onChange={v => {
              setPaymentMethodId(Number(v))
            }}
          >
            {company.companyPaymentMethods?.map(
              ({ id, cashbackPercentage, paymentMethod }) => (
                <Radio key={id} value={String(id)} my={4}>
                  <Flex>
                    <Text fontWeight="bold" fontSize="md">
                      {paymentMethod.description}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                      {percentageFormatter(cashbackPercentage)} de volta
                    </Text>
                  </Flex>
                </Radio>
              )
            )}
          </Radio.Group>
        </ScrollView>

        <Flex flex={1} minH={1} pb={4} justify="flex-end" align="flex-end">
          <IconButton
            size="lg"
            p={4}
            isDisabled={!paymentMethodId}
            variant="solid"
            colorScheme="blue"
            rounded="full"
            _icon={{
              as: Feather,
              name: 'arrow-right',
              size: 6
            }}
            onPress={handleSubmit}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
