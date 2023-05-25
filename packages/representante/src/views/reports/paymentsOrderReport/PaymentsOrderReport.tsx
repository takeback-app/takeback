import React, { useEffect, useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router'
import { IoFilter } from 'react-icons/io5'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import { API } from '../../../services/API'
import { CCompany } from '../../../contexts/CCompany'
import { currencyFormat } from '../../../utils/currencytFormat'

import DefaultModal from '../../../components/modals/DefaultModal'
import SelectInput from '../../../components/inputs/SelectInput'
import QuintenaryButton from '../../../components/buttons/QuintenaryButton'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import { notifyError } from '../../../components/ui/Toastify'
import Layout from '../../../components/ui/Layout'
import PageLoader from '../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'

import PALLET from '../../../styles/ColorPallet'

import * as S from './styles'

interface IReport {
  companyStatus_description: string
  company_fantasyName: string
  method_description: string
  paymentOrder_id: number
  paymentOrder_value: string
  status_description: string
}

interface FilterProps {
  companyId: string
  statusId: string
  startDate: string
  endDate: string
}

const defaultSelect = [{ id: 0, description: 'Todos' }]

const PaymentsOrderReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const [pageLoading, setPageLoading] = useState(false)
  // eslint-disable-next-line
  const [filterVisible, setFilterVisible] = useState(false)
  const [paymentOrder, setPaymentOrder] = useState([] as Array<IReport>)
  const [totalValue, setTotalValue] = useState(0)
  const {
    companyStatus,
    setCompanyStatus,
    companiesToFilter,
    setCompaniesToFilter
  } = useContext(CCompany)

  const findCashbackReport = () => {
    setPageLoading(true)
    API.get('/manager/report/payment-order')
      .then(response => {
        setPaymentOrder(response.data.report)
        setTotalValue(response.data.amount)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  const findAllCompanies = () => {
    setPageLoading(true)
    API.get('/manager/report/find/filters')
      .then(response => {
        setCompaniesToFilter(response.data.companies)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  const findCompanyStatus = () => {
    API.get('/manager/data/find')
      .then(response => {
        setCompanyStatus(response.data.status)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
  }

  const handleFilters = (data: FilterProps) => {
    const statusId = data.statusId === '0' ? '' : data.statusId
    const companyId = data.companyId === '0' ? '' : data.companyId
    const startDate = data.startDate === '0' ? '' : data.startDate
    const endDate = data.endDate === '0' ? '' : data.endDate

    setFilterVisible(false)
    setPageLoading(true)

    API.get(
      `/manager/report/payment-order?statusId=${statusId}&companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`
    )
      .then(response => {
        setPaymentOrder(response.data.report)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  useEffect(() => {
    findAllCompanies()
    findCashbackReport()

    if (companyStatus.length === 0) {
      findCompanyStatus()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Layout
      goBack={() => navigateTo(-1)}
      goBackTitle="Relatório de ordens de pagamento"
    >
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

            <S.TotalLabel>
              Valor total: {currencyFormat(totalValue)}
            </S.TotalLabel>
          </S.SubHeader>

          <S.Table>
            <S.THead>
              <S.Tr>
                <S.Th>ID</S.Th>
                <S.Th>Empresa</S.Th>
                <S.Th>Status da empresa</S.Th>
                <S.Th>Método de pagamento</S.Th>
                <S.Th>Status da ordem</S.Th>
                <S.Th>Valor</S.Th>
              </S.Tr>
            </S.THead>

            <S.TBody>
              {paymentOrder?.map(item => (
                <S.Tr key={item.paymentOrder_id}>
                  <S.Td>{item.paymentOrder_id}</S.Td>
                  <S.Td>{item.company_fantasyName}</S.Td>
                  <S.Td>{item.companyStatus_description}</S.Td>
                  <S.Td>{item.method_description}</S.Td>
                  <S.Td>{item.status_description}</S.Td>
                  <S.Td>
                    {currencyFormat(parseFloat(item.paymentOrder_value))}
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>
        </S.Container>
      )}

      <DefaultModal
        size="medium"
        title="Filtrar ordens de pagamento"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <Form ref={formRef} onSubmit={handleFilters}>
          <S.ModalContent>
            <S.InputsWrapper>
              <SelectInput
                name="companyId"
                label="Empresa"
                options={[...defaultSelect, ...companiesToFilter]}
              />
              <SelectInput
                name="statusId"
                label="Status da empresa"
                options={[...defaultSelect, ...companyStatus]}
              />
              <PrimaryInput
                type="date"
                name="startDate"
                label="Data de início"
              />
              <PrimaryInput type="date" name="endDate" label="Data final" />
            </S.InputsWrapper>
            <S.FooterModal>
              <QuintenaryButton label="Buscar" />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </DefaultModal>
    </Layout>
  )
}

export default PaymentsOrderReport
