import React from 'react'
import { Stack, Text } from 'native-base'

import Illustration from '../../../../../assets/illustration10.svg'

export function CompaniesEmptyComponent() {
  return (
    <Stack
      flex="1"
      w="full"
      mt="4"
      py="12"
      px="4"
      rounded="3xl"
      space={4}
      justifyContent="center"
      alignItems="center"
    >
      <Illustration />

      <Text
        fontWeight="normal"
        fontSize="md"
        maxW="64"
        color="gray.600"
        textAlign="center"
      >
        Ainda não há empresas parceiras com esse filtro
      </Text>
    </Stack>
  )
}
