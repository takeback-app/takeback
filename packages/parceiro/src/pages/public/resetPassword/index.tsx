import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import { API } from '../../../services/API'

import { Layout } from '../../../components/ui/layout'
import { PasswordInput } from '../../../components/inputs/passwordInput'
import { Loader } from '../../../components/ui/loader'
import { ButtonBlue } from '../../../components/buttons'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface FormFields {
  newPassword: string
  confirmNewPassword: string
}

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

export const ResetPassword: React.FC = () => {
  const query = useQuery()
  const formRef = useRef<FormHandles>(null)
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastOptions)

  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  async function validateData(data: FormFields) {
    try {
      const schema = Yup.object().shape({
        newPassword: Yup.string().min(4).required('Informe a nova senha'),
        confirmNewPassword: Yup.string().oneOf(
          [Yup.ref('newPassword')],
          'Coloque uma senha compatível'
        )
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const token = query.get('token')

      if (!token) {
        toast({
          title: 'Ops :(',
          description: 'Houve um erro inesperado!',
          status: 'error'
        })
      }

      setLoading(true)
      API.post('/company/reset-password', {
        newPassword: data.newPassword.replace(/\s/g, ''),
        token
      })
        .then(response => {
          toast({
            title: 'Sucesso :)',
            description: response.data.message,
            status: 'success'
          })

          setTimeout(() => {
            navigateTo('/')
          }, 2500)
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
        .finally(() => {
          setLoading(false)
        })

      formRef.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErrors: any = {}

        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })

        formRef.current?.setErrors(validationErrors)
      }
    }
  }

  return (
    <Layout>
      <S.Container>
        <S.Card>
          <S.Title>Resetar senha</S.Title>
          <Form ref={formRef} onSubmit={validateData}>
            <PasswordInput
              label="Nova senha"
              name="newPassword"
              visible={newPasswordVisible}
              toggle={() => setNewPasswordVisible(!newPasswordVisible)}
            />
            <PasswordInput
              label="Confirme a senha"
              name="newPassword"
              visible={confirmPasswordVisible}
              toggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            />
            <S.Footer>
              <ButtonBlue disabled={loading}>
                {loading ? <Loader /> : <strong>RESETAR</strong>}
              </ButtonBlue>
            </S.Footer>
          </Form>
        </S.Card>
      </S.Container>
    </Layout>
  )
}
