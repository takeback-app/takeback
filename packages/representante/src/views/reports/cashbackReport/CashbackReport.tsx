import React, { useEffect, useState, useRef } from 'react'
import { MdFileDownload, MdPictureAsPdf } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { IoFilter } from 'react-icons/io5'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import { API } from '../../../services/API'
import { currencyFormat } from '../../../utils/currencytFormat'
import { maskCNPJ, maskCPF } from '../../../utils/masks'

import Checkbox from '../../../components/inputs/Checkbox'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import Layout from '../../../components/ui/Layout'
import PageLoader from '../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import DownloadButton from '../../../components/buttons/DownloadButton'
import { notifyError } from '../../../components/ui/Toastify'

import PALLET from '../../../styles/ColorPallet'
import * as S from './styles'
import FilterModal from '../../../components/modals/FilterModal'

interface IReport {
  tPaymentMethods_id: number
  tPaymentMethods_cashbackValue: string
  transaction_id: number
  transaction_totalAmount: string
  transaction_takebackFeeAmount: string
  transaction_cashbackAmount: string
  transaction_createdAt: string
  company_fantasyName: string
  consumer_fullName: string
  status_description: string
  paymentMethods_description: string
  paymentOrder_id: number
  transaction_aprovedAt: string
}
interface ICashbackStatus {
  id: string
  description: string
}
interface IPaymentMethods {
  id: string
  description: string
}

