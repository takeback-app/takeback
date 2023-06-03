import React, { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import { API } from '../../../services/API'

import Layout from '../../../components/ui/Layout'
import PasswordInput from '../../../components/inputs/PasswordInput'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import * as S from './styles'

interface LoginProps {
  newPassword: string
  confirmNewPassword: string
}

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const ResetPassword: React.FC<React.PropsWithChildren<unknown>> = () => {
  const query = useQuery()
  const formRef = useRef<FormHandles>(null)
  const navigateTo = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const toggle = () => {
    setIsVisible(!isVisible)
  }

  async function validateData(data: LoginProps) {
    try {
      const schema = Yup.object().shape({
        newPassword: Yup.string().min(4).required('Informe o cpf'),
        confirmNewPassword: Yup.string().oneOf(
          [Yup.ref('newPassword')],
          'Coloque uma senha compatível'
        )
      })

      await schema.validate(data, {
        abortEarly: false
      })

      handleUdatePassword(data)

      formRef.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        formRef.current?.setErrors(validationErros)
      }
    }
  }

  const handleUdatePassword = (data: LoginProps) => {
    setLoading(true)

    const token = query.get('token')

    if (!token) {
      return notifyError('Houve um erro inesperado!')
    }

    API.post('/manager/reset-password', {
      newPassword: data.newPassword,
      token
    })
      .then(response => {
        notifySuccess(response.data.message)

        setTimeout(() => {
          navigateTo('/')
        }, 2500)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
        setLoading(false)
      })
  }

  return (
    <Layout>
      <S.Container>
        <S.Card>
          <Form onSubmit={validateData} ref={formRef}>
            <S.Title>Resetar senha</S.Title>
            <S.InputsWrapper>
              <PasswordInput
                label="Nova senha"
                name="newPassword"
                visible={isVisible}
                toggle={toggle}
              />
              <PasswordInput
                label="Confirme nova senha"
                name="confirmNewPassword"
                visible={isVisible}
                toggle={toggle}
              />
              <S.Footer>
                <PrimaryButton
                  textColor="#fff"
                  label="RESETAR"
                  loading={loading}
                />
              </S.Footer>
            </S.InputsWrapper>
          </Form>
        </S.Card>
      </S.Container>

      <Toastify />
    </Layout>
  )
}

export default ResetPassword
