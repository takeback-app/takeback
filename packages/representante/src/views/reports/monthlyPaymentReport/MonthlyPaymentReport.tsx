import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { IoFilter } from 'react-icons/io5'
import { Form } from '@unform/web'

import { API } from '../../../services/API'
import { currencyFormat } from '../../../utils/currencytFormat'
import { CCompany } from '../../../contexts/CCompany'

import Layout from '../../../components/ui/Layout'
import PageLoader from '../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import DefaultModal from '../../../components/modals/DefaultModal'
import SelectInput from '../../../components/inputs/SelectInput'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import QuintenaryButton from '../../../components/buttons/QuintenaryButton'

import PALLET from '../../../styles/ColorPallet'

import * as S from './styles'
import { FormHandles } from '@unform/core'

interface IReport {
  companyStatus_description: string
  company_fantasyName: string
  monthlyPayment_amountPaid: string
  monthlyPayment_createdAt: string
  monthlyPayment_id: number
  monthlyPayment_isPaid: boolean
  monthlyPayment_paidDate: string
  plan_description: string
}

interface FilterProps {
  companyId: string
  isPaid: string
  startDate: string
  endDate: string
}

const defaultSelect = [{ id: 0, description: 'Todos' }]
const statusOptions = [
  { id: 0, description: 'Todos' },
  { id: 1, description: 'Paga' },
  { id: 2, description: 'Não Paga' }
]

const MonthlyPaymentReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const [pageLoading, setPageLoading] = useState(false)
  // eslint-disable-next-line
  const [filterVisible, setFilterVisible] = useState(false)
  const [monthlyPayment, setMonthlyPayment] = useState([] as Array<IReport>)
  const { companiesToFilter, setCompaniesToFilter } = useContext(CCompany)

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const findPayments = () => {
    setPageLoading(true)
    API.get('/manager/report/monthly-payment')
      .then(response => {
        setMonthlyPayment(response.data)
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

  const handleFilters = (data: FilterProps) => {
    const isPaid = data.isPaid === '0' ? '' : data.isPaid === '1'
    const companyId = data.companyId === '0' ? '' : data.companyId
    const startDate = data.startDate === '0' ? '' : data.startDate
    const endDate = data.endDate === '0' ? '' : data.endDate

    setFilterVisible(false)
    setPageLoading(true)

    API.get(
      `/manager/report/monthly-payment?isPaid=${isPaid}&companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`
    )
      .then(response => {
        setMonthlyPayment(response.data)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  useEffect(() => {
    findPayments()
    findAllCompanies()
    // eslint-disable-next-line
  }, [])

  return (
    <Layout
      goBack={() => navigateTo(-1)}
      goBackTitle="Relatório de mensalidades"
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
          </S.SubHeader>
          <S.TableWrapper>
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>ID</S.Th>
                  <S.Th>Empresa</S.Th>
                  <S.Th>Status da empresa</S.Th>
                  <S.Th>Parcela atual</S.Th>
                  <S.Th>Valor pago</S.Th>
                  <S.Th>Dia pago</S.Th>
                  <S.Th>Mês</S.Th>
                  <S.Th>Plano</S.Th>
                </S.Tr>
              </S.THead>

              <S.TBody>
                {monthlyPayment?.map(item => (
                  <S.Tr key={item.monthlyPayment_id}>
                    <S.Td>{item.monthlyPayment_id}</S.Td>
                    <S.Td>{item.company_fantasyName}</S.Td>
                    <S.Td>{item.companyStatus_description}</S.Td>
                    <S.Td>
                      {item.monthlyPayment_isPaid ? 'PAGA' : 'NÃO  PAGA'}
                    </S.Td>
                    <S.Td>
                      {item.monthlyPayment_isPaid
                        ? currencyFormat(
                            parseFloat(item.monthlyPayment_amountPaid)
                          )
                        : '--'}
                    </S.Td>
                    <S.Td>
                      {item.monthlyPayment_isPaid
                        ? new Date(
                            item.monthlyPayment_paidDate
                          ).toLocaleDateString()
                        : '--'}
                    </S.Td>
                    <S.Td>
                      {
                        meses[
                          new Date(item.monthlyPayment_createdAt).getMonth()
                        ]
                      }
                    </S.Td>
                    <S.Td>{item.plan_description}</S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
          </S.TableWrapper>
        </S.Container>
      )}

      <DefaultModal
        size="medium"
        title="Filtrar mensalidades"
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
                name="isPaid"
                label="Status da mensalidade"
                options={statusOptions}
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

export default MonthlyPaymentReport
