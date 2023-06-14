import React from 'react'
import { Box, Button, Flex, Stack, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'

export function ReferralInfo() {
  const navigation = useNavigation()

  return (
    <Flex px={8}>
      <Box h="100px" />
      <Stack space="1">
        <Text textAlign="center" fontSize="2xl" fontWeight="bold">
          Olha que NOVIDADE! 🤩
        </Text>
        <Text
          textAlign="center"
          fontSize="md"
          fontWeight="medium"
          color="gray.700"
        >
          Indique seus amigos e ganhe um bônus nas compras que eles fizerem.
          💰🥳
        </Text>
        <Stack my={6}>
          <Text fontWeight="bold">Funcionamento:</Text>
          <Text fontWeight="bold">Muito simples!</Text>
          <Text fontWeight="bold">
            1 - Primeiro indique aqui o telefone do seu amigo, somente depois
            peça que ele baixe o app Takeback;
          </Text>
          <Text fontWeight="bold">
            2 - Apenas é possível indicar amigos que ainda não têm Takeback.
          </Text>
          <Text fontWeight="bold">
            3 - A partir daí, você ganha bônus em toda compra acima de R$ 10,00
            que seu amigo fizer. Top, né? 🤩
          </Text>
        </Stack>

        <Text textAlign="center" fontWeight="medium" color="gray.700">
          Já mande mensagem para todos os seus amigos e comece a fazer as
          indicações! 😃
        </Text>
      </Stack>

      <Button
        h="12"
        mt={16}
        rounded="full"
        bgColor="blue.600"
        _pressed={{
          bgColor: 'blue.400'
        }}
        _text={{
          fontSize: 'md',
          fontWeight: 'bold'
        }}
        onPress={() => navigation.navigate('createReferral' as never)}
      >
        Indicar amigo
      </Button>
    </Flex>
  )
}
