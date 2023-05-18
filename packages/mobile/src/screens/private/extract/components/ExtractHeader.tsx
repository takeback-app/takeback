import React, { useContext } from 'react'

import { Text, VStack } from 'native-base'
import { masks } from '../../../../utils'
import { UserDataContext } from '../../../../contexts/UserDataContext'

export function ExtractHeader() {
  const { userData, balance } = useContext(UserDataContext)

  return (
    <>
      <VStack mx="4" p="4" mt={4} rounded="xl" bgColor="blue.400">
        <Text fontWeight="medium" fontSize="sm" color="white">
          Saldo disponível
        </Text>
        <Text fontWeight="medium" fontSize="4xl" color="white">
          {masks.maskCurrency(balance || 0)}
        </Text>
      </VStack>
      <VStack m="4" p="4" rounded="xl" bgColor="muted.200">
        <Text fontWeight="medium" fontSize="sm" color="gray.800">
          Saldo pendente
        </Text>
        <Text fontWeight="medium" fontSize="2xl" color="gray.800">
          {masks.maskCurrency(userData.blockedBalance || 0)}
        </Text>
        <Text
          fontWeight="normal"
          fontSize="sm"
          lineHeight="sm"
          color="gray.600"
        >
          Esse saldo ficará disponível assim que a empresa parceira realizar o
          pagamento do seu cashback
        </Text>
      </VStack>
    </>
  )
}
