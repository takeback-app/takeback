import React, { useState, useRef, useEffect, useCallback } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { useTheme } from 'styled-components'
import moment from 'moment'

import { API } from '../../../services/API'
import { CompanyDataTypes } from '../../../types/CompanyDataTypes'
import { maskCNPJ } from '../../../utils/masks'

import { Layout } from '../../../components/ui/layout'
import { OutlinedButton } from '../../../components/buttons'
import { currencyFormat } from '../../../utils/currencyFormat'
import { percentFormat } from '../../../utils/percentFormat'
import { TertiaryInput } from '../../../components/inputs/tertiaryInput'

import * as Styles from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface DataToUpdate {
  corporateName: string
  fantasyName: string
  registeredNumber: string
  phone: string
  contactPhone: string
  email: string
  useCashbackAsBack: boolean
}

export const Company: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const [companyOriginalData, setCompanyOriginalData] =
    useState<CompanyDataTypes>()
  const [cnpj, setCnpj] = useState('')
  const [useCashbackAsBack, setUseCashbackAsBack] = useState(false)

  const findCompanyData = useCallback(() => {
    API.get('/company/data/find')
      .then(response => {
        setCompanyOriginalData(response.data)

        formRef.current?.setData({
          corporateName: response.data.corporateName,
          fantasyName: response.data.fantasyName,
          registeredNumber: response.data.registeredNumber,
          phone: response.data.phone,
          contactPhone: response.data.contactPhone,
          email: response.data.email,
          industry: response.data.industry.description,
          zipCode: response.data.zipCode,
          longitude: response.data.address.longitude,
          latitude: response.data.address.latitude,
          acceptanceTerm: response.data.acceptanceTerm,
          balance: response.data.balance,
          blockedBalance: response.data.blockedBalance,
          cashbackPercentDefault: response.data.cashbackPercentDefault,
          monthlyPayment: response.data.monthlyPayment,
          socialContract: response.data.socialContract
        })

        setCnpj(maskCNPJ(response.data.registeredNumber))
        setUseCashbackAsBack(response.data.useCashbackAsBack)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
  }, [toast])

  async function validateData(data: DataToUpdate) {
    try {
      const schema = Yup.object().shape({
        corporateName: Yup.string().min(4).required('Informe o nome'),
        fantasyName: Yup.string().min(4).required('Informe o nome'),
        phone: Yup.string().min(4).required('Informe o nome'),
        email: Yup.string().min(4).required('Informe o nome')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      API.put('/company/data/update', {
        corporateName: data.corporateName,
        email: data.email,
        fantasyName: data.fantasyName,
        phone: data.phone,
        contactPhone: data.contactPhone,
        useCashbackAsBack
      })
        .then(response => {
          toast({
            title: 'Sucesso!',
            description: response.data,
            status: 'success'
          })
          findCompanyData()
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
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

  useEffect(() => {
    findCompanyData()
  }, [findCompanyData])

  return (
    <Layout title="Dados da empresa">
      <Styles.Container>
        <Styles.Header>
          <Styles.SmallCard>
            <Styles.SmallCardTitle>Parceiro desde</Styles.SmallCardTitle>
            <Styles.SmallCardContent>
              {moment
                .utc(companyOriginalData?.firstAccessAllowedAt)
                .format('MMMM [de] YYYY')}
            </Styles.SmallCardContent>
          </Styles.SmallCard>

          <Styles.SmallCard>
            <Styles.SmallCardTitle>Plano de marketing</Styles.SmallCardTitle>
            <Styles.SmallCardContent>
              {companyOriginalData?.paymentPlan.description} -{' '}
              {currencyFormat(
                parseFloat(
                  JSON.stringify(companyOriginalData?.paymentPlan.value)
                )
              )}
            </Styles.SmallCardContent>
          </Styles.SmallCard>

          <Styles.SmallCard>
            <Styles.SmallCardTitle>Taxa por transação</Styles.SmallCardTitle>
            <Styles.SmallCardContent>
              {companyOriginalData?.customIndustryFeeActive
                ? percentFormat(
                  parseFloat(
                    JSON.stringify(companyOriginalData?.customIndustryFee)
                  )
                )
                : percentFormat(
                  parseFloat(
                    JSON.stringify(companyOriginalData?.industry.industryFee)
                  )
                )}
            </Styles.SmallCardContent>
          </Styles.SmallCard>

          <Styles.SmallCard>
            <Styles.SmallCardTitle>Status no sistema</Styles.SmallCardTitle>
            <Styles.SmallCardContent>
              {companyOriginalData?.status.description}
            </Styles.SmallCardContent>
          </Styles.SmallCard>
        </Styles.Header>

        <Form ref={formRef} onSubmit={validateData}>
          <Styles.ModalContent>
            <Styles.CardMain>
              <TertiaryInput name="fantasyName" label="Nome Fantasia" />
              <TertiaryInput name="corporateName" label="Razão Social" />
              <TertiaryInput
                name="registeredNumber"
                label="CNPJ"
                value={cnpj}
                onChange={e => setCnpj(maskCNPJ(e.currentTarget.value))}
                disabled={true}
              />
              <TertiaryInput name="phone" label="Telefone de Suporte" />
              <TertiaryInput name="contactPhone" label="Telefone de Contato" />
              <TertiaryInput name="email" label="E-mail" />
              <TertiaryInput
                label="Ramo de Atividade"
                name="industry"
                disabled
              />
              <TertiaryInput name="longitude" label="Longitude" disabled />
              <TertiaryInput name="latitude" label="Latitude" disabled />
              <div>
                <input
                  type="checkbox"
                  checked={useCashbackAsBack}
                  onChange={() => setUseCashbackAsBack(!useCashbackAsBack)}
                />
                <Styles.Label>Usar troco como cashback</Styles.Label>
              </div>
              <div />
            </Styles.CardMain>
            <Styles.CardFooter>
              <Styles.industryLabel>
                *Para alteração do CNPJ ou do ramo de atividade entre em contato
                com a Takeback.
              </Styles.industryLabel>
              <OutlinedButton type="submit" color={theme.colors['blue-600']}>
                <IoCheckmarkSharp />
                <span>Atualizar dados</span>
              </OutlinedButton>
            </Styles.CardFooter>
          </Styles.ModalContent>
        </Form>
      </Styles.Container>
    </Layout>
  )
}
