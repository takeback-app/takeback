import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import useSWR from 'swr'

import { Flex, Text, View } from 'native-base'
import { Order } from '../storeProductDetail/types'
import { OrderItem, gap, numColumns } from './OrderItem'
import { useFocusEffect } from '@react-navigation/native'

export function MyOrders() {
  const {
    data: orders,
    isLoading,
    mutate
  } = useSWR<Order[]>(`costumer/store/orders`)

  useFocusEffect(() => {
    mutate()
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View
      style={{
        margin: -gap / 2,
        marginTop: gap,
        flex: 1,
        paddingHorizontal: gap / 2
      }}
    >
      <FlashList
        estimatedItemSize={210}
        numColumns={numColumns}
        data={orders}
        ListEmptyComponent={
          <Flex justify="center" align="center" mt={8}>
            <Text fontWeight="semibold" fontSize="md" color="coolGray.500">
              Nenhuma compra ainda
            </Text>
          </Flex>
        }
        renderItem={({ item }) => <OrderItem order={item} />}
      />
    </View>
  )
}
