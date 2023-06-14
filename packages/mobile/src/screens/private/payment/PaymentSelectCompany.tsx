import React, { useContext, useMemo, useState } from 'react'

import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import {
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  Pressable,
  Text,
  View
} from 'native-base'

import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UserDataContext } from '../../../contexts/UserDataContext'
import { useCompanies } from '../../../stores/useCompanies'
import { maskCurrency } from '../../../utils/masks'
import { CompanyItem } from './components/CompanyItem'
import { usePaymentStore } from './state'
import { Layout } from '../../../components/layout'

export function PaymentSelectCompany({ navigation }) {
  const { userData } = useContext(UserDataContext)
  const totalAmount = usePaymentStore(state => state.totalAmount)
  const companies = useCompanies(state => state.companies)

  const [search, setSearch] = useState('')
  const [isSearchInputFocus, setIsSearchInputFocus] = useState(false)

  const filteredCompanies = useMemo(
    () =>
      companies
        .filter(c => c.fantasyName.toLowerCase().includes(search.toLowerCase()))
        .sort(a =>
          a.companyAddress.city.name === userData.address.city.name ? -1 : 1
        ),
    [companies, userData, search]
  )

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  function goToNextPage() {
    navigation.navigate('paymentCheckout')
  }

  return (
    <Layout>
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" color="#52525b" size={24} />
        </Pressable>
      </HStack>

      <Flex px={4} mt={2}>
        <Flex display={isSearchInputFocus ? 'none' : 'flex'}>
          <Heading fontSize="26" fontWeight="semibold">
            Para qual empresa você quer pagar {maskCurrency(totalAmount)}?
          </Heading>
          <Text color="gray.600" fontSize="md" mt="3">
            Selecione na lista a empresa
          </Text>
        </Flex>

        <Flex mt={isSearchInputFocus ? 4 : 8} mb={8}>
          <FormControl>
            <FormControl.Label display={isSearchInputFocus ? 'flex' : 'none'}>
              <Text fontWeight="semibold" color="gray.600">
                Nome da empresa
              </Text>
            </FormControl.Label>
            <Input
              variant="underlined"
              fontSize="lg"
              keyboardAppearance="light"
              onFocus={() => setIsSearchInputFocus(true)}
              onBlur={() => setIsSearchInputFocus(false)}
              fontWeight="semibold"
              placeholder={isSearchInputFocus ? '' : 'Nome da empresa'}
              placeholderTextColor="#BBB"
              colorScheme="blue"
              borderBottomWidth="2"
              value={search}
              onChangeText={setSearch}
              borderBottomColor="#EEE"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              _input={{
                selectionColor: '#449FE7',
                cursorColor: '#449FE7',
                pb: '10px'
              }}
            />
          </FormControl>
        </Flex>
      </Flex>
      <Flex pb={bottomHeight} flex={1} mt="4">
        <Text ml={4} mb={2} fontWeight="semibold" color="gray.600">
          {!!search ? 'Resultados' : 'Todas empresas'}
        </Text>
        <FlashList
          data={filteredCompanies}
          estimatedItemSize={140}
          renderItem={({ item }) => (
            <CompanyItem onPress={goToNextPage} company={item} />
          )}
          ItemSeparatorComponent={() => (
            <View borderBottomWidth="1" borderColor="gray.400" />
          )}
        />
      </Flex>
    </Layout>
  )
}
