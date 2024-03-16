import React from 'react'
import { View, Dimensions } from 'react-native'
import {
  Text,
  Pressable,
  HStack,
  Box,
  VStack,
  Stack,
  Icon,
  Skeleton,
  Flex
} from 'native-base'
import { Ionicons } from '@expo/vector-icons'

import { getInitials } from '../../../../../utils'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PrivateRouteParam } from '../../../../../@types/routes'

type companyPaymentMethod = {
  cashbackPercentage: number
  isActive: boolean
}

export type ICompany = {
  id: string
  fantasyName: string
  industry: {
    description: string
  }
  address: {
    city: {
      name: string
    }
  }
  companyPaymentMethod: companyPaymentMethod[]
}

interface CompaniesComponentProps {
  data?: ICompany[]
  isLoading?: boolean
  onOpenFilters?: () => void
}

export function CompaniesComponent(props: CompaniesComponentProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const screenHeight = Dimensions.get('screen').height

  function calculateHighestPercentage(methods: companyPaymentMethod[]) {
    if (methods.length === 0) return 0

    const activeMethods = methods.filter(method => method.isActive)

    const max = activeMethods.reduce(function (prev, current) {
      return prev.cashbackPercentage > current.cashbackPercentage
        ? prev
        : current
    })

    return max.cashbackPercentage
  }

  if (props.isLoading) {
    return (
      <Stack
        w="full"
        h="full"
        minH={screenHeight}
        bg="white"
        mt="4"
        p="4"
        rounded="3xl"
        space="4"
      >
        {[0, 1, 2, 3].map(item => (
          <HStack space="2" key={item}>
            <Skeleton h="16" w="16" rounded="lg" />
            <VStack space="2">
              <Skeleton h="4" w="56" rounded="full" />
              <Skeleton h="4" w="32" rounded="full" />
            </VStack>
          </HStack>
        ))}
      </Stack>
    )
  }

  function navigateToCompanyDetails(companyId: string) {
    navigation.navigate('companyDetails', {
      companyId
    })
  }

  return (
    <Stack
      w="full"
      h="full"
      minH={screenHeight}
      bg="white"
      mt="4"
      p="4"
      rounded="3xl"
    >
      {props.data && props.data.length > 0 && (
        <>
          <HStack justifyContent="space-between" alignItems="center" mb="4">
            <Text fontSize="md" fontWeight="medium" color="blue.600">
              Empresas parceiras
            </Text>
            <Pressable onPress={props.onOpenFilters}>
              <Icon as={Ionicons} name="filter-outline" size="lg" color="blue.600" />
            </Pressable>
          </HStack>
          {props.data.map(item => (
            <Pressable
              key={item.id}
              flexDirection="row"
              w="full"
              py="2"
              overflow="hidden"
              onPress={() => navigateToCompanyDetails(item.id)}
            >
              <Flex
                w="16"
                h="16"
                justifyContent="center"
                alignItems="center"
                borderWidth="1"
                borderColor="gray.300"
                bgColor="blue.400"
                rounded="xl"
              >
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  color="white"
                  textTransform="uppercase"
                >
                  {getInitials(item.fantasyName || '')}
                </Text>
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
                    {item.fantasyName}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight="normal"
                    color="gray.600"
                    numberOfLines={1}
                  >
                    {item.industry.description} • {item.address.city.name}
                  </Text>
                </View>
                <HStack justifyContent="space-between" alignItems="center">
                  <View />
                  {item.companyPaymentMethod.length > 0 && (
                    <Box px="3" py="1" rounded="md" bgColor="blue.600">
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="white"
                        lineHeight="sm"
                      >
                        {calculateHighestPercentage(item.companyPaymentMethod) *
                          100}
                        %
                      </Text>
                    </Box>
                  )}
                </HStack>
              </VStack>
            </Pressable>
          ))}
        </>
      )}
    </Stack>
  )
}
