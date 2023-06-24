import { Ionicons } from '@expo/vector-icons'
import { Button, Icon, Stack, Text } from 'native-base'
import React, { useMemo } from 'react'
import { createWhatsAppMessage } from '../../../../utils'
import { mask } from 'react-native-mask-text'
import { usePaymentStore } from '../state'

export function CompanyInfo() {
  const { company } = usePaymentStore()

  const address = useMemo(() => {
    if (!company?.companyAddress) return

    const { district, number, street } = company.companyAddress

    return [street, number, district].filter(i => i).join(', ')
  }, [company])

  return (
    <Stack mt={8} alignItems="center">
      <Text
        color="gray.800"
        textAlign="center"
        textTransform="capitalize"
        fontWeight="bold"
      >
        {company.fantasyName}
      </Text>
      {address ? (
        <Text
          color="gray.600"
          textAlign="center"
          textTransform="capitalize"
          fontWeight="medium"
        >
          {address}
        </Text>
      ) : null}
      <Text
        color="gray.600"
        textAlign="center"
        textTransform="lowercase"
        fontWeight="medium"
      >
        {company.email}
      </Text>

      <Text
        color="gray.600"
        textAlign="center"
        textTransform="lowercase"
        fontWeight="medium"
      >
        {mask(company.phone, '(99) 99999-9999')}
      </Text>
      <Button
        size="md"
        mt={4}
        bgColor="#128C7E"
        _pressed={{ bgColor: '#128c7ed8' }}
        rounded="full"
        leftIcon={
          <Icon color="white" as={Ionicons} name="logo-whatsapp" size="4" />
        }
        onPress={() => createWhatsAppMessage(company.phone)}
      >
        Fale com a empresa
      </Button>
    </Stack>
  )
}
