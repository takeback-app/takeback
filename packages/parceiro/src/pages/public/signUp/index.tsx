import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Lottie from 'react-lottie'

import { API } from '../../../services/API'
import { IndustryTypes } from '../../../types/IndustryTypes'
import { CompanyDataTypes } from '../../../types/CompanyDataTypes'
import { maskCNPJ, maskCEP } from '../../../utils/masks'

import { Layout } from '../../../components/ui/layout'
import { PrimaryInput } from '../../../components/inputs/primaryInput'
import { Checkbox } from '../../../components/inputs/checkbox'
import { SelectInput } from '../../../components/inputs/selectInput'
import { PrimaryAlert } from '../../../components/modals/primaryAlert'
import { Loader } from '../../../components/ui/loader'
import { ButtonBlue } from '../../../components/buttons'

import animationData from '../../../assets/money-plant.json'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

export const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const toast = useToast(chakraToastOptions)

  const navigate = useNavigate()
  const [industries, setIndustries] = useState<[IndustryTypes]>()
  const [loading, setLoading] = useState(false)
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false)
  const [check, setCheck] = useState(false)
  const [cnpj, setCnpj] = useState('')
  const [cep, setCep] = useState('')

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const findIndustries = useCallback(() => {
    API.get('/company/industries/find')
      .then(response => {
        setIndustries(response.data)
      })
      .catch(error => {
        if (error.isAxiosError) {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        }
      })
  }, [toast])

  async function validateData(data: CompanyDataTypes) {
    try {
      const schema = Yup.object().shape({
        registeredNumber: Yup.string().min(18).required('Informe o CNPJ'),
        corporateName: Yup.string().required('Informe a Razão Social'),
        fantasyName: Yup.string().required('Informe o Nome Fantasia'),
        phone: Yup.string().min(5).required('Informe o Telefone'),
        email: Yup.string().email().required('Informe o Email'),
        zipCode: Yup.string().min(8).required('Informe o CEP')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      sendData(data)

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

  function sendData(data: CompanyDataTypes) {
    if (check) {
      setLoading(true)
      API.post('/company/sign-up', {
        industry: data.industry,
        corporateName: data.corporateName,
        email: data.email,
        fantasyName: data.fantasyName,
        phone: data.phone,
        registeredNumber: data.registeredNumber.replace(/[^\d]/g, ''),
        zipCode: data.zipCode.replace(/[^\d]/g, '')
      })
        .then(() => {
          setLoading(false)
          setModalSuccessVisible(true)
        })
        .catch(error => {
          setLoading(false)
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
    } else {
      toast({
        title: 'Atenção!',
        description: 'Você deve aceitar a política de privacidade',
        status: 'warning'
      })
    }
  }

  function closeAlertSuccess() {
    setModalSuccessVisible(false)
    navigate('/')
  }

  useEffect(() => {
    findIndustries()
  }, [findIndustries])

  return (
    <Layout>
      <S.Container>
        <S.Card>
          <S.Title>
            Cadastre-se e Conquiste
            <br />
            Seus Clientes
          </S.Title>

          <Form ref={formRef} onSubmit={validateData}>
            <S.InputsWrapper>
              <PrimaryInput
                label="CNPJ"
                name="registeredNumber"
                maxLength={18}
                value={cnpj}
                onChange={e => setCnpj(maskCNPJ(e.currentTarget.value))}
              />
              <PrimaryInput label="Razão Social" name="corporateName" />
              <PrimaryInput label="Nome Fantasia" name="fantasyName" />
              <PrimaryInput label="E-mail" name="email" type="email" />
              <S.InputOtherDirectionWrapper>
                <PrimaryInput label="Telefone" name="phone" />
                <PrimaryInput
                  label="CEP"
                  name="zipCode"
                  marginLeft="0.8rem"
                  maxLength={8}
                  value={cep}
                  onChange={e => setCep(maskCEP(e.currentTarget.value))}
                />
              </S.InputOtherDirectionWrapper>
              <SelectInput
                label="Ramo de Atividade"
                name="industry"
                disabled={false}
                options={industries}
              />
              <Checkbox
                label="Li e concordo com a Política de Privacidade"
                name="checkbox"
                checked={check}
                onChange={() => setCheck(!check)}
              />
              <ButtonBlue disabled={loading}>
                {loading ? <Loader /> : <strong>Solicitar meu Cadastro</strong>}
              </ButtonBlue>
              <S.ForgotPass to="/">Voltar</S.ForgotPass>
            </S.InputsWrapper>
          </Form>
        </S.Card>

        <S.Terms>
          <S.Term to="/politica-de-privacidade" target="_blank">
            Política de Privacidade
          </S.Term>
        </S.Terms>
      </S.Container>

      <S.ContentAnimation>
        <Lottie
          options={defaultOptions}
          height={550}
          width={550}
          isStopped={false}
          isPaused={false}
          isClickToPauseDisabled
        />
      </S.ContentAnimation>

      <PrimaryAlert
        visible={modalSuccessVisible}
        title="Recebemos a sua solicitação"
        message="Confira seu e-mail para acompanhar o processo de cadastro."
        onClose={closeAlertSuccess}
      />
    </Layout>
  )
}
