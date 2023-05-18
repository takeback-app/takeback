import React, { useState, useRef, useContext } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'
import { AuthContext } from '../../../contexts/AuthContext'

import { Layout } from '../../../components/ui/layout'
import { DefaultModal } from '../../../components/modals/defaultModal'

import { PasswordInput } from '../../../components/inputs/passwordInput'
import { OutlinedButton } from '../../../components/buttons'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface PropsForm {
  password: string
  newPassword: string
  confirmNewPassword: string
}

export const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const { setIsSignedIn } = useContext(AuthContext)

  const [loading, setLoading] = useState(false)
  const [inputVisible, setInputVisible] = useState<boolean>()
  const [modalUpdatePasswordVisible, setModalUpdatePasswordVisible] =
    useState(false)

  async function validateData(data: PropsForm) {
    try {
      const schema = Yup.object().shape({
        password: Yup.string().min(4).required('Informe sua senha!'),
        newPassword: Yup.string().min(4).required('Informe sua nova senha!'),
        confirmNewPassword: Yup.string().oneOf(
          [Yup.ref('newPassword')],
          'Coloque uma senha compatível'
        )
      })

      await schema.validate(data, {
        abortEarly: false
      })

      updatePassword(data)

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

  const handleLogout = () => {
    setIsSignedIn(false)
    localStorage.clear()
    sessionStorage.clear()
  }

  const updatePassword = (data: PropsForm) => {
    setLoading(true)
    API.put('/company/user/password/update', {
      password: data.password,
      newPassword: data.newPassword
    })
      .then(response => {
        toast({
          title: 'Sucesso!',
          description: response.data,
          duration: 1000,
          status: 'success'
        })
        setTimeout(() => {
          setModalUpdatePasswordVisible(false)
          handleLogout()
        }, 3000)
      })
      .catch(error => {
        setLoading(false)
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
  }

  return (
    <>
      <Layout title="Meu usuário">
        <S.Container>
          <h4>Alterar Minha Senha</h4>
          <S.Description>
            Ao alterar sua senha você será desconectado do sistema e precisará
            efetuar login novamente.
          </S.Description>
          <S.Toggle
            disabled={loading}
            onClick={() => setModalUpdatePasswordVisible(true)}
          >
            Alterar Senha
          </S.Toggle>
        </S.Container>
      </Layout>

      <DefaultModal
        title="Redefinir senha"
        visible={modalUpdatePasswordVisible}
        onClose={() => setModalUpdatePasswordVisible(false)}
      >
        <Form ref={formRef} onSubmit={validateData} style={{ width: '100%' }}>
          <S.ModalContent>
            <PasswordInput
              name="password"
              label="Senha Atual"
              toggle={() => setInputVisible(!inputVisible)}
              visible={inputVisible}
            />
            <PasswordInput
              name="newPassword"
              label="Nova senha"
              toggle={() => setInputVisible(!inputVisible)}
              visible={inputVisible}
            />
            <PasswordInput
              name="confirmNewPassword"
              label="Confirme sua nova senha"
              toggle={() => setInputVisible(!inputVisible)}
              visible={inputVisible}
            />
            <S.ModalFooter>
              <OutlinedButton
                type="submit"
                loading={loading}
                disabled={loading}
                color={theme.colors['blue-600']}
              >
                <span>Salvar</span>
              </OutlinedButton>
            </S.ModalFooter>
          </S.ModalContent>
        </Form>
      </DefaultModal>
    </>
  )
}