interface FilterProps {
  dataStart?: string
  dataEnd?: string
  company?: string
  consumer?: string
  datePaidStart?: string
  datePaidEnd?: string
  dateExpiredStart?: string
  dateExpiredEnd?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const

const CashbackReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statusSelected, setStatusSelected] = useState([] as Array<string>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentMethodsSelected, setPaymentMethodsSelected] = useState(
    [] as Array<string>
  )
  const [pageLoading, setPageLoading] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [cashbacks, setCashbacks] = useState([] as Array<IReport>)
  const [stateCashback, setStateCashback] = useState(
    [] as Array<ICashbackStatus>
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payments, setPayments] = useState([] as Array<IPaymentMethods>)
  const [filePathPDF, setFilePathPDF] = useState('')
  const [filePathExcel, setFilePathExcel] = useState('')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')

  // BUSCANDO CASHBACKS
  const findCashbacksReport = () => {
    setPageLoading(true)
    API.get('/manager/report/cashbacks')
      .then(response => {
        setCashbacks(response.data.report)
        setFilePathPDF(response.data.filePathPDF)
        setFilePathExcel(response.data.filePathExcel)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  // BUSCANDO STATUS DOS CASHBACKS
  const findCashbackStatus = () => {
    API.get('/manager/cashback/find/status')
      .then(response => {
        setStateCashback(response.data)
      })
      .catch(error => {
        notifyError(error.response.data.message)
      })
  }

  // BUSCANDO METODOS DE PAGAMENTO
  const findPayments = () => {
    setPageLoading(true)
    API.get('/manager/payment/find')
      .then(response => {
        setPayments(response.data)
      })
      .catch(error => {
        notifyError(error.response.data.message)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  // FUNÇÃO PARA ADICIONAR OU REMOVER OS MULTIPLOS STATUS AO FILTRO
  const addOrRemoveItem = async (checked: boolean, id: string) => {
    const find = statusSelected.indexOf(id)

    if (checked) {
      statusSelected.push(id)
    } else if (find > -1) {
      statusSelected.splice(find, 1)
    }
  }

  // FUNÇÃO PARA ADICIONAR OU REMOVER OS MULTIPLOS STATUS AO FILTRO
  const addOrRemovePaymentMethod = async (checked: boolean, id: string) => {
    const find = paymentMethodsSelected.indexOf(id)

    if (checked) {
      paymentMethodsSelected.push(id)
    } else if (find > -1) {
      paymentMethodsSelected.splice(find, 1)
    }
  }

  const handleFilters = (data: FilterProps) => {
    const statusIds = statusSelected.length === 0 ? '' : statusSelected
    const paymentMethodIds =
      paymentMethodsSelected.length === 0 ? '' : paymentMethodsSelected
    const company = data.company === '0' ? '' : data.company
    const consumer = data.consumer === '0' ? '' : data.consumer
    const dataStart = data.dataStart === '0' ? '' : data.dataStart
    const dataEnd = data.dataEnd === '0' ? '' : data.dataEnd
    const datePaidStart = data.datePaidStart === '0' ? '' : data.datePaidStart
    const datePaidEnd = data.datePaidEnd === '0' ? '' : data.datePaidEnd
    const dateExpiredStart =
      data.dateExpiredStart === '0' ? '' : data.dateExpiredStart
    const dateExpiredEnd =
      data.dateExpiredEnd === '0' ? '' : data.dateExpiredEnd

    setFilterVisible(false)
    setPageLoading(true)

    API.get(
      `/manager/report/cashbacks?statusIds=${statusIds}&paymentMethodIds=${paymentMethodIds}&company=${company}&consumer=${consumer}&dataStart=${dataStart}&dataEnd=${dataEnd}&datePaidStart=${datePaidStart}&datePaidEnd=${datePaidEnd}&dateExpiredStart=${dateExpiredStart}&dateExpiredEnd=${dateExpiredEnd}`
    )
      .then(response => {
        setCashbacks(response.data.report)
        setFilePathPDF(response.data.filePathPDF)
        setFilePathExcel(response.data.filePathExcel)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  const limpaFiltro = () => {
    formRef.current?.reset()
    setPaymentMethodsSelected([])
    setStatusSelected([])
    setCpf('')
    setCnpj('')
  }

  const timerToClearLinks = () => {
    const time = 60000
    setTimeout(() => {
      setFilePathExcel('')
      setFilePathPDF('')
    }, time * 10)
  }

  useEffect(() => {
    findCashbacksReport()
    findCashbackStatus()
    findPayments()
    timerToClearLinks()

    // eslint-disable-next-line
  }, [])

  return (
    <Layout goBack={() => navigateTo(-1)} goBackTitle="Relatório de cashbacks">
      {pageLoading ? (
        <PageLoader label="Carregando relatório..." />
      ) : (
        <S.Container>
          <S.SubHeader>
            <QuartenaryButton
              onClick={() => setFilterVisible(true)}
              label="Filtrar"
              color={PALLET.COLOR_06}
              icon={IoFilter}
              noFullWidth
            />
            <S.DownloadContainer>
              <DownloadButton
                href={filePathPDF}
                icon={MdPictureAsPdf}
                title="Baixar em PDF"
                color="#AA0A00"
                disabled={filePathPDF.length === 0}
              />
              <DownloadButton
                href={filePathExcel}
                icon={MdFileDownload}
                title="Baixar em Excel"
                color="#006E3D"
                disabled={filePathExcel.length === 0}
              />
            </S.DownloadContainer>
          </S.SubHeader>

          <S.TableWrapper>
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>id</S.Th>
                  <S.Th>Empresa</S.Th>
                  <S.Th>Cliente</S.Th>
                  <S.Th>Método de Pagamento</S.Th>
                  <S.Th>Valor de compra</S.Th>
                  <S.Th>Taxa de administração</S.Th>
                  <S.Th>Cashback</S.Th>
                  <S.Th>Total a pagar</S.Th>
                  <S.Th>Ordem de pagamento</S.Th>
                  <S.Th>Status da transação</S.Th>
                  <S.Th>Data de emissão</S.Th>
                  <S.Th>Data de Aprovação</S.Th>
                </S.Tr>
              </S.THead>
              {cashbacks?.map(item => (
                <S.TBody key={item.transaction_id}>
                  <S.Tr>
                    <S.Td>{item.transaction_id}</S.Td>
                    <S.Td>{item.company_fantasyName}</S.Td>
                    <S.Td>{item.consumer_fullName}</S.Td>
                    <S.Td>{item.paymentMethods_description}</S.Td>
                    <S.Td>
                      {currencyFormat(parseFloat(item.transaction_totalAmount))}
                    </S.Td>
                    <S.Td>
                      {currencyFormat(
                        parseFloat(item.transaction_takebackFeeAmount)
                      )}
                    </S.Td>
                    <S.Td>
                      {currencyFormat(
                        parseFloat(item.transaction_cashbackAmount)
                      )}
                    </S.Td>
                    <S.Td>
                      {currencyFormat(
                        parseFloat(item.transaction_takebackFeeAmount) +
                          parseFloat(item.transaction_cashbackAmount)
                      )}
                    </S.Td>

                    <S.Td>
                      {item.paymentOrder_id
                        ? item.paymentOrder_id
                        : 'Não possui'}
                    </S.Td>
                    <S.Td>{item.status_description}</S.Td>
                    <S.Td>
                      {new Date(
                        item.transaction_createdAt
                      ).toLocaleDateString()}
                    </S.Td>
                    <S.Td>
                      {item.transaction_aprovedAt
                        ? new Date(
                            item.transaction_aprovedAt
                          ).toLocaleDateString()
                        : 'Não aprovada'}
                    </S.Td>
                  </S.Tr>
                </S.TBody>
              ))}
            </S.Table>
          </S.TableWrapper>
        </S.Container>
      )}

      <FilterModal
        title="Filtros"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <S.DividerWrapper />
        <Form ref={formRef} onSubmit={handleFilters}>
          <S.ModalContent>
            <S.InputsWrapper>
              <S.InputTitle>Cliente</S.InputTitle>
              <PrimaryInput
                label="CPF do cliente"
                name="consumer"
                maxLength={14}
                value={cpf}
                onChange={e => setCpf(maskCPF(e.currentTarget.value))}
                minLength={3}
              />
            </S.InputsWrapper>

            <S.DividerWrapper />

            <S.InputsWrapper>
              <S.InputTitle>Empresa</S.InputTitle>
              <PrimaryInput
                label="CNPJ da empresa"
                name="company"
                maxLength={18}
                value={cnpj}
                onChange={e => setCnpj(maskCNPJ(e.currentTarget.value))}
                minLength={3}
              />
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.InputsWrapper>
              <S.InputTitle>Período de emissão</S.InputTitle>
              <S.InputDateWrapper>
                <PrimaryInput type="date" name="dataStart" label="Início" />
                <PrimaryInput type="date" name="dataEnd" label="Fim" />
              </S.InputDateWrapper>
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.InputsWrapper>
              <S.InputTitle>Período de pagamento</S.InputTitle>
              <S.InputDateWrapper>
                <PrimaryInput type="date" name="datePaidStart" label="Início" />
                <PrimaryInput type="date" name="datePaidEnd" label="Fim" />
              </S.InputDateWrapper>
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.InputsWrapper>
              <S.InputTitle>Período de vencimento</S.InputTitle>
              <S.InputDateWrapper>
                <PrimaryInput
                  type="date"
                  name="dateExpiredStart"
                  label="Início"
                />
                <PrimaryInput type="date" name="dateExpiredEnd" label="Fim" />
              </S.InputDateWrapper>
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Status</S.InputTitle>
            </S.TitleWrapper>
            <S.CheckboxWrapper>
              {stateCashback.map(item => (
                <Checkbox
                  key={item.id}
                  label={item.description}
                  onChange={event => {
                    addOrRemoveItem(event.target.checked, item.id)
                  }}
                />
              ))}
            </S.CheckboxWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Métodos de pagamentos</S.InputTitle>
            </S.TitleWrapper>
            <S.CheckboxWrapper>
              {payments.map(item => (
                <Checkbox
                  key={item.id}
                  label={item.description}
                  onChange={event => {
                    addOrRemovePaymentMethod(event.target.checked, item.id)
                  }}
                />
              ))}
            </S.CheckboxWrapper>

            <S.FooterModal>
              <QuartenaryButton
                type="button"
                label="Limpar filtros"
                color={PALLET.COLOR_17}
                onClick={() => limpaFiltro()}
              />
              <QuartenaryButton
                type="submit"
                label="Gerar relatório"
                color={PALLET.COLOR_02}
              />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </FilterModal>
    </Layout>
  )
}

export default CashbackReport
