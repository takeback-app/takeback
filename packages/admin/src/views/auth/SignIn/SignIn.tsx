import React, { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router'
import Lottie from 'react-lottie'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import { API } from '../../../services/API'
import { AuthContext } from '../../../contexts/AuthContext'
import { maskCPF } from '../../../utils/masks'

import Layout from '../../../components/ui/Layout'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import PasswordInput from '../../../components/inputs/PasswordInput'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import Toastify, { notifyError } from '../../../components/ui/Toastify'

import animationData from '../../../assets/money-plant.json'
import Logo from '../../../assets/branding/logo-vertical.svg'

import * as S from './styles'

interface LoginProps {
  user: string
  pass: string
}

const SignIn: React.FC<React.PropsWithChildren<unknown>> = () => {
  const formRef = useRef<FormHandles>(null)
  const navigateTo = useNavigate()
  const { setIsSignedIn, setUserEmail, setUserName, setUserType, setIsRoot } =
    useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [cpf, setCpf] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const toggle = () => {
    setIsVisible(!isVisible)
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
        user: Yup.string().min(14).required('Informe o cpf'),
        pass: Yup.string().required('Informe a taxa')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      handleLogin(data)

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

  const handleLogin = (data: LoginProps) => {
    setLoading(true)

    API.post('/manager/user/login', {
      cpf: data.user.replace(/[^\d]/g, ''),
      password: data.pass
    })
      .then(response => {
        API.defaults.headers.common.Authorization = `Bearer ${response.data.token}`

        sessionStorage.setItem('token', response.data.token)

        setUserEmail(response.data.email)
        setUserName(response.data.name)
        setUserType(response.data.userType)
        setIsRoot(response.data.isRoot)
        setIsSignedIn(true)
        setLoading(false)
        navigateTo('/dashboard')
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
          <S.LogoWrapper>
            <img src={Logo} alt="Logo TakeBack" />
          </S.LogoWrapper>
          <Form onSubmit={validateData} ref={formRef}>
            <S.InputsWrapper>
              <PrimaryInput
                label="CPF"
                name="user"
                onChange={e => setCpf(maskCPF(e.currentTarget.value))}
                value={cpf}
              />
              <PasswordInput
                label="Senha"
                name="pass"
                visible={isVisible}
                toggle={toggle}
              />

              <S.Space />
              <PrimaryButton textColor="#fff" label="Login" loading={loading} />
              <S.Link to="/recuperar-senha">Esqueci minha senha</S.Link>
            </S.InputsWrapper>
          </Form>
        </S.Card>
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
      <Toastify />
    </Layout>
  )
}

export default SignIn
