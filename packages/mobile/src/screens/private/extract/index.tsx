import { Center, Spinner, Text, View } from 'native-base'
import React, { useCallback, useMemo, useState } from 'react'
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
import { useInfiniteSectionList } from '../../../hooks/useInfiniteSectionList'
import { InfinityScrollFooter } from '../../../components/List/InfinityScrollFooter'
import { SectionHeader } from './components/SectionHeader'

const renderItem: ListRenderItem<ExtractItem | undefined | string> = ({
  item
}) => {
  if (!item) return null

  if (typeof item === 'string') {
    return <SectionHeader text={item} />
  }

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
  const {
    data,
    isLoading,
    refreshing,
    onRefresh,
    isLoadingMore,
    isReachedEnd,
    nextPage
  } = useInfiniteSectionList<ExtractItem>('costumer/extract/paginated')

  const stickyHeaderIndices = data
    ?.map((item, index) => (typeof item === 'string' ? index : null))
    .filter(item => item !== null) as number[]

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
        data={data}
        estimatedItemSize={110}
        renderItem={renderItem}
        getItemType={item =>
          typeof item === 'string' ? 'HEADER' : item ? item.type : ''
        }
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
        stickyHeaderIndices={stickyHeaderIndices}
        ItemSeparatorComponent={() => (
          <View borderBottomWidth="1" borderColor="gray.300" />
        )}
        ListHeaderComponent={<ExtractHeader />}
        ListEmptyComponent={() => <EmptyComponent />}
      />
    </Layout>
  )
}
