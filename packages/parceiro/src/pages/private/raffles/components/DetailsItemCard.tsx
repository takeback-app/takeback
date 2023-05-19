import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text
} from '@chakra-ui/react'
import { maskCPF, maskPhone } from '../../../../utils/masks'
import { ConfirmationDeliveryButton } from './ConfirmationDeliveryButton'
import { useParams } from 'react-router'
import moment from 'moment'

export interface Item {
  id: string
  imageUrl: string
  winnerTicket?: {
    consumer: {
      fullName: string
      cpf: string
      phone: string
    }
  }
  raffleItemDelivery?: {
    deliveredAt?: string
    companyUser: {
      name: string
    }
  }
  description: string
  order: number
}

interface ItemsCardProps {
  items: Item[]
  isDelivering: boolean
}

function RaffleItem({
  item,
  isDelivering
}: {
  item: Item
  isDelivering: boolean
}) {
  const { id } = useParams()

  const mutateKey = `company/raffles/${id}`

  const { winnerTicket, raffleItemDelivery } = item

  return (
    <Flex justifyContent="space-between" align="center">
      <Flex gap={4} align="center">
        <Image
          borderRadius="lg"
          w={12}
          h={12}
          mb={0}
          objectFit="cover"
          src={item.imageUrl}
        />
        <Flex flexDir="column">
          <Text fontWeight="bold">{item.description}</Text>
          <Text fontSize="sm" fontWeight="medium">
            Ganhador:{' '}
            {winnerTicket
              ? `${winnerTicket.consumer.fullName} - ${maskCPF(
                  winnerTicket.consumer.cpf
                )} - ${
                  winnerTicket.consumer.phone
                    ? maskPhone(winnerTicket.consumer.phone)
                    : 'Sem telefone'
                }`
              : '-'}
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            Entregue em:{' '}
            {raffleItemDelivery?.deliveredAt
              ? moment(raffleItemDelivery?.deliveredAt).format(
                  'DD/MM/YYYY HH:mm'
                ) + ` por ${raffleItemDelivery.companyUser.name}`
              : '-'}
          </Text>
        </Flex>
      </Flex>
      {!raffleItemDelivery?.deliveredAt && isDelivering ? (
        <ConfirmationDeliveryButton id={item.id} mutateKey={mutateKey} />
      ) : null}
    </Flex>
  )
}

export function DetailsItemCard({ items, isDelivering }: ItemsCardProps) {
  return (
    <Card>
      <CardHeader as={Flex} alignItems="center" flexDirection="row">
        <Heading fontSize="md">Prêmios</Heading>
      </CardHeader>
      <Divider borderColor="gray.300" />
      <CardBody as={Stack} overflowX="auto" maxH="sm">
        {items.map(item => (
          <RaffleItem item={item} isDelivering={isDelivering} key={item.id} />
        ))}
      </CardBody>
    </Card>
  )
}
