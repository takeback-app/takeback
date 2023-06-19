import React, { useCallback } from 'react'

import { Center, Flex, Icon, Spinner, Text } from 'native-base'
import { TouchableOpacity } from 'react-native'

import { Header } from '../../../components/header'
import { Ionicons } from '@expo/vector-icons'
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import { ReferralInfo } from './components/ReferralInfo'
import { useReloadList } from '../../../hooks/useReloadList'
import { Layout } from '../../../components/layout'
import { useFocusEffect } from '@react-navigation/native'
import { Referral, ReferralItem } from './components/ReferralItem'

export function Referrals({ navigation }) {
  const { data, isLoading, mutate, onRefresh, refreshing } =
    useReloadList<Referral>('costumer/referrals')

  useFocusEffect(() => {
    mutate()
  })

  const renderItem: ListRenderItem<Referral> = useCallback(
    ({ item }) => {
      return (
        <ReferralItem
          item={item}
          onDeleted={() => {
            mutate()
          }}
        />
      )
    },
    [mutate]
  )

  return (
    <Layout withoutKeyboardDismiss>
      <Header
        variant="arrow"
        title="Indicações"
        left={<CreateButton navigation={navigation} />}
        goBack={navigation.goBack}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Flex flex={1}>
          <FlashList
            data={data}
            estimatedItemSize={140}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={() => <ReferralInfo />}
          />
        </Flex>
      )}
    </Layout>
  )
}

function CreateButton({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('createReferral')}>
      <Icon as={Ionicons} name="add-circle" size="xl" color="blue.600" />
    </TouchableOpacity>
  )
}

function LoadingScreen() {
  return (
    <Center flex="1">
      <Spinner color="blue.400" size="lg" />
      <Text fontWeight="medium" fontSize="md" color="blue.400">
        Carregando...
      </Text>
    </Center>
  )
}
