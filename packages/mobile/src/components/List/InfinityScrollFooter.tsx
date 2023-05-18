import { Flex, Text } from 'native-base'
import React from 'react'
import { ActivityIndicator } from 'react-native'

interface InfinityScrollFooterProps {
  isLoadingMore: boolean
}

export function InfinityScrollFooter({
  isLoadingMore
}: InfinityScrollFooterProps) {
  if (isLoadingMore) {
    return (
      <Flex py={2} mb={16}>
        <ActivityIndicator color="#449FE7" />
      </Flex>
    )
  }

  return (
    <Text textAlign="center" py={2} fontWeight="medium" color="gray.400">
      Fim da lista
    </Text>
  )
}
