/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useContext } from 'react'

import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { AuthContext } from '../../../contexts/AuthContext'

import Modal from '../../modals/DefaultModal'

import { API } from '../../../services/API'

import PasswordInput from '../../inputs/PasswordInput/PasswordInput'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import * as S from './styles'
import QuintenaryButton from '../../buttons/QuintenaryButton'

interface Props {
  isActive: boolean
  setIsActive: (e: any) => void
}

interface PropsForm {
  password: string
  newPassword: string
  confirmNewPassword: string
}

const ModalUpdatePassword: React.FC<React.PropsWithChildren<Props>> = ({
  isActive,
  setIsActive
}) => {
  const formRef = useRef<FormHandles>(null)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setIsSignedIn } = useContext(AuthContext)

  function toggle() {
    setVisible(!visible)
  }

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
    API.put('/manager/user/password/update', {
      password: data.password,
      newPassword: data.newPassword
    })
      .then(response => {
        notifySuccess(response.data)
        setTimeout(() => {
          setIsActive(!isActive)
          handleLogout()
        }, 3000)
      })
      .catch(error => {
        notifyError(error.response.data.message)
        setLoading(false)
      })
  }

  return (
    <>
      <Modal
        title="Redefinir senha"
        visible={isActive}
        onClose={() => setIsActive(false)}
        size="extrasmall"
      >
        <Form ref={formRef} onSubmit={validateData} style={{ width: '100%' }}>
          <S.ModalContent>
            <PasswordInput
              name="password"
              label="Senha Atual"
              toggle={toggle}
              visible={visible}
            />
            <PasswordInput
              name="newPassword"
              label="Nova senha"
              toggle={toggle}
              visible={visible}
            />
            <PasswordInput
              name="confirmNewPassword"
              label="Confirme sua nova senha"
              toggle={toggle}
              visible={visible}
            />
            <S.ModalFooter>
              <QuintenaryButton label="Salvar" loading={loading} />
            </S.ModalFooter>
          </S.ModalContent>
        </Form>
      </Modal>
      <Toastify />
    </>
  )
}

export default ModalUpdatePassword
