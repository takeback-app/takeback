/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import {
  IoLockClosedOutline,
  IoWarningOutline,
  IoLogoUsd,
  IoCardOutline,
  IoKeyOutline,
  IoCheckmarkSharp,
  IoTimerOutline,
  IoPersonOutline
} from 'react-icons/io5'

import { API } from '../../../../services/API'
import { CCompany } from '../../../../contexts/CCompany'
import { maskCNPJ, maskLatitudeLongitude } from '../../../../utils/masks'
import { CAppData } from '../../../../contexts/CAppData'

import Layout from '../../../../components/ui/Layout'
import ReportButton from '../../../../components/buttons/ReportButton'
import TertiaryInput from '../../../../components/inputs/TertiaryInput'
import SelectInputWithBorder from '../../../../components/inputs/SelectInputWithBorder'
import { notifyError, notifySuccess } from '../../../../components/ui/Toastify'

import ModalFirstAccess from './modals/ModalFirstAccess'
import ModalStatus from './modals/ModalStatus'
import ModalFee from './modals/ModalFee'
import ModalMontly from './modals/ModalMontly'
import ModalForgotPassword from './modals/ModalForgotPassword'
import { RepresentativeModal } from './modals/RepresentativeModal'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import DefaultModal from '../../../../components/modals/DefaultModal'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'
import { Users } from './users'
import { EditLogo } from './EditLogo'
import { EditIntegration } from './EditIntegration'

