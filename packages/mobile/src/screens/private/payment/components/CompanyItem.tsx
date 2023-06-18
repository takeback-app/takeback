import React from 'react'
import { Company } from '../../../../stores/useCompanies'
import { HStack, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { usePaymentStore } from '../state'
import { CompanyLogo } from '../../../../components/CompanyLogo'

interface CompanyItemProps {
  company: Company
  onPress: () => void
}

export function CompanyItem({ company, onPress }: CompanyItemProps) {
  const { setCompany, setPaymentMethodId } = usePaymentStore()

  function handleSelection() {
    setCompany(company)

    const takebackCompanyPaymentMethodId = company.companyPaymentMethods.find(
      ({ paymentMethodId }) => paymentMethodId === 1
    )

    if (!takebackCompanyPaymentMethodId) return

    setPaymentMethodId(takebackCompanyPaymentMethodId.id)

    onPress()
  }

  return (
    <TouchableOpacity onPress={handleSelection}>
      <HStack p="4" space="4" alignItems="center">
        <CompanyLogo
          rounded={100}
          size={12}
          companyName={company.fantasyName}
          companyLogoUrl={company.logoUrl}
        />

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
            {company.industry.description} • {company.companyAddress.city.name}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}
