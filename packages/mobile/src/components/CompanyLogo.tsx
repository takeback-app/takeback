import React from 'react'

import { Flex, Text } from 'native-base'
import { getInitials } from '../utils'
import { LoadingImage } from './LoadingImage'

interface CompanyLogoProps {
  companyName: string
  companyLogoUrl?: string
  size?: number
  rounded?: number
}

export function CompanyLogo({
  companyName,
  companyLogoUrl,
  size = 16,
  rounded = 12
}: CompanyLogoProps) {
  return (
    <Flex
      w={size}
      h={size}
      justifyContent="center"
      alignItems="center"
      bgColor={companyLogoUrl ? undefined : 'blue.400'}
      rounded={`${rounded}px`}
    >
      {companyLogoUrl ? (
        <LoadingImage
          source={{ uri: companyLogoUrl }}
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            borderRadius: rounded,
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
          {getInitials(companyName || '')}
        </Text>
      )}
    </Flex>
  )
}
