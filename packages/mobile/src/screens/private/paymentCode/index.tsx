import React, { useState } from 'react'
import {
  Button,
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack
} from 'native-base'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { API } from '../../../services/API'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { Dialog } from '../../../components/dialog'

import { PrivateRouteParam, PrivateRouteProps } from '../../../@types/routes'

interface PaymentCodeProps {
  navigation: NativeStackNavigationProp<PrivateRouteParam>
  route: PrivateRouteProps<'paymentCode'>
}

export function PaymentCode({ navigation, route }: PaymentCodeProps) {
  const { code, transactionId } = route?.params

  const [showConfirm, setShowConfirm] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [canceled, setCanceled] = useState(false)

  function navigateToHome() {
    navigation.navigate('home')
  }

  function cancelTransaction() {
    setShowConfirm(false)
    setIsLoading(true)
    API.delete(`/costumer/cashback/delete/${transactionId}`)
      .then(() => {
        setShowNotification(true)
        setCanceled(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Layout>
      <Header variant="close" title="" goBack={navigateToHome} />
      {isLoading || canceled ? (
        <Center p="8" flex="1">
          <Spinner color="blue.400" size="lg" />
          <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
            Cancelando a chave da compra...
          </Text>
        </Center>
      ) : (
        <VStack flex="1" justifyContent="space-between" pb="4" px="4">
          <VStack mt="4">
            <Heading fontSize="3xl" color="gray.800" fontWeight="bold">
              Informe sua chave de compra
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium" mt="2">
              Informe o código abaixo ao atendente
            </Text>

            <Text
              textAlign="center"
              fontSize="6xl"
              fontWeight="semibold"
              color="blue.600"
              mt="12"
            >
              {code}
            </Text>
          </VStack>

          <HStack w="full" justifyContent="space-between">
            <Button
              w="48%"
              h="12"
              rounded="full"
              bgColor="red.400"
              _pressed={{
                bgColor: 'red.300'
              }}
              _text={{
                fontSize: 'md',
                fontWeight: 'medium'
              }}
              onPress={() => setShowConfirm(true)}
            >
              Cancelar
            </Button>
            <Button
              w="48%"
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
              onPress={navigateToHome}
            >
              Finalizar
            </Button>
          </HStack>
        </VStack>
      )}

      <Dialog
        isOpen={showConfirm}
        title="Deseja cancelar a chave da compra?"
        cancelTitle="Não"
        confirmTitle="Sim"
        onConfirm={cancelTransaction}
        onClose={() => setShowConfirm(false)}
      />

      <Dialog
        isOpen={showNotification}
        title="Chave de compra cancelada"
        hideCancelTitle
        confirmTitle="OK"
        onConfirm={navigateToHome}
      />
    </Layout>
  )
}
