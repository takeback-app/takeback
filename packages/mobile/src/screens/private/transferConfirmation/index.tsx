import React from 'react'
import { Button, Heading, Text, VStack } from 'native-base'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import { PrivateRouteParam, PrivateRouteProps } from '../../../@types/routes'
import { masks } from '../../../utils'

interface TransferConfirmationProps {
  navigation: NativeStackNavigationProp<PrivateRouteParam>
  route: PrivateRouteProps<'transferConfirmation'>
}

export function TransferConfirmation({
  navigation,
  route
}: TransferConfirmationProps) {
  const { userId, userName, value } = route?.params

  function goBack() {
    navigation.goBack()
  }

  function navigateToGetPassword() {
    navigation.navigate('transferPassword', {
      userId,
      userName,
      value
    })
  }

  return (
    <Layout>
      <Header variant="arrow" title="Transferir" goBack={goBack} />
      <VStack flex="1" justifyContent="space-between" pb="4" px="4">
        <VStack mt="4" alignItems="center">
          <Heading
            fontSize="3xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
          >
            Transferindo
          </Heading>
          <Heading
            fontSize="3xl"
            color="blue.400"
            fontWeight="bold"
            textAlign="center"
          >
            {masks.maskCurrency(value)}
          </Heading>
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            para{' '}
            <Text fontWeight="bold" color="gray.800" textTransform="capitalize">
              {userName}
            </Text>
          </Text>
        </VStack>

        <Button
          h="12"
          rounded="full"
          bgColor="blue.600"
          _pressed={{
            bgColor: 'blue.400'
          }}
          _text={{
            fontSize: 'md',
            fontWeight: 'medium'
          }}
          onPress={navigateToGetPassword}
        >
          Transferir
        </Button>
      </VStack>
    </Layout>
  )
}
