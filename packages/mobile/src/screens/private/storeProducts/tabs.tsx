import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { Flex } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header } from '../../../components/header'
import { StoreProducts } from './index'
import { MyOrders } from './MyOrders'

const Tab = createMaterialTopTabNavigator()

export enum StoreProductFilter {
  ONGOING = 'ongoing',
  FINISHED = 'finished'
}

export function StoreProductTabs({ navigation }) {
  const { top, bottom } = useSafeAreaInsets()

  return (
    <Flex flex={1} bg="white" style={{ paddingTop: top, marginBottom: bottom }}>
      <Header
        variant="arrow"
        title="Ofertas"
        goBack={() => navigation.goBack()}
      />

      <Tab.Navigator initialRouteName="Em andamento">
        <Tab.Screen
          name="Em andamento"
          component={StoreProducts}
          initialParams={{ filter: StoreProductFilter.ONGOING }}
        />
        <Tab.Screen name="Minhas compras" component={MyOrders} />
        <Tab.Screen
          name="Encerradas"
          component={StoreProducts}
          initialParams={{ filter: StoreProductFilter.FINISHED }}
        />
      </Tab.Navigator>
    </Flex>
  )
}
