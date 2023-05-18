import React, { useState, useContext } from 'react'
import { Platform, TextInputProps, KeyboardAvoidingView } from 'react-native'
import { View, Text, Input, ScrollView, Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { mask } from 'react-native-mask-text'
import { Formik } from 'formik'

import { API } from '../../../services/API'
import { UserDataContext } from '../../../contexts/UserDataContext'

import { Layout } from '../../../components/layout'
import { Header } from '../../../components/header'

import { PrivateRouteParam } from '../../../@types/routes'

interface InputComponentProps extends TextInputProps {
  name: string
  label: string
  isDisabled?: boolean
}

export function ProfileData() {
  const { userData, setUserData } = useContext(UserDataContext)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRouteParam>>()

  function goBack() {
    navigation.goBack()
  }

  function handleSubmit(values: any) {
    setIsLoading(true)
    API.put('costumer/update/data/v2', {
      values
    })
      .then(response => {
        setUserData(response.data)
      })
      .finally(() => {
        setIsLoading(false)
        setIsDisabled(true)
      })
  }

  return (
    <Layout>
      <Header
        title="Dados pessoais"
        variant="arrow"
        goBack={goBack}
        onEdit={() => setIsDisabled(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Formik
          initialValues={{
            fullName: userData.fullName,
            cpf: userData.cpf,
            birthDate: userData.birthDate,
            address: {
              street: userData.address.street,
              district: userData.address.district,
              number: userData.address.number,
              city: userData.address.city.name,
              zipCode: userData.address.zipCode,
              complement: userData.address.complement
            }
          }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleSubmit, values }) => (
            <ScrollView px="4">
              <View pt="4">
                <Text fontSize="md" fontWeight="medium" color="blue.600">
                  Dados pessoais
                </Text>
                <View>
                  <InputComponent
                    name="fullName"
                    label="Nome completo"
                    onChangeText={handleChange('fullName')}
                    value={values.fullName}
                    keyboardType="default"
                    isDisabled={isDisabled || isLoading}
                  />
                  <InputComponent
                    name="cpf"
                    label="CPF"
                    onChangeText={handleChange('cpf')}
                    value={mask(values.cpf, '999.999.999-99')}
                    keyboardType="numeric"
                    isDisabled
                  />
                </View>
              </View>

              <View pt="4">
                <Text fontSize="md" fontWeight="medium" color="blue.600">
                  Meu endereço
                </Text>
                <View>
                  <InputComponent
                    name="street"
                    label="Rua"
                    onChangeText={handleChange('address.street')}
                    value={values.address.street}
                    keyboardType="default"
                    isDisabled={isDisabled || isLoading}
                  />
                  <InputComponent
                    name="district"
                    label="Bairro"
                    onChangeText={handleChange('address.district')}
                    value={values.address.district}
                    keyboardType="default"
                    isDisabled={isDisabled || isLoading}
                  />
                  <InputComponent
                    name="number"
                    label="Número"
                    onChangeText={handleChange('address.number')}
                    value={values.address.number}
                    keyboardType="default"
                    isDisabled={isDisabled || isLoading}
                  />
                  <InputComponent
                    name="complement"
                    label="Complemento"
                    onChangeText={handleChange('address.complement')}
                    value={values.address.complement}
                    keyboardType="default"
                    isDisabled={isDisabled || isLoading}
                  />
                  <InputComponent
                    name="zipCode"
                    label="Cep"
                    onChangeText={handleChange('address.zipCode')}
                    value={mask(values.address.zipCode, '99999-999')}
                    keyboardType="numeric"
                    isDisabled={isDisabled || isLoading}
                  />
                  <InputComponent
                    name="city"
                    label="Cidade"
                    onChangeText={handleChange('address.city')}
                    value={values.address.city}
                    keyboardType="default"
                    isDisabled
                  />
                </View>
              </View>

              {!isDisabled && (
                <Button
                  h="12"
                  my="4"
                  rounded="full"
                  bgColor="blue.600"
                  onPress={() => handleSubmit()}
                  isLoading={isLoading}
                  _pressed={{
                    bgColor: 'blue.400'
                  }}
                  _text={{
                    fontSize: 'md',
                    fontWeight: 'medium'
                  }}
                >
                  Atualizar dados
                </Button>
              )}
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Layout>
  )
}

function InputComponent(props: InputComponentProps) {
  return (
    <View py="2">
      <Text fontSize="sm" fontWeight="semibold" color="gray.800" mb="1">
        {props.label}
      </Text>
      <Input
        h="12"
        variant="filled"
        fontSize="sm"
        fontWeight="medium"
        color="gray.800"
        isDisabled={props.isDisabled}
        onChangeText={props.onChangeText}
        value={props.value}
        _disabled={{
          color: 'gray.800',
          bgColor: 'muted.200'
        }}
        _focus={{
          bgColor: 'blue.50',
          borderColor: 'blue.600'
        }}
        {...props}
      />
    </View>
  )
}
