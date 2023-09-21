import React, { useState, useContext, useRef } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import Lottie from 'react-lottie'
import { useNavigate } from 'react-router'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { AuthContext } from '../../../contexts/AuthContext'
import { maskCPF } from '../../../utils/masks'

import { Layout } from '../../../components/ui/layout'
import { PrimaryInput } from '../../../components/inputs/primaryInput'
import { PasswordInput } from '../../../components/inputs/passwordInput'

import animationData from '../../../assets/money-plant.json'
import Logo from '../../../assets/logos/logoVertical.png'

import * as S from './styles'
import { Button, useToast } from '@chakra-ui/react'

import { AxiosResponse } from 'axios'
import { chakraToastOptions } from '../../../components/ui/toast'

interface LoginProps {
  user: string
  password: string
}

export const SignIn: React.FC = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const {
    setIsSignedIn,
    setIsManager,
    setUserName,
    setIsRootUser,
    setOffice,
    setCompanyName,
    setGenerateCashback,
    setAccessControl
  } = useContext(AuthContext)
  const toast = useToast(chakraToastOptions)

  const [loading, setLoading] = useState(false)
  const [cpf, setCpf] = useState('')
  const [visible, setVisible] = useState(false)

  function toggle() {
    setVisible(!visible)
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  async function validateData(data: LoginProps) {
    try {
      const schema = Yup.object().shape({
        user: Yup.string().min(3).required('Informe o CPF do Usuário'),
        password: Yup.string().min(4).required('Informe a Senha')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      handleLogin(data)

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

  const handleLogin = (data: LoginProps) => {
    setLoading(true)

    API.post('/company/sign-in', {
      user: data.user.replace(/[^\d]/g, ''),
      password: data.password.replace(/\s+$/, '')
    })
      .then(({ data }: AxiosResponse) => {
        API.defaults.headers.common.Authorization = `Bearer ${data.token}`

        sessionStorage.setItem('token', data.token)
        setUserName(data.name)
        setOffice(data.office)
        setIsManager(data.isManager)
        setIsRootUser(data.isRootUser)
        setCompanyName(data.companyName)
        setGenerateCashback(data.generateCashback)
        setIsSignedIn(true)
        setAccessControl(data.accessControl)

        if (data.isManager) {
          navigateTo('/painel')
        } else if (data.generateCashback && data.office === 'Caixa') {
          navigateTo('/caixa')
        } else {
          localStorage.clear()
          sessionStorage.clear()

          setIsSignedIn(false)
          toast({
            title: 'Ops :(',
            description:
              'Você possui cashback vencidos, contate seu administrativo',
            status: 'warning'
          })
        }
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
  }

  return (
    <Layout>
      <S.Container>
        <S.Card>
          <S.LogoBox>
            <S.Logo src={Logo} />
          </S.LogoBox>

          <Form ref={formRef} onSubmit={validateData}>
            <S.InputsWrapper>
              <PrimaryInput
                label="CPF"
                name="user"
                value={cpf}
                maxLength={14}
                onChange={e => setCpf(maskCPF(e.currentTarget.value))}
              />
              <PasswordInput
                name="password"
                label="Senha"
                toggle={toggle}
                visible={visible}
              />
              <S.Footer>
                <Button
                  isLoading={loading}
                  w="full"
                  colorScheme="blue"
                  fontSize="xs"
                  fontWeight="bold"
                  type="submit"
                >
                  Entrar
                </Button>
                <S.Link to="/recuperar-senha">Esqueci minha senha</S.Link>
              </S.Footer>
            </S.InputsWrapper>
          </Form>
        </S.Card>

        <S.Paragraph>
          Ainda não é nosso parceiro?{' '}
          <S.Link to="/cadastrar-se">Cadastre-se</S.Link>
        </S.Paragraph>

        <S.Terms>
          <S.Term to="/politica-de-privacidade" target="_blank">
            Política de Privacidade
          </S.Term>
        </S.Terms>
      </S.Container>

      <S.ContentAnimation>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          isStopped={false}
          isPaused={false}
          isClickToPauseDisabled
        />
      </S.ContentAnimation>
    </Layout>
  )
}
