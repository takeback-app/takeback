import { AlertDialog, Button, Text, useDisclose } from 'native-base'
import React, { useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { PrivateRouteParam } from '../../../../@types/routes'
import { Info } from './info'

export function DeactivateAccount() {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  const cancelRef = useRef(null)
  const { isOpen, onClose, onOpen } = useDisclose()

  async function handleLogout() {
    navigation.navigate('askPassword')
    onClose()
  }

  return (
    <>
      <Info title="Excluir conta" value="" onPress={onOpen} />

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton color="gray.800" />
          <AlertDialog.Header borderColor="transparent">
            <Text fontSize="md" fontWeight="medium" color="gray.800">
              Deseja excluir sua conta?
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text color="gray.700">
              Tem certeza de que deseja excluir sua conta? Lembre-se de que esta
              ação irá remover permanentemente todas as suas informações
              pessoais, histórico de compras e saldo acumulado. Não será
              possível recuperá-los após a exclusão da conta.
            </Text>

            {/* <Text mt={2} fontWeight="bold">
              Pressione e segure o botão remover para continuar
            </Text> */}
          </AlertDialog.Body>
          <AlertDialog.Footer borderColor="transparent">
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
                _text={{
                  fontWeight: 'medium'
                }}
              >
                Cancelar
              </Button>
              <Button
                bgColor="red.500"
                px="6"
                rounded="md"
                onPress={handleLogout}
                _text={{
                  fontWeight: 'medium'
                }}
              >
                Excluir
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}
