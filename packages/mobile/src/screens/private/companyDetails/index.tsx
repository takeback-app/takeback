import React, { useMemo } from 'react'
import { ActivityIndicator } from 'react-native'
import { mask } from 'react-native-mask-text'

import useSWR from 'swr'
import { Button, Flex, ScrollView, Text, VStack, View } from 'native-base'

import { Header } from '../../../components/header'
import { Layout } from '../../../components/layout'

import { getInitials } from '../../../utils'
import { usePaymentStore } from '../newPayment/state'
import { percentageFormatter } from '../../../utils/masks'

export interface Company {
  id: string
  fantasyName: string
  email: string
  phone: string
  companyAddress: {
    street: string
    number: string
    district: string
  }
  companyPaymentMethods: CompanyPaymentMethod[]
}

export interface CompanyPaymentMethod {
  id: number
  cashbackPercentage: string
  paymentMethod: {
    description: true
  }
}

export function CompanyDetails({ navigation, route }) {
  const { companyId } = route.params

  const { setCompany } = usePaymentStore()

  const { data: company, isLoading } = useSWR<Company>(
    `costumer/company/find/one/${companyId}`
  )

  const address = useMemo(() => {
    if (!company?.companyAddress) return

    const { district, number, street } = company.companyAddress

    return [street, number, district].filter(i => i).join(', ')
  }, [company])

  if (isLoading || !company) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  function handleGoToPayment() {
    if (!company) return

    setCompany(company)
    navigation.navigate('newPayment')
  }

  return (
    <Layout>
      <Header title="" variant="arrow" goBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <VStack space="20" p="4">
          <VStack justifyContent="center" alignItems="center" mt="8">
            <Flex
              w="32"
              h="32"
              rounded="full"
              justifyContent="center"
              alignItems="center"
              bgColor="gray.400"
              _text={{
                fontWeight: 'semibold',
                fontSize: '3xl',
                color: 'gray.800'
              }}
            >
              {getInitials(company.fantasyName || '')}
            </Flex>
            <Text
              fontSize="xl"
              fontWeight="semibold"
              color="gray.800"
              textAlign="center"
              textTransform="capitalize"
              mt="4"
            >
              {company.fantasyName || ''}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
              textAlign="center"
              textTransform="capitalize"
            >
              {address}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
              textAlign="center"
              textTransform="lowercase"
            >
              {company.email || ''}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
              textAlign="center"
              textTransform="lowercase"
            >
              {mask(company.phone, '(99) 99999-9999')}
            </Text>
          </VStack>

          <VStack space="2">
            {company.companyPaymentMethods?.map(
              ({ id, cashbackPercentage, paymentMethod }) => (
                <VStack
                  key={id}
                  p="4"
                  borderWidth="1"
                  borderColor="gray.400"
                  rounded="xl"
                >
                  <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                    {paymentMethod.description} (
                    {percentageFormatter(cashbackPercentage)} de volta)
                  </Text>
                </VStack>
              )
            )}
          </VStack>

          <Button
            size="lg"
            rounded="full"
            bgColor="blue.600"
            _pressed={{ bgColor: 'blue.300' }}
            _text={{ fontWeight: 'semibold' }}
            onPress={handleGoToPayment}
          >
            Gerar cashback
          </Button>
        </VStack>
      </ScrollView>
    </Layout>
  )
}
