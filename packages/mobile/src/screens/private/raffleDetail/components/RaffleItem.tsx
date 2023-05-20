import { Box, Flex, Image, Pressable, Text } from 'native-base'
import React from 'react'
import { Item } from '../types'
import { dateFormat, hideCPF } from '../../../../utils'

interface RaffleItemProps {
  item: Item
  userCpf: string
  isOpenToOtherCompanies: boolean
  onPress: (id: string) => void
}

function formatConsumerName(name: string) {
  return name.split(' ').slice(0, 2).join(' ')
}

export function RaffleItem({
  item,
  userCpf,
  isOpenToOtherCompanies,
  onPress
}: RaffleItemProps) {
  const { winnerTicket, description, imageUrl, raffleItemDelivery } = item

  const isWinner = winnerTicket?.consumer.cpf === userCpf

  function handlePress() {
    if (!isWinner) return

    if (raffleItemDelivery?.deliveredAt) return

    onPress(item.id)
  }

  return (
    <Pressable
      bg={isWinner ? 'green.50' : 'white'}
      px={4}
      py={3}
      flexDirection="row"
      alignItems="center"
      rounded="lg"
      borderColor={isWinner ? 'green.200' : 'gray.200'}
      onPress={handlePress}
      borderWidth={2}
    >
      <Box
        shadow={0}
        h={10}
        rounded="md"
        bg={isWinner ? 'green.200' : 'gray.200'}
      >
        <Image
          alt="prêmio"
          h={10}
          w={10}
          rounded="md"
          source={{
            uri: imageUrl
          }}
        />
      </Box>

      <Flex ml={3} mr={8}>
        <Text fontSize="md" fontWeight="semibold" numberOfLines={1}>
          {description}
        </Text>
        {isOpenToOtherCompanies && isWinner ? (
          <Text fontSize="xs" fontWeight="medium">
            Cupom ganhado em:{' '}
            {item.winnerTicket?.transaction.company.fantasyName.toUpperCase()}
          </Text>
        ) : null}
        <Text fontSize="xs" fontWeight="medium">
          Ganhador:{' '}
          {winnerTicket
            ? `${formatConsumerName(
                winnerTicket.consumer.fullName
              )} - ${hideCPF(winnerTicket.consumer.cpf)}`
            : ' -'}
        </Text>
        {raffleItemDelivery?.deliveredAt && isWinner ? (
          <Text fontSize="xs" fontWeight="medium">
            Retirado em: {dateFormat(raffleItemDelivery.deliveredAt)}
          </Text>
        ) : null}
      </Flex>
    </Pressable>
  )
}
