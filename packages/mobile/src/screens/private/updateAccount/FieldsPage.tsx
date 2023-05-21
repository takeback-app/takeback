import React from 'react'

import {
  Button,
  Flex,
  HStack,
  Heading,
  // Pressable,
  ScrollView,
  Stack,
  Text
} from 'native-base'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'

import { updateAccount } from '../../../services'
import { unMask } from 'react-native-mask-text'
import { isValidBirthDate } from '../../../utils/birthdayValidator'
import { BirthdayInput } from '../../../components/form/BirthdayInput'
import { PhoneInput } from '../../../components/form/PhoneInput'
import { SexInput } from '../../../components/form/SexInput'
import { MaritalStatusInput } from '../../../components/form/MaritalStatusInput'
import { SchoolingInput } from '../../../components/form/SchoolingInput'
import { MonthlyIncomeInput } from '../../../components/form/MonthlyIncomeInput'
import { HasChildrenInput } from '../../../components/form/HasChildrenInput'

enum Field {
  SEX = 'sex',
  BIRTH_DATE = 'birthDate',
  HAS_CHILDREN = 'hasChildren',
  MARITAL_STATUS = 'maritalStatus',
  SCHOOLING = 'schooling',
  MONTHLY_INCOME_ID = 'monthlyIncomeId',
  PHONE = 'phone'
}

export type UpdateAccountData = {
  sex: string
  birthday: string
  hasChildren: string
  maritalStatus: string
  monthlyIncomeId: string
  schooling: string
  phone: string
}

export function FieldsPage({ navigation, route }) {
  const fields = route.params?.fields as Field[]

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = useForm<UpdateAccountData>()

  const { bottom: bottomHeight } = useSafeAreaInsets()

  async function onSubmit(data: UpdateAccountData) {
    if (data.birthday && !isValidBirthDate(data.birthday)) {
      return setError('birthday', { message: 'Data inválida' })
    }

    if (data.phone) {
      data.phone = unMask(data.phone)
    }

    const [isOk, response] = await updateAccount(data)

    if (!isOk) {
      return setError('hasChildren', { message: response.message })
    }

    navigation.navigate('updateSuccessPape')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        keyboardVerticalOffset={bottomHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style="dark" />
        <HStack
          p={4}
          // style={{ marginTop: Platform.OS === 'ios' ? 0 : topHeight }}
          alignItems="center"
          justifyContent="center"
        >
          {/* <Pressable
            position="absolute"
            left="4"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="close" color="#52525b" size={24} />
          </Pressable> */}
          <Text mt={1} fontSize="md" fontWeight="semibold">
            Complete seu cadastro
          </Text>
        </HStack>

        <Flex px={4} flex={1} mt={4}>
          <Flex>
            <Heading fontSize="26" fontWeight="semibold">
              Precisamos que você complete seu cadastro
            </Heading>
            <Text color="gray.600" fontWeight="medium" mt="3">
              É rapidinho, leva menos de 30 segundos 😀
            </Text>
          </Flex>
          <Stack flex="1" mt="4">
            <ScrollView>
              <Stack flex="1" space="8" pb="8">
                {fields.includes(Field.PHONE) && (
                  <PhoneInput control={control} />
                )}

                {fields.includes(Field.SEX) && <SexInput control={control} />}

                {fields.includes(Field.BIRTH_DATE) && (
                  <BirthdayInput control={control} />
                )}

                {fields.includes(Field.MARITAL_STATUS) && (
                  <MaritalStatusInput control={control} />
                )}

                {fields.includes(Field.SCHOOLING) && (
                  <SchoolingInput control={control} />
                )}

                {fields.includes(Field.MONTHLY_INCOME_ID) && (
                  <MonthlyIncomeInput control={control} />
                )}

                <HasChildrenInput control={control} />
              </Stack>
            </ScrollView>
            <Button
              h="12"
              mt="4"
              rounded="full"
              bgColor="blue.600"
              _pressed={{
                bgColor: 'blue.400'
              }}
              _text={{
                fontSize: 'md',
                fontWeight: 'medium'
              }}
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            >
              Atualizar
            </Button>
          </Stack>
        </Flex>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
