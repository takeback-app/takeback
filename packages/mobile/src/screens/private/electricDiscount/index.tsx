import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Stack,
  Text
} from 'native-base'
import React from 'react'
import { Platform, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import takebackLogo from '../../../../assets/icon.png'
import cemigLogo from '../../../../assets/logos/cemig-logo.png'
import iGreenLogo from '../../../../assets/logos/igreen-energy-logo.png'
import { sendIGreenMessage } from '../../../utils'

export function ElectricDiscount({ navigation }) {
  const { top: topHeight, bottom } = useSafeAreaInsets()

  return (
    <Flex flex={1} align="stretch" bg="white">
      <StatusBar style="auto" />
      <HStack
        p={4}
        style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" color="#52525b" size={24} />
        </Pressable>
      </HStack>
      <Stack alignItems="center" space={5} px={10} mt={4}>
        <Flex align="center">
          <Image
            w="16"
            h="16"
            rounded="lg"
            bg="blue.50"
            source={takebackLogo}
            alt="Logo Takeback"
          />
          <HStack mt={2} space={2}>
            <Image
              w="16"
              h="16"
              rounded="lg"
              source={cemigLogo}
              alt="Logo Cemig"
            />
            <Image
              w="16"
              h="16"
              rounded="lg"
              source={iGreenLogo}
              alt="Logo iGreen"
            />
          </HStack>
        </Flex>

        <Stack space={2}>
          <Heading textAlign="center" fontSize="sm" fontWeight="semibold">
            O Takeback, em parceria com a Cemig e a IGreen Energy, traz para
            você uma ótima oportunidade:
          </Heading>
          <Text
            textAlign="center"
            fontWeight="medium"
            fontSize="13px"
            color="gray.500"
          >
            Desconto na sua conta de Energia ⚡
          </Text>
        </Stack>
        <Flex bg="green.200" w="full" py={4} align="center" rounded="lg">
          <Text fontWeight="semibold" color="gray.800" fontSize="md">
            Até 15% de desconto
          </Text>
        </Flex>

        <Text
          textAlign="center"
          fontWeight="medium"
          fontSize="13px"
          color="gray.500"
        >
          Clique no botão abaixo e consulte com o nosso suporte se este
          benefício já está disponível para você
        </Text>
      </Stack>
      <Flex
        flex={1}
        px={10}
        style={{ paddingBottom: bottom }}
        justify="flex-end"
      >
        <Button
          h="12"
          rounded="full"
          bgColor="#128C7E"
          leftIcon={
            <Icon color="white" as={Ionicons} name="logo-whatsapp" size="4" />
          }
          _pressed={{ bgColor: '#128C7E' }}
          _text={{
            fontSize: 'md',
            fontWeight: 'medium'
          }}
          onPress={sendIGreenMessage}
        >
          Falar com o suporte
        </Button>
      </Flex>
    </Flex>
    // <Flex style={styles.container}>
    //   <Flex style={styles.content}>
    //     <Text style={styles.title}>Olá, {userData.fullName}!</Text>
    //     <Text style={styles.subtitle}>
    //       O Takeback, em parceria com a Cemig e a Igreen Energy traz para você
    //       uma ótima oportunidade:
    //     </Text>
    //     <Text style={styles.discount}>
    //       Desconto de até 15% em sua conta de Energia ⚡️
    //     </Text>
    //     <Button
    //       style={styles.button}
    //       onPress={() => console.log('Falar com o suporte')}
    //     >
    //       <Text style={styles.buttonText}>Falar com o suporte</Text>
    //     </Button>
    //   </Flex>
    // </Flex>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  discount: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007aff'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
})
