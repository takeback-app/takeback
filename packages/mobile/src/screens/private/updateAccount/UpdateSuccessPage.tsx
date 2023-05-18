import React from 'react'
import { Center, Heading, Stack, Text, Button } from 'native-base'

import Illustration from '../../../assets/illustration3.svg'
import { StatusBar } from 'expo-status-bar'
import { useStorage } from '../../../hooks/useStorage'

export function UpdateSuccessPage() {
  const { setAccountUpdate } = useStorage()

  async function handlePress() {
    setAccountUpdate(true)
  }

  return (
    <>
      <StatusBar style="auto" />
      <Center flex="1" px={4} mt={-4}>
        <Stack space={4}>
          <Illustration />
          <Heading
            fontSize="3xl"
            color="blue.600"
            fontWeight="bold"
            textAlign="center"
            mt="8"
          >
            Cadastro atualizado {'\n'} com sucesso!
          </Heading>
          <Text
            fontSize="sm"
            color="gray.600"
            fontWeight="medium"
            textAlign="center"
            px={8}
          >
            Por hora é só, :) Obrigado por completar seus dados, pode voltar a
            usar o app à vontade.
          </Text>

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
            onPress={handlePress}
          >
            Voltar ao aplicativo
          </Button>
        </Stack>
      </Center>
    </>
  )
}
