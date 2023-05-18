import React from 'react'
import { Flex, HStack, Icon, Text, VStack, Circle } from 'native-base'

import { dateFormatSimple } from '../../../utils'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { maskCurrency } from '../../../utils/masks'

type StatusData = {
  [key in TicketStatus]: { text: string; color: string }
}

const statusData: StatusData = {
  PENDING: { text: 'Pendente', color: 'amber.500' },
  ACTIVE: { text: 'Ativo', color: 'green.600' },
  FINISHED: { text: 'Finalizado', color: 'blue.500' },
  CANCELED: { text: 'Cancelado', color: 'red.500' }
}

export enum TicketStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED'
}

export interface Ticket {
  raffleTitle: string
  companyName: string
  purchaseAmount: number
  date: string
  ticketCount: number
  status: TicketStatus
}

interface TicketItemProps {
  ticket: Ticket
}

export function TicketItem({ ticket }: TicketItemProps) {
  return (
    <HStack p="4" space="4" bgColor="white">
      <Circle
        w="12"
        h="12"
        alignSelf="center"
        rounded="full"
        bgColor="gray.300"
      >
        <Icon
          as={MaterialCommunityIcons}
          name="ticket-percent-outline"
          size="xl"
          color="black"
        />
      </Circle>
      <VStack flex="1">
        <Text
          fontWeight="semibold"
          fontSize="md"
          color="gray.800"
          lineHeight="xs"
          mb="1"
        >
          {ticket.raffleTitle}
        </Text>
        <Text
          fontWeight="normal"
          fontSize="xs"
          color="gray.600"
          textTransform="capitalize"
          lineHeight="xs"
          numberOfLines={2}
        >
          <Ionicons name="business-outline" size={11} color="#838383" /> Local
          compra: {ticket.companyName}
        </Text>
        <Text
          mt={2}
          fontWeight="medium"
          color="gray.700"
          lineHeight="xs"
          numberOfLines={2}
        >
          Valor: {maskCurrency(ticket.purchaseAmount)}
        </Text>

        <Flex mt={4}>
          <HStack space={8}>
            <Text fontWeight="bold" color="gray.800" lineHeight="xs">
              {ticket.ticketCount}{' '}
              {ticket.ticketCount === 1 ? 'cupom' : 'cupons'}
            </Text>
            <Text
              fontWeight="bold"
              color={statusData[ticket.status].color}
              lineHeight="xs"
              mr={16}
            >
              {statusData[ticket.status].text}
            </Text>
          </HStack>
        </Flex>
      </VStack>

      <Text fontWeight="medium" fontSize="xs" color="gray.600">
        {dateFormatSimple(ticket.date).toUpperCase()}
      </Text>
    </HStack>
  )
}