const ManagerCompany: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { id } = useParams()
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const provisionalFormRef = useRef<FormHandles>(null)
  const {
    company,
    setCompany,
    companyUsers,
    setCompanyUsers,
    setRepresentatives
  } = useContext(CCompany)
  const { industries, setIndustries, cities } = useContext(CAppData)

  const [modalFirtsAccessVisible, setModalFirstAccessVisible] = useState(false)
  const [modalStatusVisible, setModalStatusVisible] = useState(false)
  const [modalFeeVisible, setModalFeeVisible] = useState(false)
  const [modalMontlyVisible, setModalMontlyVisible] = useState(false)
  const [modalForgotPassVisible, setModalForgotPassVisible] = useState(false)
  const [modalProvisionalAccess, setModalProvisionalAccess] = useState(false)
  const [canUseIntegration, setCanUseIntegration] = useState(false)
  const [registeredNumber, setRegisteredNumber] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [integrationTypeApi, setIntegrationTypeApi] = useState('')

  const [loading, setLoading] = useState(false)

  const findIndustries = () => {
    setLoading(true)
    API.get('/manager/industry/find')
      .then(response => {
        setIndustries(response.data)
      })
      .catch(error => {
        notifyError(error.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getCompanyData = () => {
    setLoading(true)
    API.get(`/manager/company/find/one/${id}`)
      .then(response => {
        setCompany(response.data.company)
        setCompanyUsers(response.data.users)
        setRepresentatives(response.data.representatives)
        setCanUseIntegration(response.data.company.canUseIntegration)
        const integrationType =
          response.data.company.integrationType === null
            ? 'NONE'
            : response.data.company.integrationType
        setIntegrationTypeApi(integrationType)
        setLatitude(String(response.data.company.address_latitude))
        setLongitude(String(response.data.company.address_longitude))

        formRef.current?.setData({
          fantasyName: response.data.company.company_fantasyName,
          corporateName: response.data.company.company_corporateName,
          registeredNumber: response.data.company.company_registeredNumber,
          email: response.data.company.company_email,
          phone: response.data.company.company_phone,
          city: response.data.company.city_id,
          district: response.data.company.address_district,
          street: response.data.company.address_street,
          number: response.data.company.address_number,
          industry: response.data.company.industry_id,
          feeDescription: response.data.company.plan_description,
          feeValue: response.data.company.plan_value,
          status: response.data.company.status_description,
          contactPhone: response.data.company.company_contactPhone,
          useQRCode: response.data.company.company_useQRCode,
          integrationType
        })

        setRegisteredNumber(response.data.company.company_registeredNumber)
      })
      .catch(error => {
        notifyError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const updateCompanyData = (data: any) => {
    setLoading(true)

    API.put(`/manager/company/update/${id}`, {
      email: data.email,
      industryId: data.industry,
      registeredNumber: data.registeredNumber.replace(/[^\d]/g, ''),
      fantasyName: data.fantasyName,
      corporateName: data.corporateName,
      phone: data.phone,
      cityId: data.city,
      district: data.district,
      street: data.street,
      number: data.number,
      longitude: Number(data.longitude),
      latitude: Number(data.latitude),
      contactPhone: data.contactPhone,
      useQRCode: data.useQRCode,
      integrationType:
        data.integrationType !== 'NONE' ? data.integrationType : null
    })
      .then(response => {
        notifySuccess(response.data.message)
        setCompany(response.data.companies)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        notifyError(error.response.data.message)
      })
  }

  async function validateDataEdit(data: any) {
    try {
      const schema = Yup.object().shape({
        fantasyName: Yup.string().min(4).required('Informe o seu nome'),
        registeredNumber: Yup.string().required('Informe o cnpj'),
        email: Yup.string().email().required('informe o email'),
        corporateName: Yup.string()
          .min(4)
          .required('Informe o seu nome corporativo'),
        phone: Yup.string().required('Informe o telefone')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      updateCompanyData(data)

      formRef.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        formRef.current?.setErrors(validationErros)
      }
    }
  }

  const activeProvisionalAccess = () => {
    setLoading(true)
    API.post(`/manager/company/provisional-access/generate/${id}`)
      .then(response => {
        notifySuccess(response.data.message)
        setModalProvisionalAccess(false)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getCompanyData()
    if (industries.length === 0) {
      findIndustries()
    }
  }, [])

  useEffect(() => {
    formRef.current?.setData({
      integrationType: integrationTypeApi
    })
  }, [canUseIntegration, integrationTypeApi])

  return (
    <Layout
      goBackTitle={company?.company_fantasyName}
      goBack={() => navigateTo(-1)}
    >
      <S.Container>
        <S.SubHeader>
          {companyUsers?.length === 0 ? (
            <ReportButton
              label="Liberar Acesso"
              icon={IoLockClosedOutline}
              color="#0088cc"
              onClick={() => setModalFirstAccessVisible(true)}
            />
          ) : (
            <ReportButton
              label="Recuperar Senha"
              icon={IoKeyOutline}
              color="#0088cc"
              onClick={() => setModalForgotPassVisible(true)}
            />
          )}

          <ReportButton
            label="Alterar Status"
            icon={IoWarningOutline}
            color="#cc9900"
            onClick={() => setModalStatusVisible(true)}
          />
          <ReportButton
            label="Configurar Taxa"
            icon={IoLogoUsd}
            color="#8533ff"
            onClick={() => setModalFeeVisible(true)}
          />
          <ReportButton
            label="Configurar Mensalidade"
            icon={IoCardOutline}
            color="#666d44"
            onClick={() => setModalMontlyVisible(true)}
          />
          <ReportButton
            label="Liberação provisória"
            icon={IoTimerOutline}
            color="#009933"
            onClick={() => setModalProvisionalAccess(true)}
          />
          {!loading && (
            <RepresentativeModal
              companyId={id || ''}
              representativeId={company.company_representativeId}
            />
          )}
        </S.SubHeader>

        <Form ref={formRef} onSubmit={validateDataEdit}>
          <S.Content>
            <S.InfoTitle>Dados da empresa</S.InfoTitle>
            <S.InfoWrapper>
              <TertiaryInput label="Nome Fantasia" name="fantasyName" />
              <TertiaryInput label="Razão Social" name="corporateName" />
              <TertiaryInput
                label="CNPJ"
                name="registeredNumber"
                max={18}
                value={maskCNPJ(registeredNumber)}
                onChange={e => setRegisteredNumber(e.currentTarget.value)}
              />
              <TertiaryInput label="Email" name="email" />
              <TertiaryInput label="Telefone de Suporte" name="phone" />
              <TertiaryInput label="Telefone de Contato" name="contactPhone" />
              <TertiaryInput label="Status" name="status" disabled />
              <SelectInputWithBorder
                options={industries}
                label="Ramo de atividade"
                name="industry"
              />
              <SelectInputWithBorder
                options={[
                  {
                    id: 'true',
                    name: 'Ativo'
                  },
                  {
                    id: 'false',
                    name: 'Inativo'
                  }
                ]}
                label="Solicitação por QRCode"
                name="useQRCode"
              />
              {canUseIntegration && (
                <SelectInputWithBorder
                  options={[
                    {
                      id: 'NONE',
                      name: 'Inativo'
                    },
                    {
                      id: 'DESKTOP',
                      name: 'NFCe'
                    },
                    {
                      id: 'CMM',
                      name: 'CMM'
                    }
                  ]}
                  label="Integração"
                  name="integrationType"
                />
              )}
            </S.InfoWrapper>

            <S.InfoTitle>Endereço</S.InfoTitle>
            <S.InfoWrapper>
              <SelectInputWithBorder
                name="city"
                label="Cidade"
                options={cities}
              />
              <TertiaryInput label="Bairro" name="district" />
              <TertiaryInput label="Rua" name="street" />
              <TertiaryInput label="Número" name="number" />
              <TertiaryInput
                label="Longitude"
                name="longitude"
                value={maskLatitudeLongitude(longitude)}
                onChange={e => setLongitude(e.currentTarget.value)}
              />
              <TertiaryInput
                label="Latitude"
                name="latitude"
                value={maskLatitudeLongitude(latitude)}
                onChange={e => setLatitude(e.currentTarget.value)}
              />
            </S.InfoWrapper>

            <S.InfoTitle>Taxas e planos</S.InfoTitle>
            <S.InfoWrapper>
              <TertiaryInput label="Taxa" name="feeDescription" disabled />
              <TertiaryInput label="Valor da Taxa" name="feeValue" disabled />
            </S.InfoWrapper>
            <S.CardFooter>
              <QuartenaryButton
                type="submit"
                label="Atualizar dados"
                color="#43A0E7"
                icon={IoCheckmarkSharp}
              />
            </S.CardFooter>
          </S.Content>
        </Form>
        <S.Content>
          <S.InfoTitle>Logo</S.InfoTitle>

          {!!id && (
            <EditLogo companyId={id} companyLogoUrl={company.company_logoUrl} />
          )}
        </S.Content>
        <S.Content>
          <S.InfoTitle>Usuários</S.InfoTitle>
          <S.TableContainer>
            <Users companyId={id} />
          </S.TableContainer>
        </S.Content>
        <S.Content>
          <S.InfoTitle>Integração NFC-e</S.InfoTitle>

          {!!id && <EditIntegration companyId={id} />}
        </S.Content>
      </S.Container>

      <DefaultModal
        title="ATIVAR LIBERAÇÃO PROVISÓRIA"
        visible={modalProvisionalAccess}
        onClose={() => setModalProvisionalAccess(false)}
      >
        <Form ref={provisionalFormRef} onSubmit={activeProvisionalAccess}>
          <S.ModalContainer>
            <S.ContentConfim>
              <S.Title>
                Confirma a ativação da liberação provisória para a empresa{' '}
                {company.company_fantasyName}?
              </S.Title>
              <S.Label>
                Ao confirmar, o status da empresa será alterado para
                &apos;Liberação provisória&apos;
              </S.Label>
            </S.ContentConfim>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '10px',
                gap: '10px'
              }}
            >
              <QuartenaryButton
                label="Confirmar"
                color={PALLET.COLOR_08}
                type="submit"
                loading={loading}
              />
            </div>
          </S.ModalContainer>
        </Form>
      </DefaultModal>

      <ModalFirstAccess
        visible={modalFirtsAccessVisible}
        onClose={() => setModalFirstAccessVisible(false)}
      />

      <ModalStatus
        visible={modalStatusVisible}
        onClose={() => setModalStatusVisible(false)}
      />

      <ModalFee
        visible={modalFeeVisible}
        onClose={() => setModalFeeVisible(false)}
      />

      <ModalMontly
        visible={modalMontlyVisible}
        onClose={() => setModalMontlyVisible(false)}
      />

      <ModalForgotPassword
        visible={modalForgotPassVisible}
        onClose={() => setModalForgotPassVisible(false)}
      />
    </Layout>
  )
}

export default ManagerCompany
