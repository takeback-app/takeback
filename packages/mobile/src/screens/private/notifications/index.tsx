import React from 'react'
import { StatusBar } from 'react-native'
import { Center, Flex, Spinner, Text } from 'native-base'

import { FlashList, ListRenderItem } from '@shopify/flash-list'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { NotificationItem, Notification } from './components/notification'
import { InfinityScrollFooter } from '../../../components/List/InfinityScrollFooter'
import { useInfiniteList } from '../../../hooks/useInfiniteList'
import { EmptyComponent } from '../../../components/List/EmptyComponent'

const renderItem: ListRenderItem<Notification> = ({ item }) => {
  return <NotificationItem notification={item} />
}

export function Notifications({ navigation }) {
  const {
    data,
    isLoading,
    isLoadingMore,
    isReachedEnd,
    nextPage,
    onRefresh,
    refreshing
  } = useInfiniteList<Notification>('costumer/notifications')

  if (isLoading || !data) {
    return (
      <Layout
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: 'white'
        }}
      >
        <Header
          variant="arrow"
          title="Notificações"
          goBack={navigation.goBack}
        />
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
      <Header variant="arrow" title="Notificações" goBack={navigation.goBack} />

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
          ListFooterComponent={
            <InfinityScrollFooter isLoadingMore={!!isLoadingMore} />
          }
          ListEmptyComponent={() => (
            <EmptyComponent text="Nenhuma notificação" />
          )}
        />
      </Flex>
    </Layout>
  )
}
