import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import useSWR from 'swr'

import { Flex } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header } from '../../../components/header'
import { Raffles } from './index'
import { RaffleTicketButton } from './components/RaffleTicketButton'

const Tab = createMaterialTopTabNavigator()

export enum RaffleFilter {
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  PARTICIPATING = 'participating'
}

export function RaffleTabs({ navigation }) {
  const { top, bottom } = useSafeAreaInsets()

  const { data } = useSWR<{ count: number }>('costumer/tickets/pending-count')

  return (
    <Flex flex={1} bg="white" style={{ paddingTop: top, marginBottom: bottom }}>
      <Header
        variant="arrow"
        title="Sorteios"
        left={
          <RaffleTicketButton
            numberOfTickets={data?.count ?? 0}
            onPress={() => navigation.navigate('raffleTickets')}
          />
        }
        goBack={() => navigation.goBack()}
      />

      <Tab.Navigator initialRouteName="Participando">
        <Tab.Screen
          name="Em andamento"
          component={Raffles}
          initialParams={{ filter: RaffleFilter.ONGOING }}
        />
        <Tab.Screen
          name="Participando"
          component={Raffles}
          initialParams={{ filter: RaffleFilter.PARTICIPATING }}
        />
        <Tab.Screen
          name="Finalizados"
          component={Raffles}
          initialParams={{ filter: RaffleFilter.FINISHED }}
        />
      </Tab.Navigator>
    </Flex>
  )
}
