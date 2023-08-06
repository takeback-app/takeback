import React, { useContext, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { Box, Stack } from 'native-base'
import useSWR from 'swr'

import { HeaderComponent } from './headerComponent'
import { BalanceComponent } from './balanceComponent'
import { CardsComponent } from './cardsComponent'
import { UserDataContext } from '../../../../contexts/UserDataContext'

interface HeaderListProp {
  isLoading: boolean
}

export function HeaderList({ isLoading }: HeaderListProp) {
  const { userData, balance } = useContext(UserDataContext)

  const [counterUrl, setCounterUrl] = useState<string | null>(null)

  // Para evitar que fique chamando esse
  // endpoint em outras telas sem necessidade
  useFocusEffect(
    React.useCallback(() => {
      setCounterUrl('costumer/notifications/unread-count')

      return () => setCounterUrl(null)
    }, [])
  )
  const { data: notifications } = useSWR<{ count: number }>(counterUrl, {
    refreshInterval: 10 * 1000 /** 10 segundos */
  })

  return (
    <Box bg="gray.300">
      <Stack px="4" mt="4">
        <HeaderComponent
          imageURI={''}
          userName={userData.fullName}
          notifications={notifications?.count}
          isLoading={isLoading}
        />
        <Stack h="4" />
        <BalanceComponent
          balance={balance}
          blockedBalance={userData.blockedBalance}
          isLoading={isLoading}
        />
        <Stack h="4" />
      </Stack>

      <CardsComponent isLoading={isLoading} />
    </Box>
  )
}
