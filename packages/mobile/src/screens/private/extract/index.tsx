import { Center, Spinner, Text, View } from 'native-base'
import React, { useCallback, useState } from 'react'
import { StatusBar } from 'react-native'

import { FlashList, ListRenderItem } from '@shopify/flash-list'

import useSWR from 'swr'

import { Header } from '../../../components/header'
import { Layout } from '../../../components/layout'
import { EmptyComponent } from './components/EmptyComponent'

import { ExtractHeader } from './components/ExtractHeader'
import { ExtractItem, ExtractType } from './types'
import { TransactionItem } from './components/ExtractItem/TransactionItem'
import { TransferItem } from './components/ExtractItem/TransferItem'
import { BalanceExpirationItem } from './components/ExtractItem/BalanceExpirationItem'
import { BonusItem } from './components/ExtractItem/BonusItem'
import { SolicitationItem } from './components/ExtractItem/SolicitationItem'

const renderItem: ListRenderItem<ExtractItem> = ({ item }) => {
  switch (item.type) {
    case ExtractType.TRANSACTION:
      return (
        <TransactionItem {...item.data} referenceDate={item.referenceDate} />
      )
    case ExtractType.TRANSFER:
      return <TransferItem {...item.data} referenceDate={item.referenceDate} />
    case ExtractType.BALANCE_EXPIRATION:
      return (
        <BalanceExpirationItem
          {...item.data}
          referenceDate={item.referenceDate}
        />
      )
    case ExtractType.BONUS:
      return <BonusItem {...item.data} referenceDate={item.referenceDate} />
    case ExtractType.SOLICITATION:
      return (
        <SolicitationItem {...item.data} referenceDate={item.referenceDate} />
      )
    default:
      return null
  }
}

export function Extract({ navigation }) {
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: extract,
    isLoading,
    mutate
  } = useSWR<ExtractItem[]>('costumer/extract')

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await mutate()
    setRefreshing(false)
  }, [mutate])

  if (isLoading) {
    return (
      <Layout
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
          backgroundColor: '#F5F5F5'
        }}
      >
        <Header variant="arrow" title="Extrato" goBack={navigation.goBack} />
        <Center flex="1">
          <Spinner color="blue.400" size="lg" />
          <Text fontWeight="medium" fontSize="md" color="blue.400">
            Carregando histórico...
          </Text>
        </Center>
      </Layout>
    )
  }

  return (
    <Layout withoutKeyboardDismiss>
      <Header variant="arrow" title="Extrato" goBack={navigation.goBack} />

      <FlashList
        data={extract}
        estimatedItemSize={110}
        renderItem={renderItem}
        getItemType={item => item.type}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => (
          <View borderBottomWidth="1" borderColor="gray.400" />
        )}
        ListHeaderComponent={<ExtractHeader />}
        ListEmptyComponent={() => <EmptyComponent />}
      />
    </Layout>
  )
}
