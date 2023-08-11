/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../services/API'
import { CConsumer } from '../../../contexts/CConsumer'
import { maskCPF } from '../../../utils/masks'

import Layout from '../../../components/ui/Layout'
import PageLoader from '../../../components/loaders/primaryLoader'
import ReportButton from '../../../components/buttons/ReportButton'
import TertiaryInput from '../../../components/inputs/TertiaryInput'
import ModalStatus from './modals/ModalStatus'

import * as S from './styles'
import ModalForgotPassword from './modals/ModalForgotPassword'

const ManagerConsumer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const { consumer, setConsumer } = useContext(CConsumer)

  const [loading, setLoading] = useState(false)
  const [modalStatusVisible, setModalStatusVisible] = useState(false)
  const [modalForgotPassVisible, setModalForgotPassVisible] = useState(false)

  const getUserData = () => {
    setLoading(true)
    API.get(`/manager/consumers/find/one/${id}`)
      .then(response => {
        setConsumer(response.data.consumerData)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <Layout
      goBack={() => navigateTo(-1)}
      goBackTitle={consumer.consumer_fullName}
    >
      {loading ? (
        <PageLoader label="Carregando dados do cliente" />
      ) : (
        <S.Container>
          <S.SubHeader>
            <ReportButton
              label="Alterar Status"
              icon={IoPersonOutline}
              color="#cc9900"
              onClick={() => setModalStatusVisible(true)}
            />
            <ReportButton
              label="Recuperar Senha"
              icon={IoKeyOutline}
              color="#0088cc"
              onClick={() => setModalForgotPassVisible(true)}
            />
          </S.SubHeader>

          <Form ref={formRef} onSubmit={() => ({})}>
            <S.Content>
              <S.InfoTitle>Dados do usuário</S.InfoTitle>
              <S.InfoWrapper>
                <TertiaryInput
                  label="Nome"
                  name="fullName"
                  value={consumer.consumer_fullName}
                  disabled
                />
                <TertiaryInput
                  label="CPF"
                  name="cpf"
                  value={maskCPF(consumer.consumer_cpf || '00000000000')}
                  disabled
                />
                <TertiaryInput
                  label="Data de cadastro"
                  name="createdAt"
                  value={new Date(
                    consumer.consumer_createdAt
                  ).toLocaleDateString()}
                  disabled
                />
                <TertiaryInput
                  label="Email"
                  name="email"
                  value={consumer.consumer_email}
                  disabled
                />
                <TertiaryInput
                  label="Telefone"
                  name="phone"
                  value={consumer.consumer_phone}
                  disabled
                />
              </S.InfoWrapper>

              <S.InfoTitle>Endereço</S.InfoTitle>
              <S.InfoWrapper>
                <TertiaryInput
                  label="Cidade"
                  name="city"
                  value={consumer.city_name}
                  disabled
                />
                <TertiaryInput
                  label="CEP"
                  name="zipCode"
                  value={consumer.address_zipCode}
                  disabled
                />
                {consumer.address_street && (
                  <TertiaryInput
                    label="Rua"
                    name="street"
                    value={consumer.address_street}
                    disabled
                  />
                )}
                {consumer.address_district && (
                  <TertiaryInput
                    label="Bairro"
                    name="district"
                    value={consumer.address_district}
                    disabled
                  />
                )}
                {consumer.address_number && (
                  <TertiaryInput
                    label="Número"
                    name="number"
                    value={`${consumer.address_number}`}
                    disabled
                  />
                )}
                {consumer.address_complement && (
                  <TertiaryInput
                    label="Complemento"
                    name="complement"
                    value={consumer.address_complement}
                    disabled
                  />
                )}
              </S.InfoWrapper>
            </S.Content>
          </Form>
        </S.Container>
      )}

      <ModalStatus
        visible={modalStatusVisible}
        onClose={() => setModalStatusVisible(false)}
      />
      <ModalForgotPassword
        visible={modalForgotPassVisible}
        onClose={() => setModalForgotPassVisible(false)}
      />
    </Layout>
  )
}

export default ManagerConsumer
