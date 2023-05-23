import React from 'react'

import { Text as NativeText, Platform } from 'react-native'

import {
  Flex,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Stack,
  Text
} from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function RaffleRules({ navigation }) {
  const { top: topHeight } = useSafeAreaInsets()

  return (
    <Flex>
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
        alignItems="center"
        justifyContent="center"
      >
        <Pressable
          position="absolute"
          left="4"
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" color="#52525b" size={24} />
        </Pressable>
        <Text mt={1} fontSize="md" fontWeight="semibold">
          Regras dos Sorteios
        </Text>
      </HStack>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        px={6}
        py={4}
      >
        <Stack space={2}>
          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            1 - Os cupons dos sorteios serão distribuídos automaticamente de
            acordo com as compras feitas nas empresas credenciadas.
          </NativeText>
          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            2 - Nos sorteios <Text fontWeight="semibold">ABERTOS</Text>, o
            usuário ganhará cupom comprando em qualquer empresa credenciada da
            cidade.
          </NativeText>
          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            3 - Nos sorteios <Text fontWeight="semibold">FECHADOS</Text> o
            usuário só ganhará cupom comprando na empresa criadora do sorteio.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            4 - O valor de cada cupom é definido pela empresa criadora do
            sorteio.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            5 - O sistema gerará uma prévia dos cupons quando o cashback for
            lançado, porém só será confirmado após o cashback aprovado, aí sim,
            com o cupom confirmado o usuário estará concorrendo ao sorteio.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            6 - A retirada dos prêmios será por conta do usuário ganhador.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            7 - Os sorteios são feitos de forma totalmente aleatória por
            software automático e não viciado, não tendo a Takeback ou nenhuma
            empresa credenciada interferência nos resultados.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            8 - É de inteira responsabilidade da empresa criadora do sorteio, a
            fidelidade entre imagens divulgadas e prêmios entregues. Podendo o
            usuário denunciar através do suporte da Takeback qualquer
            inconsistência notada.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            9 - É de inteira responsabilidade da empresa criadora do sorteio,
            quando for o caso, legalização do sorteio perante órgãos municipais,
            estaduais e federais, sendo a Takeback somente uma plataforma
            intermediadora do sorteio.
          </NativeText>

          <NativeText style={{ fontFamily: 'Montserrat_400Regular' }}>
            10 - A Play Store ou Apple Store{' '}
            <Text fontWeight="bold" color="red.600">
              NÃO
            </Text>{' '}
            tem qualquer responsabilidade na realização dos sorteios nem
            participação nos resultados do mesmo, sendo totalmente isentas de
            qualquer adversidade gerada.
          </NativeText>
        </Stack>
      </ScrollView>
    </Flex>
  )
}
