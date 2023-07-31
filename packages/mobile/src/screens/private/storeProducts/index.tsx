import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import useSWR from 'swr'

import { Product } from '../storeProductDetail/types'
import { ProductItem, gap, numColumns } from './ProductItem'
import { StoreProductFilter } from './tabs'
import { Flex, Text, View } from 'native-base'
import { useFocusEffect } from '@react-navigation/native'

export function StoreProducts({ route }) {
  const filter = route.params?.filter as StoreProductFilter

  const {
    data: products,
    isLoading,
    mutate
  } = useSWR<Product[]>(`costumer/store/products/${filter}`)

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
        data={products}
        ListEmptyComponent={
          <Flex justify="center" align="center" mt={8}>
            <Text fontWeight="semibold" fontSize="md" color="coolGray.500">
              Nenhum produto ainda
            </Text>
          </Flex>
        }
        renderItem={({ item }) => <ProductItem product={item} />}
      />
    </View>
  )
}
