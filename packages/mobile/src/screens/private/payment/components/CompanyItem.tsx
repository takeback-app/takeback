import React from 'react'
import { Company } from '../../../../stores/useCompanies'
import { Circle, HStack, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { getInitials } from '../../../../utils'
import { usePaymentStore } from '../state'

interface CompanyItemProps {
  company: Company
  onPress: () => void
}

export function CompanyItem({ company, onPress }: CompanyItemProps) {
  const { setCompany, setPaymentMethodId } = usePaymentStore()

  function handleSelection() {
    setCompany(company)

    const takebackCompanyPaymentMethodId = company.companyPaymentMethod.find(
      ({ paymentMethodId }) => paymentMethodId === 1
    )

    if (!takebackCompanyPaymentMethodId) {
      return
    }

    setPaymentMethodId(takebackCompanyPaymentMethodId.id)

    onPress()
  }

  return (
    <TouchableOpacity onPress={handleSelection}>
      <HStack p="4" space="4" alignItems="center">
        <Circle w="12" h="12" rounded="full" bgColor="blue.400">
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="white"
            textTransform="uppercase"
          >
            {getInitials(company.fantasyName || '')}
          </Text>
        </Circle>

        <VStack flex="1">
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
            {company.industry.description} • {company.address.city.name}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}
