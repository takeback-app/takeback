import React, { useState } from 'react'

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import * as Clipboard from 'expo-clipboard'
import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Stack,
  Text
} from 'native-base'
import { Platform, Pressable, TouchableOpacity } from 'react-native'
import { useDepositStore } from './state'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { masks } from '../../../utils'
import { AlertComponent } from '../../../components/alert'

export function DepositConfirmation({ navigation }) {
  const [showAlert, setShowAlert] = useState(false)

  const { pix, reset } = useDepositStore()

  const { bottom: bottomHeight, top: topHeight } = useSafeAreaInsets()

  function handleExit() {
    navigation.popToTop()
    navigation.goBack(null)
    reset()
  }

  async function handleCopy() {
    await Clipboard.setStringAsync(pix?.copiaCola || '')

    setShowAlert(true)
  }

  if (!pix) {
    return null
  }

  return (
    <Flex flex={1} bg="white">
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={handleExit}>
          <MaterialCommunityIcons name="close" color="#52525b" size={24} />
        </Pressable>
      </HStack>

      <Stack
        flex="1"
        mb={bottomHeight}
        px="4"
        space="8"
        justifyContent="center"
      >
        <Stack space={2} alignItems="center" justifyContent="center">
          <Heading
            fontSize="xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
          >
            Solicitação de deposito enviada
          </Heading>
          <Text
            textAlign="center"
            color="gray.600"
            fontWeight="medium"
            maxW="75%"
          >
            Agora pague usando o QR Code na sua tela ou copie o código.
          </Text>
          <Box p={1} borderWidth={2} borderColor="blue.600" borderRadius={8}>
            <Image
              source={{ uri: pix.qrCodeImage }}
              alt="qrcode"
              w={48}
              h={48}
            />
          </Box>
        </Stack>

        <Center
          borderStyle="dashed"
          borderWidth="1"
          borderColor="gray.400"
          rounded="md"
          py="8"
        >
          <Heading
            fontSize="3xl"
            color="gray.800"
            fontWeight="bold"
            textAlign="center"
          >
            {masks.maskCurrency(Number(pix.value))}
          </Heading>
          <Box mt={3}>
            <TouchableOpacity onPress={handleCopy}>
              <HStack alignItems="center" justifyContent="center" space={2}>
                <Text fontWeight="bold" fontSize="md" color="blue.400">
                  Copiar Pix Copia e Colaaa
                </Text>
                <Icon as={Feather} name="copy" size="lg" color="blue.400" />
              </HStack>
            </TouchableOpacity>
          </Box>
        </Center>
        <AlertComponent
          status="info"
          title="Código copiado"
          showAlert={showAlert}
          closeAlert={() => setShowAlert(false)}
        />
      </Stack>
    </Flex>
  )
}
