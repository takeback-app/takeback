import React from 'react'
import { StatusBar } from 'react-native'

import { Center, Flex, Spinner, Text, View } from 'native-base'
import { FlashList, ListRenderItem } from '@shopify/flash-list'

import { Ticket, TicketItem } from './TicketItem'

import { Header } from '../../../components/header'
import { Layout } from '../../../components/layout'
import { EmptyComponent } from '../../../components/List/EmptyComponent'
import { InfinityScrollFooter } from '../../../components/List/InfinityScrollFooter'
import { useInfiniteList } from '../../../hooks/useInfiniteList'

const renderItem: ListRenderItem<Ticket> = ({ item }) => {
  return <TicketItem ticket={item} />
}

export function RaffleTickets({ navigation }) {
  const {
    data,
    isLoading,
    isLoadingMore,
    isReachedEnd,
    nextPage,
    onRefresh,
    refreshing
  } = useInfiniteList<Ticket>('costumer/tickets')

  if (isLoading || !data) {
    return (
      <Layout
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight
        }}
      >
        <Header variant="arrow" title="Cupons" goBack={navigation.goBack} />
        <Center flex="1">
          <Spinner color="blue.400" size="lg" />
          <Text fontWeight="medium" fontSize="md" color="blue.400">
            Carregando...
          </Text>
        </Center>
      </Layout>
    )
  }

  return (
    <Layout withoutKeyboardDismiss>
      <Flex>
        <Header variant="arrow" title="Cupons" goBack={navigation.goBack} />
      </Flex>

      <Flex flex={1}>
        <FlashList
          data={data}
          estimatedItemSize={140}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={() => {
            if (isReachedEnd) return

            nextPage()
          }}
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={() => (
            <View borderBottomWidth="1" borderColor="gray.400" />
          )}
          ListFooterComponent={
            <InfinityScrollFooter isLoadingMore={!!isLoadingMore} />
          }
          ListEmptyComponent={() => <EmptyComponent text="Nenhum cupom" />}
        />
      </Flex>
    </Layout>
  )
}
