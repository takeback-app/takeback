import React, { useRef, useState } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { maskCPF } from '../../../utils/masks'

import { Layout } from '../../../components/ui/layout'
import { PrimaryInput } from '../../../components/inputs/primaryInput'
import { Loader } from '../../../components/ui/loader'
import { ButtonBlue } from '../../../components/buttons'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface FormFields {
  registeredNumber: string
  cpf: string
}

export const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastOptions)

  const [loading, setLoading] = useState(false)
  const [cpf, setCpf] = useState('')

  async function validateData(data: FormFields) {
    try {
      const schema = Yup.object().shape({
        cpf: Yup.string().min(14).required('Informe o CPF')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoading(true)
      API.post('/company/forgot-password', {
        registeredNumber: data.registeredNumber?.replace(/[^\d]/g, ''),
        cpf: data.cpf.replace(/[^\d]/g, '')
      })
        .then(response => {
          toast({
            title: 'Sucesso :)',
            description: response.data.message,
            status: 'success'
          })
          setTimeout(() => {
            navigateTo('/')
          }, 3000)
        })
        .catch(error => {
          toast({
            title: 'Erro :(',
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
          <S.Title>Recuperação de senha</S.Title>

          <div>
            <S.SubTitle>
              ATENÇÃO! ESSE PROCEDIMENTO É EXCLUSIVO PARA USUÁRIOS
              ADMINISTRADORES.
            </S.SubTitle>
            <S.Paragraph>
              Caso você não seja um administrador, entre em contato com o seu
              supervisor na empresa e solicite a alteração da sua senha.
            </S.Paragraph>
          </div>

          <Form ref={formRef} onSubmit={validateData}>
            <PrimaryInput
              label="CPF"
              name="cpf"
              value={cpf}
              maxLength={14}
              onChange={e => setCpf(maskCPF(e.currentTarget.value))}
            />
            <S.Footer>
              <ButtonBlue disabled={loading}>
                {loading ? <Loader /> : <strong>RECUPERAR</strong>}
              </ButtonBlue>
            </S.Footer>
          </Form>
        </S.Card>
        <S.Link to="/">
          <IoIosArrowBack />
          Voltar
        </S.Link>
      </S.Container>
    </Layout>
  )
}
