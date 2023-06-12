import React from 'react'

import {
  Box,
  Flex,
  HStack,
  Pressable,
  Skeleton,
  Text,
  VStack,
  View
} from 'native-base'
import { getInitials } from '../../../../utils'
import { Company, CompanyPaymentMethod } from '../../../../stores/useCompanies'
import { LoadingImage } from '../../../../components/LoadingImage'

function calculateHighestPercentage(methods: CompanyPaymentMethod[]) {
  if (!methods.length) return 0

  const { cashbackPercentage } = methods.reduce((prev, current) =>
    prev.cashbackPercentage > current.cashbackPercentage ? prev : current
  )

  return cashbackPercentage
}

interface CompanyItemProps {
  company: Company
  onPress(id: string): void
  isLoading?: boolean
}

export function CompanyItem({ company, isLoading, onPress }: CompanyItemProps) {
  return (
    <Pressable
      flexDirection="row"
      w="full"
      px="4"
      py="2"
      bg="white"
      onPress={() => onPress(company.id)}
    >
      {isLoading ? (
        <HStack space="2">
          <Skeleton h="16" w="16" rounded="lg" />
          <VStack space="2">
            <Skeleton h="4" w="56" rounded="full" />
            <Skeleton h="4" w="32" rounded="full" />
          </VStack>
        </HStack>
      ) : (
        <>
          <Flex
            w="16"
            justifyContent="center"
            alignItems="center"
            bgColor={company.logoUrl ? undefined : 'blue.400'}
            rounded="12px"
          >
            {company.logoUrl ? (
              <LoadingImage
                source={{ uri: company.logoUrl }}
                style={{
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  borderRadius: 12,
                  backgroundColor: '#60a5fa'
                }}
              />
            ) : (
              <Text
                fontSize="md"
                fontWeight="semibold"
                color="white"
                textTransform="uppercase"
              >
                {getInitials(company.fantasyName || '')}
              </Text>
            )}
          </Flex>
          <VStack flex="1" w="full" justifyContent="space-between" ml="2">
            <View>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="gray.800"
                textTransform="capitalize"
                numberOfLines={1}
              >
                {company.fantasyName}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="normal"
                color="gray.600"
                numberOfLines={1}
              >
                {company.industry.description} •{' '}
                {company.companyAddress.city.name}
              </Text>
            </View>
            <HStack justifyContent="space-between" alignItems="center">
              <View />
              {company.companyPaymentMethods.length > 0 && (
                <Box px="3" py="1" rounded="md" bgColor="blue.600">
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="white"
                    lineHeight="sm"
                  >
                    {calculateHighestPercentage(company.companyPaymentMethods) *
                      100}
                    %
                  </Text>
                </Box>
              )}
            </HStack>
          </VStack>
        </>
      )}
    </Pressable>
  )
}
