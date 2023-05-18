import React, { useContext } from 'react'
import { Center, Stack, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { UserDataContext } from '../../../contexts/UserDataContext'

import { masks } from '../../../utils'

import { PrivateRouteParam } from '../../../@types/routes'
import Illustration from '../../../assets/illustration7.svg'

export function BalanceSaved() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const { userData } = useContext(UserDataContext)

  function navigateGoBack() {
    navigation.goBack()
  }

  return (
    <Layout>
      <Header variant="arrow" title="" goBack={navigateGoBack} />
      <Stack flex="1" px="4" py="8" justifyContent="center">
        <Center>
          <Illustration />
          <Text
            fontSize="xl"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
            mt="4"
          >
            Você já economizou
          </Text>
          <Text
            fontSize="3xl"
            color="blue.600"
            fontWeight="semibold"
            textAlign="center"
          >
            {masks.maskCurrency(userData.totalSaved || 0)}
          </Text>
          <Text
            fontSize="xl"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
          >
            com o Takeback
          </Text>

          <Text
            fontSize="sm"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
            mt="32"
          >
            Tire um print e compartilhe com seus amigos!
          </Text>
        </Center>
      </Stack>
    </Layout>
  )
}
