import React from 'react'
import { HStack, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { CompanyLogo } from '../../../../components/CompanyLogo'
import { CompanyUser } from '../index'

interface CompanyUserItemProps {
  companyUser: CompanyUser
  onPress: (id?: string) => void
}

export function CompanyUserItem({
  companyUser,
  onPress
}: CompanyUserItemProps) {
  function handleSelection() {
    onPress(companyUser.id)
  }

  return (
    <TouchableOpacity onPress={handleSelection}>
      <HStack p="4" space="4" alignItems="center">
        <CompanyLogo rounded={100} size={12} companyName={companyUser.name} />

        <VStack flex="1">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="gray.800"
            numberOfLines={1}
          >
            {companyUser.name}
          </Text>
          {/* <Text
            fontSize="xs"
            fontWeight="normal"
            color="gray.600"
            numberOfLines={1}
          >
            {company.industry.description} • {company.companyAddress.city.name}
          </Text> */}
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}
