import React, { useState, useRef, useEffect, useCallback } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { IoCreateOutline } from 'react-icons/io5'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'
import {
  PaymentMethod,
  CompanyPaymentMethod
} from '../../../types/CompanyPaymentMethod'

import { percentFormat } from '../../../utils/percentFormat'
import { Layout } from '../../../components/ui/layout'
import { DefaultModal } from '../../../components/modals/defaultModal'
import { OutlinedButton } from '../../../components/buttons'
import { PercentInput } from '../../../components/inputs/percentInput'
import { SelectInput } from '../../../components/inputs/selectInput'
import { PrimaryLoader } from '../../../components/loaders/primaryLoader'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface FormProps {
  cashbackPercentage: string
  paymentMethod?: string
}

export const PaymentMethods: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const formRef2 = useRef<FormHandles>(null)
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const [editVisible, setEditVisible] = useState(false)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [description, setDescription] = useState('')
  const [isActived, setIsActived] = useState(false)
  const [paymentId, setPaymentId] = useState(0)
  const [companyPaymentMethods, setCompanyPaymentMethods] =
    useState<[CompanyPaymentMethod]>()
  const [systemPaymentMethods, setSystemPaymentMethods] =
    useState<[PaymentMethod]>()
  const [pageLoading, setPageLoading] = useState(false)

  const findCompanyPaymentMethods = useCallback(() => {
    setPageLoading(true)

    API.get('/company/payments-methods/find')
      .then(response => {
        setCompanyPaymentMethods(response.data)
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

    API.get('/company/payments-methods/find/system')
      .then(response => {
        setSystemPaymentMethods(response.data)
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
      .finally(() => {
        setPageLoading(false)
      })
  }, [toast])

  const openModalToEdit = (item: CompanyPaymentMethod) => {
    setEditVisible(true)

    formRef.current?.setData({
      cashbackPercentage: item.cashbackPercentage * 100
    })

    setDescription(item.paymentMethod.description)
    setIsActived(item.isActive)
    setPaymentId(item.id)
  }

  const updatePaymentMethod = (data: FormProps) => {
    validateFormData(data)

    API.put('/company/payments-methods/update', {
      paymentId,
      cashbackPercentage: parseInt(data.cashbackPercentage),
      isActive: isActived
    })
      .then(response => {
        setCompanyPaymentMethods(response.data.companyMethods)
        setEditVisible(false)
        toast({
          title: 'Sucesso!',
          description: response.data.message,
          status: 'success'
        })
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
  }

  const registerPaymentMethod = (data: FormProps) => {
    if (!validateFormData(data)) return

    API.post('/company/payments-methods/register', {
      paymentId: data.paymentMethod,
      cashbackPercentage: parseInt(data.cashbackPercentage)
    })
      .then(response => {
        setCompanyPaymentMethods(response.data.companyMethods)
        setRegisterVisible(false)
        formRef2.current?.reset()
        toast({
          title: 'Sucesso!',
          description: response.data.message,
          status: 'success'
        })
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
  }

  function validateFormData(data: FormProps) {
    let IsTakebackSpecialMethod = false

    systemPaymentMethods?.map(method => {
      if (
        method.id === parseInt(data.paymentMethod || '') &&
        (method.isBackMethod || method.isTakebackMethod)
      ) {
        IsTakebackSpecialMethod = true
      }

      return 0
    })

    if (IsTakebackSpecialMethod && data.cashbackPercentage) {
      toast({
        title: 'Atenção!',
        description:
          'Para cadastrar o método de pagamento troco ou takeback, remova o percentual de cashback.',
        status: 'warning'
      })

      return false
    }

    if (!data.cashbackPercentage && !IsTakebackSpecialMethod) {
      toast({
        title: 'Atenção!',
        description: 'Informe o percentual de desconto',
        status: 'warning'
      })

      return false
    }

    if (
      data.paymentMethod !== 'Sorteio' &&
      parseInt(data.cashbackPercentage) === 0
    ) {
      toast({
        title: 'Atenção!',
        description: 'Não é possível informar o percentual zero',
        status: 'warning'
      })
      return false
    }

    if (parseInt(data.cashbackPercentage) < 0) {
      toast({
        title: 'Atenção!',
        description: 'Não é possível informar percentual negativo',
        status: 'warning'
      })

      return false
    }

    if (parseInt(data.cashbackPercentage) > 100) {
      toast({
        title: 'Atenção!',
        description: 'Não é possível informar valores acima de 100%',
        status: 'warning'
      })

      return false
    }

    return true
  }

  useEffect(() => {
    findCompanyPaymentMethods()
  }, [findCompanyPaymentMethods])

  return (
    <>
      <Layout title="Métodos de pagamento">
        {pageLoading ? (
          <PrimaryLoader label="Carregando métodos de pagamento..." />
        ) : (
          <S.Container>
            <S.SubHeader>
              <OutlinedButton
                color={theme.colors['blue-600']}
                onClick={() => setRegisterVisible(true)}
              >
                <span>Adicionar</span>
              </OutlinedButton>
            </S.SubHeader>
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>Descrição</S.Th>
                  <S.Th>Percentual de cashback</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th>&nbsp;</S.Th>
                </S.Tr>
              </S.THead>
              <S.TBody>
                {companyPaymentMethods?.map((item, index) => (
                  <S.Tr key={index}>
                    <S.Td>{item.paymentMethod.description}</S.Td>
                    <S.Td>{percentFormat(item.cashbackPercentage)}</S.Td>
                    <S.Td>{item.isActive ? 'ATIVO' : 'INATIVO'}</S.Td>
                    <S.Td>
                      {!item.paymentMethod.isTakebackMethod && (
                        <OutlinedButton
                          color={theme.colors['gray-600']}
                          style={{
                            height: 'auto',
                            padding: '0.46rem 0.8rem'
                          }}
                          onClick={() => openModalToEdit(item)}
                        >
                          <IoCreateOutline />
                        </OutlinedButton>
                      )}
                    </S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
          </S.Container>
        )}

        <DefaultModal
          visible={editVisible}
          title={description}
          onClose={() => setEditVisible(false)}
        >
          <Form ref={formRef} onSubmit={updatePaymentMethod}>
            <S.ModalContent>
              <S.InputsWrapper>
                <S.ModalWrapper>
                  <S.Label>Percentual de Cashback:</S.Label>
                  <PercentInput name="cashbackPercentage" label="%" />
                </S.ModalWrapper>
                <S.ModalWrapper>
                  <S.Label>Status:</S.Label>

                  <OutlinedButton
                    type="button"
                    onClick={() => setIsActived(!isActived)}
                    color={
                      isActived
                        ? theme.colors['green-600']
                        : theme.colors['red-500']
                    }
                    style={{ marginLeft: '1rem' }}
                  >
                    <span>{isActived ? 'ATIVO' : 'INATIVO'}</span>
                  </OutlinedButton>
                </S.ModalWrapper>
              </S.InputsWrapper>
              <S.Footer>
                <OutlinedButton type="submit" color={theme.colors['blue-600']}>
                  <span>Salvar</span>
                </OutlinedButton>
              </S.Footer>
            </S.ModalContent>
          </Form>
        </DefaultModal>

        <DefaultModal
          visible={registerVisible}
          title="Cadastrar nova forma de pagamento"
          onClose={() => setRegisterVisible(false)}
        >
          <Form ref={formRef2} onSubmit={registerPaymentMethod}>
            <S.ModalContent>
              <S.InputsWrapper>
                <SelectInput
                  label="Forma de pagamento"
                  name="paymentMethod"
                  options={systemPaymentMethods}
                />
                <S.ModalWrapper>
                  <S.Label>Percentual de Cashback:</S.Label>
                  <PercentInput name="cashbackPercentage" label="%" />
                </S.ModalWrapper>
              </S.InputsWrapper>
              <S.Footer>
                <OutlinedButton type="submit" color={theme.colors['blue-600']}>
                  <span>Salvar</span>
                </OutlinedButton>
              </S.Footer>
            </S.ModalContent>
          </Form>
        </DefaultModal>
      </Layout>
    </>
  )
}
