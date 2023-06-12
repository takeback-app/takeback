/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Circle, HStack, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { dateFormatSimple } from '../../../../utils'
import { maskCPF } from '../../../../utils/masks'

export enum ReferralStatus {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED',
  BONUSING = 'BONUSING'
}

export interface Referral {
  id: string
  cpf: string
  status: ReferralStatus
  createdAt: string
  childrenConsumer?: {
    fullName: string
  }
}

interface ReferralItemProps {
  item: Referral
}

const statusData = {
  WAITING: {
    color: 'yellow.500',
    icon: 'time-outline',
    text: 'Aguardando seu amigo(a) baixar o aplicativo ⏳'
  },
  APPROVED: {
    color: 'blue.500',
    icon: 'checkmark-circle-outline',
    text: 'Seu amigo(a) já baixou o app ✅'
  },
  BONUSING: {
    color: 'green.600',
    icon: 'checkmark-circle-outline',
    text: 'Top! Você já está ganhando bônus por essa indicação 💰'
  }
}

export function ReferralItem({ item }: ReferralItemProps) {
  const status = statusData[item.status]

  return (
    <HStack
      p="4"
      space="4"
      borderBottomWidth="1.5"
      borderColor="gray.300"
      bgColor="white"
    >
      <Circle w="12" h="12" rounded="full" bgColor="gray.300">
        <Ionicons name="megaphone-outline" size={24} color="#71717a" />
      </Circle>

      <VStack flex="1" space={1}>
        <Text fontWeight="semibold" fontSize="15px" color="gray.800">
          {item.childrenConsumer?.fullName || maskCPF(item.cpf)}
        </Text>
        <Text fontWeight="medium" fontSize="13px">
          {status.text}
        </Text>
        <Text fontWeight="normal" fontSize="xs" color="gray.600">
          {dateFormatSimple(item.createdAt, true)}
        </Text>
      </VStack>
      {item.childrenConsumer && (
        <Circle bg={status.color} w={2} h={2} alignSelf="center" />
      )}
    </HStack>
  )
}
