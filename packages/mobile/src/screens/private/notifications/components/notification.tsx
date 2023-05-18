/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Circle, HStack, Text, VStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { dateFormatSimple } from '../../../../utils'

export enum NotificationType {
  NEW_CASHBACK = 'NEW_CASHBACK',
  CASHBACK_APPROVED = 'CASHBACK_APPROVED',
  NEW_RAFFLE = 'NEW_RAFFLE',
  RAFFLE_WINNER = 'RAFFLE_WINNER'
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  consumerId: string | null
  companyUserId: string | null
  data: Record<string, any>
  readAt: string | null
  createdAt: string
}

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <HStack
      p="4"
      space="4"
      borderBottomWidth="1.5"
      borderColor="gray.300"
      bgColor="white"
    >
      <Circle w="12" h="12" rounded="full" bgColor="gray.300">
        <Ionicons name="wallet-outline" size={24} color="black" />
      </Circle>

      <VStack flex="1" space={1}>
        <Text fontWeight="semibold" fontSize="15px" color="gray.800">
          {notification.title}
        </Text>
        <Text fontWeight="semibold" fontSize="13px" lineHeight="xs">
          {notification.body}
        </Text>
        <Text fontWeight="normal" fontSize="xs" color="gray.600">
          {dateFormatSimple(notification.createdAt, true)}
        </Text>
      </VStack>
      {!notification.readAt && (
        <Circle bg="blue.400" w={2} h={2} alignSelf="center" />
      )}
    </HStack>
  )
}
