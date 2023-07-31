import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  Button,
  Flex,
  HStack,
  ScrollView,
  Stack,
  Text,
  View
} from 'native-base'
import React, { useMemo } from 'react'
import { ActivityIndicator, Text as NativeText } from 'react-native'

import useSWR from 'swr'

import { AnimatedImageBox } from '../../../../components/AnimatedImageBox'
import { BottomCard } from '../../../../components/BottomCard'
import { CloseBackButton } from '../../../../components/CloseBackButton'
import { onlyDateFormat } from '../../../../utils/DateFormat'
import { maskCurrency } from '../../../../utils/masks'
import { useWithdrawal } from '../state'
import { Order } from '../types'
import moment from 'moment'

export function OrderDetail({ route, navigation }) {
  const id = route.params?.id

  const { setOrder, setCode } = useWithdrawal()

  const { data: order, isLoading } = useSWR<Order>(
    `costumer/store/orders/${id}`
  )

  function handleWithdrawal() {
    if (!order) return

    setOrder(order.id)
    setCode(order.validationCode)

    navigation.navigate('passwordConfirmation', {
      nextRoute: 'withdrawalCode'
    })
  }

  const isExpired = useMemo(() => {
    if (!order) return false

    if (order.withdrawalAt) return false

    return moment(order.product.dateLimitWithdrawal).isBefore(new Date())
  }, [order])

  if (isLoading || !order) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" />

      <ScrollView bg="white" bounces={false}>
        <AnimatedImageBox uri={order.product.imageUrl} />
        <Stack py={4} px={6} space={4}>
          <Flex direction="row" align="center" justify="space-between">
            <HStack alignItems="center">
              <MaterialCommunityIcons name="calendar" size={16} />
              <Text ml={2} fontSize="xs" fontWeight="medium">
                Disponível para retirada até{' '}
                {onlyDateFormat(order.product.dateLimitWithdrawal)}
              </Text>
            </HStack>
          </Flex>

          <Stack space={2}>
            <Text fontSize="lg" fontWeight="semibold">
              {order.quantity}x {order.product.name}
            </Text>
            <Flex>
              <Text
                lineHeight="md"
                color={'gray.800'}
                fontSize="3xl"
                fontWeight="bold"
              >
                {maskCurrency(Number(order.value))}
              </Text>
            </Flex>
          </Stack>

          {isExpired && (
            <Text color="red.600" fontWeight="semibold">
              Compra expirada
            </Text>
          )}

          {!!order.withdrawalAt && (
            <Text fontWeight="semibold">
              Compra retirada em:{' '}
              {new Date(order.withdrawalAt).toLocaleString()}
            </Text>
          )}

          {!order.withdrawalAt && !isExpired ? (
            <NativeText allowFontScaling={false}>
              <Text fontSize="xs">Você tem até dia</Text>{' '}
              <Text fontWeight="bold" fontSize="xs">
                {new Date(
                  order.product.dateLimitWithdrawal
                ).toLocaleDateString()}
              </Text>{' '}
              <Text fontSize="xs">para retirar no(a)</Text>{' '}
              <Text fontWeight="bold" fontSize="xs">
                {order.product.company.fantasyName.toUpperCase()}
              </Text>
              {'. '}
              <Text fontSize="xs">
                Passado dessa data você não poderá mais retirar o produto e
                perderá o valor pago.
              </Text>
            </NativeText>
          ) : null}
        </Stack>
      </ScrollView>

      <BottomCard>
        <Button
          onPress={handleWithdrawal}
          w="full"
          isDisabled={!!order.withdrawalAt || isExpired}
          colorScheme="blue"
          rounded="full"
          _text={{
            fontSize: 'sm',
            fontWeight: 'semibold'
          }}
        >
          Retirar
        </Button>
      </BottomCard>

      <CloseBackButton onPress={navigation.goBack} />
    </>
  )
}
