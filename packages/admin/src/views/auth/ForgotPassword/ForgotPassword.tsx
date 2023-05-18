import React, { useRef, useState } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { maskCPF } from '../../../utils/masks'

import Layout from '../../../components/ui/Layout'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import * as S from './styles'

interface FormFields {
  cpf: string
}

const ForgotPassword: React.FC<React.PropsWithChildren<unknown>> = () => {
  const formRef = useRef<FormHandles>(null)
  const navigateTo = useNavigate()

  const [loading, setLoading] = useState(false)
  const [cpf, setCpf] = useState('')

  async function validateData(data: FormFields) {
    try {
      const schema = Yup.object().shape({
        cpf: Yup.string().min(11).required('Informe o cpf')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoading(true)
      API.post('/manager/forgot-password', {
        cpf: data.cpf.replace(/[^\d]/g, '')
      })
        .then(response => {
          notifySuccess(response.data.message)
          setTimeout(() => {
            navigateTo('/')
          }, 5000)
        })
        .catch(error => {
          notifyError(error.response.data.message)
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
          <S.Title>Recuperação de senha</S.Title>

          <Form ref={formRef} onSubmit={validateData}>
            <PrimaryInput
              label="Informe seu cpf"
              name="cpf"
              value={cpf}
              maxLength={18}
              onChange={e => setCpf(maskCPF(e.currentTarget.value))}
            />
            <S.Footer>
              <PrimaryButton label="RECUPERAR" loading={loading} />
            </S.Footer>
          </Form>
        </S.Card>
        <S.Link to="/">
          <IoIosArrowBack />
          Voltar
        </S.Link>
      </S.Container>

      <Toastify />
    </Layout>
  )
}

export default ForgotPassword
