import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Icon, Stack, Text } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'

interface RaffleTicketButtonProps {
  numberOfTickets: number
  onPress: () => void
}

export function RaffleTicketButton({
  numberOfTickets,
  onPress
}: RaffleTicketButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        as={MaterialCommunityIcons}
        name="ticket-percent-outline"
        size="xl"
        color="gray.700"
      />
      {!!numberOfTickets && (
        <Stack
          w="18px"
          h="18px"
          position="absolute"
          top="-5px"
          right="-5px"
          justifyContent="center"
          alignItems="center"
          bgColor="red.400"
          rounded="full"
        >
          <Text
            fontSize={numberOfTickets >= 10 ? '8px' : '10px'}
            ml="1px"
            fontWeight="bold"
            color="white"
          >
            {numberOfTickets > 99 ? '+99' : numberOfTickets}
          </Text>
        </Stack>
      )}
    </TouchableOpacity>
  )
}
