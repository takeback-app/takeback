import React from 'react'
import { Button, Center, Heading, Stack, Text } from 'native-base'

import { Header } from '../../../components/header'
import { Layout } from '../../../components/layout'

import Illustration from '../../../assets/illustration2.svg'

export function StartPage({ navigation }) {
  return (
    <Layout>
      <Header variant="arrow" goBack={navigation.goBack} />
      <Stack flex="1" px="4" py="8" justifyContent="space-between">
        <Center>
          <Illustration />
          <Stack mt="4">
            <Heading fontSize="3xl" color="blue.600" fontWeight="bold">
              Crie sua conta e comece a ganhar cashback
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium">
              Com o Takeback você ganha em cada compra que fizer! Cadastre-se e
              comece a ganhar ainda hoje.
            </Text>
          </Stack>
        </Center>

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
          onPress={() => navigation.navigate('getCpfPage')}
        >
          Criar minha conta
        </Button>
      </Stack>
    </Layout>
  )
}
