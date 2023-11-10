import React, { useContext } from 'react'
import { StatusBar } from 'react-native'
import {
  VStack,
  Text,
  View,
  Flex,
  Fab,
  Icon,
  ScrollView,
  useDisclose
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { mask } from 'react-native-mask-text'
import { Ionicons } from '@expo/vector-icons'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'
import { Info } from './components/info'
import { LogoutComponent } from './components/logoutComponent'

import { UserDataContext } from '../../../contexts/UserDataContext'

import { PrivateRouteParam } from '../../../@types/routes'

import { getInitials, sendWhatsAppMessage } from '../../../utils'
import { DeactivateAccount } from './components/DeactivateAccount'
import { TermsOfUse } from '../../public/createAccount/components/termsOfUse'
import * as Application from 'expo-application'

export function Profile() {
  const { userData } = useContext(UserDataContext)
  const { isOpen, onClose, onOpen } = useDisclose()

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function goBack() {
    navigation.goBack()
  }

  function navigateTo({ url }) {
    navigation.navigate(url)
  }

  return (
    <Layout
      style={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#F5F5F5'
      }}
    >
      <Header variant="arrow" title="Ajustes" goBack={goBack} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack justifyContent="center" alignItems="center" space="2" mt="8">
          <Flex
            w="32"
            h="32"
            rounded="full"
            justifyContent="center"
            alignItems="center"
            bgColor="gray.400"
            _text={{
              fontWeight: 'semibold',
              fontSize: '3xl',
              color: 'gray.800'
            }}
          >
            {getInitials(userData.fullName || '')}
          </Flex>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="gray.800"
            textAlign="center"
          >
            {userData.fullName || ''}
          </Text>
        </VStack>

        <View mt="20">
          <Text fontSize="md" fontWeight="medium" color="blue.600" ml="4">
            Minha conta
          </Text>
          <Info
            title="Meu email"
            value={userData.email || ''}
            onPress={() => navigateTo({ url: 'profileEmail' })}
          />
          <Info
            title="Dados pessoais"
            value=""
            onPress={() => navigateTo({ url: 'profileData' })}
          />
          <Info title="Termos de uso" borderB value="" onPress={onOpen} />
          <View h="12" />

          <DeactivateAccount />
          <LogoutComponent />
        </View>
      </ScrollView>
      <Text textAlign="center">
        Versão - {Application.nativeApplicationVersion}
      </Text>

      <Fab
        renderInPortal={false}
        shadow={2}
        mb={4}
        placement="bottom-right"
        size="md"
        bgColor="#128C7E"
        icon={
          <Icon color="white" as={Ionicons} name="logo-whatsapp" size="4" />
        }
        label="Fale conosco!"
        onPress={sendWhatsAppMessage}
      />

      <TermsOfUse modalVisible={isOpen} onClose={onClose} />
    </Layout>
  )
}
