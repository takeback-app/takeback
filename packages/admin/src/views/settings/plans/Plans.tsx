import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoAddCircleOutline, IoCreateOutline } from 'react-icons/io5'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { CAppData } from '../../../contexts/CAppData'
import { TPlan } from '../../../types/TPlan'

import Layout from '../../../components/ui/Layout'
import DefaultModal from '../../../components/modals/DefaultModal'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import QuintenaryButton from '../../../components/buttons/QuintenaryButton'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import PrimaryLoader from '../../../components/loaders/primaryLoader'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import PALLET from '../../../styles/ColorPallet'
import * as S from './styles'
import { percentFormat } from '../../../utils/percentFormat'
import SelectInput from '../../../components/inputs/SelectInput'

interface DataProps {
  description: string
  value: number
  takebackBonus: string
  numberOfMonthlyRaffles: number
  numberOfMonthlyNotificationSolicitations: number
  canSendBirthdayNotification: string | boolean
  newUserBonus: number
  canAccessClientReport: string | boolean
  canUseIntegration: string | boolean
}

const Plans: React.FC<React.PropsWithChildren<unknown>> = () => {
  const registerRef = useRef<FormHandles>(null)
  const updateRef = useRef<FormHandles>(null)
  const { plans, setPlans } = useContext(CAppData)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [planId, setPlanId] = useState(0)
  const [pageLoading, setPageLoading] = useState(false)

  const handleFill = (item: TPlan) => {
    updateRef.current?.setData({
      description: item.description,
      value: item.value,
      takebackBonus: item.takebackBonus * 100,
      numberOfMonthlyRaffles: item.numberOfMonthlyRaffles,
      numberOfMonthlyNotificationSolicitations:
        item.numberOfMonthlyNotificationSolicitations,
      canSendBirthdayNotification: item.canSendBirthdayNotification ? '1' : '0',
      canAccessClientReport: item.canAccessClientReport ? '1' : '0',
      canUseIntegration: item.canUseIntegration ? '1' : '0',
      newUserBonus: item.newUserBonus
    })

    setPlanId(item.id)
    setUpdateVisible(true)
  }

  async function validateRegister(data: DataProps) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().required('Informe um nome para o plano'),
        value: Yup.number().required('Informe o valor da mensalidade'),
        numberOfMonthlyRaffles: Yup.number()
          .positive()
          .min(0)
          .required('Campo obrigatório'),
        numberOfMonthlyNotificationSolicitations: Yup.number()
          .positive()
          .min(0)
          .required('Campo obrigatório'),
        newUserBonus: Yup.number()
          .positive()
          .min(0)
          .required('Campo obrigatório'),
        canSendBirthdayNotification: Yup.string().required('Campo obrigatório'),
        canAccessClientReport: Yup.string().required('Campo obrigatório'),
        takebackBonus: Yup.number()
          .positive()
          .min(0)
          .max(100)
          .required('Informe o percentual da gratificação')
      })

      data.canSendBirthdayNotification =
        data.canSendBirthdayNotification === '1'

      data.canAccessClientReport = data.canAccessClientReport === '1'

      data.canUseIntegration = data.canUseIntegration === '1'

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)

      API.post('/manager/plan/register', data)
        .then(response => {
          notifySuccess(response.data.message)
          setPlans(response.data.plans)

          setRegisterVisible(false)
          registerRef.current?.setErrors({})
          registerRef.current?.reset()
        })
        .catch(error => {
          notifyError(error.response.data.message)
        })
        .finally(() => {
          setLoadingButton(false)
        })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        registerRef.current?.setErrors(validationErros)
      }
    }
  }

  async function validateUpdate(data: DataProps) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().required('Informe um nome para o plano'),
        value: Yup.number().required('Informe o valor da mensalidade'),
        takebackBonus: Yup.number()
          .positive()
          .min(0)
          .max(100)
          .required('Informe o percentual da gratificação')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)

      API.put(`/manager/plan/update/${planId}`, {
        description: data.description,
        value: data.value,
        takebackBonus: parseFloat(data.takebackBonus) / 100,
        numberOfMonthlyRaffles: Number(data.numberOfMonthlyRaffles),
        numberOfMonthlyNotificationSolicitations: Number(
          data.numberOfMonthlyNotificationSolicitations
        ),
        canSendBirthdayNotification: data.canSendBirthdayNotification === '1',
        canAccessClientReport: data.canAccessClientReport === '1',
        canUseIntegration: data.canUseIntegration === '1',
        newUserBonus: Number(data.newUserBonus)
      })
        .then(response => {
          notifySuccess(response.data.message)
          setPlans(response.data.plans)
          setUpdateVisible(false)

          updateRef.current?.setErrors({})
        })
        .catch(error => {
          notifyError(error.response.data.message)
        })
        .finally(() => {
          setLoadingButton(false)
        })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        updateRef.current?.setErrors(validationErros)
      }
    }
  }

  const findPlans = () => {
    setPageLoading(true)
    API.get('/manager/plan/find')
      .then(response => {
        setPlans(response.data)
      })
      .catch(error => {
        notifyError(error.response.data.message)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  useEffect(() => {
    findPlans()

    // eslint-disable-next-line
  }, [])

  return (
    <Layout title="Planos e mensalidade">
      {pageLoading ? (
        <PrimaryLoader label="Carregando planos..." />
      ) : (
        <S.Container>
          <S.SubHeader>
            <QuartenaryButton
              label="Adicionar"
              icon={IoAddCircleOutline}
              color={PALLET.COLOR_06}
              onClick={() => setRegisterVisible(true)}
            />
          </S.SubHeader>

          <S.Table>
            <S.THead>
              <S.Tr>
                <S.Th>Id</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Mensalidade</S.Th>
                <S.Th>Número de sorteios mensais</S.Th>
                <S.Th>Número de notificações customizadas por mês</S.Th>
                <S.Th>Gratificação por venda</S.Th>
                <S.Th>Gratificação por novo usuário</S.Th>
                <S.Th>Notificação de aniversário</S.Th>
                <S.Th>Integração NFC-e</S.Th>
                <S.Th>Relatório de clientes</S.Th>
                <S.Th>&nbsp;</S.Th>
              </S.Tr>
            </S.THead>
            <S.TBody>
              {plans.map(item => (
                <S.Tr key={item.id}>
                  <S.Td>{item.id}</S.Td>
                  <S.Td>{item.description}</S.Td>
                  <S.Td>
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2
                    }).format(item.value || 0)}
                  </S.Td>
                  <S.Td>{item.numberOfMonthlyRaffles}</S.Td>
                  <S.Td>{item.numberOfMonthlyNotificationSolicitations}</S.Td>
                  <S.Td>{percentFormat(item.takebackBonus)}</S.Td>
                  <S.Td>
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2
                    }).format(item.newUserBonus || 0)}
                  </S.Td>
                  <S.Td>
                    {item.canSendBirthdayNotification ? 'Ativo' : 'Inativo'}
                  </S.Td>
                  <S.Td>{item.canUseIntegration ? 'Ativo' : 'Inativo'}</S.Td>
                  <S.Td>
                    {item.canAccessClientReport ? 'Ativo' : 'Inativo'}
                  </S.Td>
                  <S.Td>
                    <IoCreateOutline
                      size={20}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFill(item)}
                    />
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>
        </S.Container>
      )}

      <DefaultModal
        visible={registerVisible}
        size="small"
        title="Cadastrar"
        onClose={() => setRegisterVisible(false)}
      >
        <Form ref={registerRef} onSubmit={validateRegister}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Nome do plano" name="description" />
              <PrimaryInput label="Mensalidade" name="value" type="string" />
              <PrimaryInput
                label="Gratificação por venda"
                name="takebackBonus"
                type="string"
                max="100"
                min="0"
              />
              <PrimaryInput
                label="Número de sorteios por mês"
                name="numberOfMonthlyRaffles"
                type="number"
                min="0"
              />
              <PrimaryInput
                label="Número de notificações customizadas por mês"
                name="numberOfMonthlyNotificationSolicitations"
                type="number"
                min="0"
              />
              <PrimaryInput
                label="Gratificação por novo usuário"
                name="newUserBonus"
                type="number"
                min="0"
              />
              <SelectInput
                label="Notificação de aniversário"
                name="canSendBirthdayNotification"
                options={[
                  { id: 1, description: 'Ativo' },
                  { id: 0, description: 'Inativo' }
                ]}
              />
              <SelectInput
                label="Integração NFC-e"
                name="canUseIntegration"
                options={[
                  { id: 1, description: 'Ativo' },
                  { id: 0, description: 'Inativo' }
                ]}
              />
              <SelectInput
                label="Relatório de clientes"
                name="canAccessClientReport"
                options={[
                  { id: 1, description: 'Ativo' },
                  { id: 0, description: 'Inativo' }
                ]}
              />
            </S.InputsWrapper>

            <S.Footer>
              <QuintenaryButton label="Cadastrar" loading={loadingButton} />
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        visible={updateVisible}
        size="small"
        title="Atualizar"
        onClose={() => setUpdateVisible(false)}
      >
        <Form ref={updateRef} onSubmit={validateUpdate}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Nome do plano" name="description" />
              <PrimaryInput label="Mensalidade" name="value" type="string" />
              <PrimaryInput
                label="Gratificação Takeback"
                name="takebackBonus"
                type="string"
                max="100"
                min="0"
              />
              <PrimaryInput
                label="Número de sorteios por mês"
                name="numberOfMonthlyRaffles"
                type="number"
                min="0"
                step={1}
              />
              <PrimaryInput
                label="Número de notificações customizadas por mês"
                name="numberOfMonthlyNotificationSolicitations"
                type="number"
                min="0"
                step={1}
              />
              <PrimaryInput
                label="Gratificação por novo usuário"
                name="newUserBonus"
                type="number"
                min="0"
                step={0.01}
              />
              <SelectInput
                label="Notificação de aniversário"
                name="canSendBirthdayNotification"
                options={[
                  { id: 1, description: 'Ativo' },
                  { id: 0, description: 'Inativo' }
                ]}
              />
              <SelectInput
                label="Integração NFC-e"
                name="canUseIntegration"
                options={[
                  { id: 1, description: 'Ativo' },
                  { id: 0, description: 'Inativo' }
                ]}
              />
              <SelectInput
                label="Relatório de cliente"
                name="canAccessClientReport"
                options={[
                  { id: 1, description: 'Ativo' },
                  { id: 0, description: 'Inativo' }
                ]}
              />
            </S.InputsWrapper>

            <S.Footer>
              <QuintenaryButton label="Atualizar" loading={loadingButton} />
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <Toastify />
    </Layout>
  )
}

export default Plans
