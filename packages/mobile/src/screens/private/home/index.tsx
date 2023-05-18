import React, { useContext, useState } from 'react'
import { SectionList } from 'react-native'
import { View, useDisclose } from 'native-base'

import useSWR from 'swr'

import { StatusBar } from 'expo-status-bar'

import { CompaniesEmptyComponent } from './components/companiesEmptyComponent'
import { CompanyItem } from './components/CompanyItem'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FilterCompanySection } from './components/FilterCompanySection'
import { HeaderList } from './components/HeaderList'
import { UserDataTypes } from '../../../types/responseApi/UserDataTypes'
import { UserDataContext } from '../../../contexts/UserDataContext'
import { FilterComponent } from './components/filterComponent'
import {
  CompanyData,
  filterCompanies,
  useCompanies
} from '../../../stores/useCompanies'

const loadingCompanies = [
  { id: 0, isLoading: true },
  { id: 1, isLoading: true },
  { id: 2, isLoading: true },
  { id: 3, isLoading: true }
] as unknown as CompanyData[]

type DataHomeResponse = {
  totalSaved: number | null
  companyData: CompanyData[]
  consumerData: UserDataTypes
  expireBalanceDate: string
}

export function Home({ navigation }) {
  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  const { setUserData, setBalanceExpireDate } = useContext(UserDataContext)

  const { isOpen, onOpen, onClose } = useDisclose()

  const [refreshing, setRefreshing] = useState(false)

  const { filteredCompanies } = useCompanies()

  async function onRefresh() {
    setRefreshing(true)

    mutate()
  }

  function onSuccess({
    totalSaved,
    consumerData,
    companyData,
    expireBalanceDate
  }: DataHomeResponse) {
    setRefreshing(false)

    if (expireBalanceDate) {
      setBalanceExpireDate(new Date(expireBalanceDate))
    }

    setUserData({ ...consumerData, totalSaved: totalSaved ?? 0 })

    const cityName = consumerData.address.city.name

    useCompanies.setState({
      selectedCityName: cityName,
      companies: companyData,
      filteredCompanies: filterCompanies(companyData, cityName)
    })
  }

  const { isValidating, mutate } = useSWR<DataHomeResponse>(
    'costumer/data/home',
    { onSuccess }
  )

  function navigateToCompanyDetails(companyId: string) {
    navigation.navigate('newPayment', { companyId })
  }

  return (
    <View flex={1} mt={`${topHeight}px`}>
      <StatusBar style="dark" />
      <SectionList
        stickySectionHeadersEnabled
        sections={[
          {
            title: 'Empresas parceiras',
            data: isValidating ? loadingCompanies : filteredCompanies
          }
        ]}
        keyExtractor={i => i.id}
        ListHeaderComponent={<HeaderList isLoading={isValidating} />}
        renderSectionHeader={({ section: { title } }) => (
          <FilterCompanySection text={title} onPress={onOpen} />
        )}
        renderItem={({ item }) => (
          <CompanyItem
            company={item}
            onPress={navigateToCompanyDetails}
            isLoading={item.isLoading}
          />
        )}
        renderSectionFooter={({ section }) =>
          !section.data.length ? <CompaniesEmptyComponent /> : null
        }
        contentContainerStyle={{
          paddingBottom: bottomHeight - 12,
          backgroundColor: 'white',
          minHeight: '100%',
          borderBottomEndRadius: 30,
          borderBottomStartRadius: 30
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />

      <FilterComponent isOpen={isOpen} onClose={onClose} />
    </View>
  )
}
