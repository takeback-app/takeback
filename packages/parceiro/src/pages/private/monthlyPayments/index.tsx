/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import Loader from 'react-spinners/PulseLoader'
import QRCode from 'react-qr-code'
import { IoCopy, IoCheckmarkOutline, IoTimeOutline } from 'react-icons/io5'
import moment from 'moment'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'
import { currencyFormat } from '../../../utils/currencyFormat'

import { Layout } from '../../../components/ui/layout'
import { DefaultModal } from '../../../components/modals/defaultModal'
import { OutlinedButton } from '../../../components/buttons'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface CompanyTypes {
  company_id: string
  company_firstAccessAllowedAt: string
  company_periodFree: boolean
  company_currentMonthlyPaymentPaid: boolean
  company_provisionalAccessAllowedAt: string
  paymentPlan_description: string
  paymentPlan_value: string
  status_description: string
}

interface MontlhyTypes {
  monthly_id: number
  monthly_amountPaid: string
  monthly_isPaid: boolean
  monthly_isForgiven: boolean
  monthly_paymentMade: boolean
  plan_description: string
  monthly_dueDate: string
  monthly_paidDate: string
  monthly_createdAt: string
}

export const MonthlyPayments: React.FC = () => {
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const [companyData, setCompanyData] = useState({} as CompanyTypes)
  const [monthlyPayments, setMonthlyPayments] = useState(
    [] as Array<MontlhyTypes>
  )

  const [pageLoader, setPageLoader] = useState(false)
  const [modalPixVisible, setModalPixVisible] = useState(false)
  const [indentifier, setIndentifier] = useState(0)
  const [value, setValue] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [qrcodeKey, setQrcodeKey] = useState('')

  // Buscanco as mensalidades da empresa
  useEffect(() => {
    function findMonthlyPayment() {
      setPageLoader(true)
      API.get('/company/monthly/find')
        .then(response => {
          setCompanyData(response.data.company.companyData)
          setMonthlyPayments(response.data.company.montlhies)
          setPixKey(response.data.paymentInfo.pixKey)
          setQrcodeKey(response.data.paymentInfo.qrCode)
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
        .finally(() => {
          setPageLoader(false)
        })
    }

    findMonthlyPayment()
  }, [toast])

  const toggleModalVisisbleAndSetValueToPay = (index: number) => {
    setIndentifier(monthlyPayments[index].monthly_id)
    setValue(monthlyPayments[index].monthly_amountPaid)

    setModalPixVisible(true)
  }

  // Copia a chave pix para a área de transferência
  const copyText = (pixKey: string) => {
    navigator.clipboard.writeText(pixKey).then(() => {
      toast({
        title: 'Chave copiada!',
        status: 'info'
      })
    })
  }

  const updateMonthlyPaymentToPaymentMadeAndFindMonthlies = () => {
    setPageLoader(true)
    setModalPixVisible(false)
    API.put(`/company/monthly/update/${indentifier}`)
      .then(response => {
        setCompanyData(response.data.company.companyData)
        setMonthlyPayments(response.data.company.montlhies)
        toast({
          title: 'Sucesso!',
          description: response.data.message,
          status: 'info'
        })
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
      .finally(() => {
        setPageLoader(false)
      })
  }

  return (
    <Layout title="Marketing">
      {pageLoader ? (
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
          <h6>Carregando informações...</h6>
        </S.ContainLoader>
      ) : (
        <S.Container>
          {companyData.company_periodFree ? (
            <S.WrapperPeriodFree>
              <S.LabelPeriodFree>
                Você está no período gratuito
              </S.LabelPeriodFree>
            </S.WrapperPeriodFree>
          ) : (
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>Plano</S.Th>
                  <S.Th>Valor</S.Th>
                  <S.Th>Referente</S.Th>
                  <S.Th>Vencimento</S.Th>
                  <S.Th>Pagamento</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th></S.Th>
                </S.Tr>
              </S.THead>

              {monthlyPayments.map((monthly, index) => (
                <S.TBody key={monthly.monthly_id}>
                  <S.Tr>
                    <S.Td>{monthly.plan_description}</S.Td>
                    <S.Td>
                      {currencyFormat(parseFloat(monthly.monthly_amountPaid))}
                    </S.Td>
                    <S.Td>
                      {moment
                        .utc(monthly.monthly_createdAt)
                        .format('MMMM [DE] YYYY')}
                    </S.Td>
                    <S.Td>
                      {moment.utc(monthly.monthly_dueDate).format('DD/MM/YYYY')}
                    </S.Td>
                    <S.Td>
                      {monthly.monthly_isPaid
                        ? moment
                            .utc(monthly.monthly_paidDate)
                            .format('DD/MM/YYYY')
                        : '-'}
                    </S.Td>
                    <S.Td>
                      {monthly.monthly_isPaid
                        ? 'Paga'
                        : monthly.monthly_isForgiven
                        ? 'Dispensada'
                        : monthly.monthly_paymentMade
                        ? 'Processando'
                        : 'Não paga'}
                    </S.Td>
                    <S.Td>
                      {monthly.monthly_isPaid ? (
                        <OutlinedButton
                          color={theme.colors['green-500']}
                          disabled
                          style={{
                            height: 'auto',
                            padding: '0.46rem 0.8rem'
                          }}
                        >
                          <IoCheckmarkOutline />
                        </OutlinedButton>
                      ) : monthly.monthly_isForgiven ? (
                        <OutlinedButton
                          color={theme.colors['green-500']}
                          disabled
                          style={{
                            height: 'auto',
                            padding: '0.46rem 0.8rem'
                          }}
                        >
                          <IoCheckmarkOutline />
                        </OutlinedButton>
                      ) : monthly.monthly_paymentMade ? (
                        <OutlinedButton
                          color={theme.colors['blue-600']}
                          disabled
                          style={{
                            height: 'auto',
                            padding: '0.46rem 0.8rem'
                          }}
                        >
                          <IoTimeOutline />
                        </OutlinedButton>
                      ) : (
                        <OutlinedButton
                          color={theme.colors['blue-600']}
                          style={{
                            height: 'auto',
                            padding: '0.46rem 0.8rem'
                          }}
                          onClick={() =>
                            toggleModalVisisbleAndSetValueToPay(index)
                          }
                        >
                          Pagar
                        </OutlinedButton>
                      )}
                    </S.Td>
                  </S.Tr>
                </S.TBody>
              ))}
            </S.Table>
          )}
        </S.Container>
      )}

      <DefaultModal
        title="Chave pix"
        visible={modalPixVisible}
        onClose={() => setModalPixVisible(false)}
      >
        <S.ModalContent>
          <S.PaymentInfoWrapper>
            <QRCode value={qrcodeKey || 'Chave inválida'} />
            <S.PixKey onClick={() => copyText(pixKey)}>
              {pixKey} <IoCopy />{' '}
            </S.PixKey>

            <S.PaymentInfoDescription>
              <h5>Leia o QRCode ou copie a chave pix</h5>
              <h3>Valor a ser pago: {currencyFormat(parseFloat(value))}</h3>
            </S.PaymentInfoDescription>
          </S.PaymentInfoWrapper>
          <S.ModalFooter>
            <OutlinedButton
              color={theme.colors['red-500']}
              onClick={() => setModalPixVisible(false)}
            >
              <span>Cancelar</span>
            </OutlinedButton>
            <OutlinedButton
              color={theme.colors['blue-600']}
              onClick={updateMonthlyPaymentToPaymentMadeAndFindMonthlies}
            >
              <span>Concluir</span>
            </OutlinedButton>
          </S.ModalFooter>
        </S.ModalContent>
      </DefaultModal>
    </Layout>
  )
}
