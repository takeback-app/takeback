/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import {
  IoFilter,
  IoArrowForwardSharp,
  IoWalletOutline,
  IoEyeOutline
} from 'react-icons/io5'
import Loader from 'react-spinners/PulseLoader'

import { API } from '../../../../services/API'
import { CAppData } from '../../../../contexts/CAppData'
import { currencyFormat } from '../../../../utils/currencytFormat'
import { TPaymentOrder } from '../../../../types/TPaymentOrder'

import Layout from '../../../../components/ui/Layout'
import PageLoader from '../../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import SelectInput from '../../../../components/inputs/SelectInput'
import FilterModal from '../../../../components/modals/FilterModal'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import Toastify, { notifyError } from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'

interface FilterProps {
  company?: string
  paymentMethod?: string
  status?: string
  startDate?: string
  endDate?: string
}

const PaymentOrders: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const {
    paymentOrderMethods,
    setPaymentOrderMethods,
    paymentOrderStatus,
    setPaymentOrderStatus
  } = useContext(CAppData)

  const [paymentOrders, setPaymentOrders] = useState(
    ([] as Array<TPaymentOrder>) || null
  )
  const [moreLoading, setMoreLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [filterVisible, setFilterVisible] = useState(false)
  const [endList, setEndList] = useState(false)
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState<FilterProps>({
    company: '',
    paymentMethod: '',
    status: '',
    endDate: '',
    startDate: ''
  })

  const limit = 60

  const findPaymentOrders = () => {
    API.get(
      `/manager/orders/find?offset=${offset}&limit=${limit}&company=${filters.company}&status=${filters.status}&paymentMethod=${filters.paymentMethod}&startDate=${filters.startDate}&endDate=${filters.endDate}`
    )
      .then(response => {
        setOffset(offset + 1)
        setPaymentOrders([...paymentOrders, ...response.data])

        if (response.data.length < limit) {
          setEndList(true)
        }
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
      .finally(() => {
        setPageLoading(false)
        setMoreLoading(false)
      })
  }

  // Ação do botão de filtro da busca
  const findWithFilters = (data?: FilterProps) => {
    setFilterVisible(false)
    setPageLoading(true)
    setEndList(false)
    setPaymentOrders([])
    setOffset(0)

    setFilters({
      company: data?.company ? data?.company : '',
      paymentMethod: data?.paymentMethod === '0' ? '' : data?.paymentMethod,
      status: data?.status === '0' ? '' : data?.status,
      startDate: data?.startDate ? data.startDate : '',
      endDate: data?.endDate ? data.endDate : ''
    })
  }

  // Ação do botão de paginação da busca
  const findMorePaymentOrders = () => {
    setMoreLoading(true)
    findPaymentOrders()
  }

  useEffect(() => {
    function findFilters() {
      API.get('/manager/order/find/filters')
        .then(response => {
          setPaymentOrderMethods(response.data.methods)
          setPaymentOrderStatus(response.data.status)
        })
        .catch(error => {
          if (error.isAxiosError) {
            notifyError(error.response.data.message)
          }
        })
    }

    findFilters()
  }, [])

  useEffect(() => {
    findPaymentOrders()
  }, [filters])

  return (
    <Layout title="Ordens de pagamento">
      {pageLoading ? (
        <PageLoader label="Carregando ordens de pagamento" />
      ) : (
        <S.Container>
          <S.SubHeader>
            <QuartenaryButton
              label="Filtrar"
              icon={IoFilter}
              color={PALLET.COLOR_06}
              onClick={() => setFilterVisible(true)}
              noFullWidth
            />
          </S.SubHeader>

          <S.Table>
            <S.THead>
              <S.Tr>
                <S.Th>Id</S.Th>
                <S.Th>Empresa</S.Th>
                <S.Th>Forma de pagamento</S.Th>
                <S.Th>Valor</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>Data da solicitação</S.Th>
                <S.Th></S.Th>
              </S.Tr>
            </S.THead>

            <S.TBody>
              {paymentOrders?.map(order => (
                <S.Tr key={order.order_id}>
                  <S.Td>{order.order_id}</S.Td>
                  <S.Td>{order.company_fantasyName}</S.Td>
                  <S.Td>{order.paymentMethod_description}</S.Td>
                  <S.Td>{currencyFormat(order.order_value)}</S.Td>
                  <S.Td>{order.status_description}</S.Td>
                  <S.Td>
                    {new Date(order.order_createdAt).toLocaleDateString()}
                  </S.Td>
                  <S.Td>
                    {order.status_description === 'Pagamento solicitado' && (
                      <QuartenaryButton
                        color={PALLET.COLOR_08}
                        icon={IoArrowForwardSharp}
                        onClick={() =>
                          navigateTo(`/cashbacks/pagamentos/${order.order_id}`)
                        }
                      />
                    )}
                    {order.status_description === 'Aguardando confirmacao' && (
                      <QuartenaryButton
                        color={PALLET.COLOR_08}
                        icon={IoWalletOutline}
                        onClick={() =>
                          navigateTo(`/cashbacks/pagamentos/${order.order_id}`)
                        }
                      />
                    )}
                    {order.status_description === 'Autorizada' && (
                      <QuartenaryButton
                        color="#009900"
                        icon={IoEyeOutline}
                        onClick={() =>
                          navigateTo(`/cashbacks/pagamentos/${order.order_id}`)
                        }
                      />
                    )}
                    {order.status_description === 'Cancelada' && (
                      <QuartenaryButton
                        color={PALLET.COLOR_17}
                        icon={IoEyeOutline}
                        onClick={() =>
                          navigateTo(`/cashbacks/pagamentos/${order.order_id}`)
                        }
                      />
                    )}
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>

          {!endList && (
            <S.Footer>
              <S.LoadMoreButton
                onClick={findMorePaymentOrders}
                disabled={moreLoading}
              >
                {moreLoading ? (
                  <Loader color="#3A4D5C" size="0.6rem" />
                ) : (
                  'Carregar mais'
                )}
              </S.LoadMoreButton>
            </S.Footer>
          )}
        </S.Container>
      )}

      {/* Modal com os filtros */}
      <FilterModal
        title="Filtros"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <S.Divider />
        <Form ref={formRef} onSubmit={findWithFilters}>
          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Empresa</S.InputFilterTitle>
            <PrimaryInput
              label="Nome fantasia ou CNPJ da empresa"
              name="company"
              maxLength={40}
              minLength={3}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>
              Status da ordem de pagamento
            </S.InputFilterTitle>
            <SelectInput
              name="status"
              label="Selecione"
              options={[{ id: 0, description: 'Todos' }, ...paymentOrderStatus]}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Forma de pagamento</S.InputFilterTitle>
            <SelectInput
              label="Selecione"
              name="paymentMethod"
              options={[
                { id: 0, description: 'Todas' },
                ...paymentOrderMethods
              ]}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Período</S.InputFilterTitle>
            <S.InputDateWrapper>
              <PrimaryInput type="date" name="startDate" label="Início" />
              <PrimaryInput type="date" name="endDate" label="Fim" />
            </S.InputDateWrapper>
          </S.InputsFilterWrapper>

          <S.FooterFilter>
            <QuartenaryButton
              type="reset"
              label="Limpar filtros"
              color={PALLET.COLOR_10}
            />
            <QuartenaryButton
              type="submit"
              label="Aplicar filtros"
              color={PALLET.COLOR_02}
            />
          </S.FooterFilter>
        </Form>
      </FilterModal>

      <Toastify />
    </Layout>
  )
}

export default PaymentOrders
