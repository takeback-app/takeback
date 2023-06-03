import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoCreateOutline, IoAddCircleOutline } from 'react-icons/io5'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { CAppData } from '../../../contexts/CAppData'
import { TPayment } from '../../../types/TPayment'

import Layout from '../../../components/ui/Layout'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import QuintenaryButton from '../../../components/buttons/QuintenaryButton'
import DefaultModal from '../../../components/modals/DefaultModal'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import PrimaryLoader from '../../../components/loaders/primaryLoader'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import PALLET from '../../../styles/ColorPallet'
import * as S from './styles'

const PaymentMethods: React.FC<React.PropsWithChildren<unknown>> = () => {
  const registerRef = useRef<FormHandles>(null)
  const updateRef = useRef<FormHandles>(null)
  const { payments, setPayments } = useContext(CAppData)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [methodId, setMethodId] = useState(0)
  const [pageLoading, setPageLoading] = useState(false)

  // eslint-disable-next-line
  async function validateRegister(data: any) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().min(3).required('Informe a descrição')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.post('/manager/payment/register', data)
        .then(response => {
          setPayments(response.data.methods)
          notifySuccess(response.data.message)
          setRegisterVisible(false)
          registerRef.current?.reset()
        })
        .catch(error => {
          notifyError(error.response.data.message)
          setRegisterVisible(true)
        })
        .finally(() => {
          setLoadingButton(false)
        })

      registerRef.current?.setErrors({})
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

  // eslint-disable-next-line
  async function validateUpdate(data: any) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().min(3).required('Informe a descrição')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.put(`/manager/payment/update/${methodId}`, data)
        .then(response => {
          setPayments(response.data.methods)
          notifySuccess(response.data.message)
        })
        .catch(error => {
          notifyError(error.response.data.message)
        })
        .finally(() => {
          setUpdateVisible(false)
          setLoadingButton(false)
        })

      registerRef.current?.setErrors({})
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

  const handleFill = (item: TPayment) => {
    updateRef.current?.setData({
      description: item.description
    })

    setUpdateVisible(true)
    setMethodId(item.id)
  }

  const findPayments = () => {
    setPageLoading(true)
    API.get('/manager/payment/find')
      .then(response => {
        setPayments(response.data)
      })
      .catch(error => {
        notifyError(error.response.data.message)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  useEffect(() => {
    findPayments()

    // eslint-disable-next-line
  }, [])

  return (
    <Layout title="Métodos de pagamento">
      {pageLoading ? (
        <PrimaryLoader label="Carregando métodos de pagamento..." />
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
                <S.Th>&nbsp;</S.Th>
              </S.Tr>
            </S.THead>
            <S.TBody>
              {payments.map(item => (
                <S.Tr key={item.id}>
                  <S.Td>{item.id}</S.Td>
                  <S.Td>{item.description}</S.Td>
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
            <PrimaryInput label="Descrição" name="description" />

            <S.FooterModal>
              <QuintenaryButton label="Cadastrar" loading={loadingButton} />
            </S.FooterModal>
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
            <PrimaryInput label="Descrição" name="description" />

            <S.FooterModal>
              <QuintenaryButton label="Atualizar" loading={loadingButton} />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <Toastify />
    </Layout>
  )
}

export default PaymentMethods
