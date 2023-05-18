import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import useSWR from 'swr'

import { Raffle, RaffleItem, gap, numColumns } from './RaffleItem'
import { RaffleFilter } from './tabs'
import { Flex, Text, View } from 'native-base'

export function Raffles({ route }) {
  const filter = route.params?.filter as RaffleFilter

  const { data: raffles, isLoading } = useSWR<Raffle[]>(
    `costumer/raffles/${filter}`
  )

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
        data={raffles}
        ListEmptyComponent={
          <Flex justify="center" align="center" mt={8}>
            <Text fontWeight="semibold" fontSize="md" color="coolGray.500">
              Nenhum sorteio ainda
            </Text>
          </Flex>
        }
        renderItem={({ item }) => <RaffleItem raffle={item} />}
      />
    </View>
  )
}
