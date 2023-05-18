import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Center, Flex, Pressable, ScrollView, Text, View } from 'native-base'
import useSWR from 'swr'
import { ActivityIndicator, Platform } from 'react-native'
import { dateFormat, getInitials, masks } from '../../../utils'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Transfer {
  consumerName: string
  isReceived: boolean
  createdAt: string
  value: number
}

export function TransferDetails({ route, navigation }) {
  const id = route.params?.id

  const { top: topHeight } = useSafeAreaInsets()

  const { data: transfer, isLoading } = useSWR<Transfer>(
    `costumer/extract/transfers/${id}`
  )

  function handleAmount() {
    if (!transfer) return ''

    if (transfer.isReceived) {
      return `+ ${masks.maskCurrency(transfer.value)}`
    }

    return `- ${masks.maskCurrency(transfer.value)}`
  }

  if (isLoading || !transfer) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <ScrollView bg="white" bounces={false}>
        <Center p="4" pt={8}>
          <Flex
            justifyContent="center"
            alignItems="center"
            w="24"
            h="24"
            rounded="full"
            bgColor="gray.400"
          >
            <Text fontWeight="semibold" fontSize="2xl" color="gray.800">
              {getInitials(transfer.consumerName)}
            </Text>
          </Flex>

          <Text
            fontWeight="semibold"
            fontSize="xl"
            color="gray.800"
            textTransform="uppercase"
            textAlign="center"
            numberOfLines={2}
            mt="4"
          >
            {transfer.consumerName}
          </Text>
          <Text
            fontWeight="medium"
            fontSize="sm"
            color="gray.600"
            textTransform="uppercase"
            textAlign="center"
          >
            {transfer.isReceived
              ? 'Transferência recebida'
              : 'Transferência enviada'}
          </Text>
          <Text
            fontWeight="medium"
            fontSize="sm"
            color="gray.600"
            textAlign="center"
          >
            {dateFormat(transfer.createdAt)}
          </Text>
          <Text
            fontWeight="semibold"
            fontSize="3xl"
            color="gray.800"
            textTransform="uppercase"
            textAlign="center"
            mt="12"
          >
            {handleAmount()}
          </Text>
        </Center>
      </ScrollView>

      <Pressable
        position="absolute"
        left={4}
        style={{ top: Platform.OS === 'ios' ? 16 : topHeight + 16 }}
        onPress={navigation.goBack}
      >
        <MaterialCommunityIcons name="close" color="#52525b" size={24} />
      </Pressable>
    </>
  )
}
