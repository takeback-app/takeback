/* eslint-disable camelcase */
import React, { useEffect, useRef, useState, useContext } from 'react'
import Loader from 'react-spinners/PulseLoader'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import { IoFilter } from 'react-icons/io5'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'
import { CCashbacks } from '../../../contexts/CCashbacks'
import { currencyFormat } from '../../../utils/currencyFormat'
import { Layout } from '../../../components/ui/layout'
import { DefaultModal } from '../../../components/modals/defaultModal'
import { OutlinedButton } from '../../../components/buttons'
import { SelectInput } from '../../../components/inputs/selectInput'

import * as S from './styles'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface TransactionProps {
  id: number
  totalAmount: string
  takebackFeeAmount: string
  cashbackAmount: string
  backAmount: string
  createdAt: Date
  transactionPaymentMethods: TransactionPaymentMethod[]
  consumer: {
    fullName: string
  }
  companyUser?: {
    name: string
  }
  transactionStatus: {
    description: string
  }
}

interface TransactionPaymentMethod {
  companyPaymentMethod: {
    paymentMethod: {
      description: string
    }
  }
}

const defaultSelect = [{ id: 0, description: 'Todos' }]

export const CashbackHistoric: React.FC = () => {
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const [transactions, setTransactions] = useState(
    {} as Array<TransactionProps>
  )
  const formRef = useRef<FormHandles>(null)
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [offset, setOffSet] = useState(1)
  const [endList, setEndList] = useState(true)
  const [filterVisible, setFilterVisible] = useState(false)
  const { cashbackStatus, setCashbackStatus } = useContext(CCashbacks)
  const [statusFilter, setStatusFilter] = useState('')

  const getMoreData = () => {
    setMoreLoading(true)
    API.get(`/company/cashbacks/find/all/${offset}/30?statusId=${statusFilter}`)
      .then(response => {
        if (response.data.cashbacks.length < 30) {
          setMoreLoading(false)
          setEndList(true)
        }

        setOffSet(offset + 1)
        setTransactions([...transactions, ...response.data.cashbacks])
        setMoreLoading(false)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
  }
  // eslint-disable-next-line
  const handleFilters = (data: any) => {
    const status = data.status === '0' ? '' : data.status
    setStatusFilter(status)
    // setEndList(false)

    setFilterVisible(false)
    setIsLoadingPage(true)

    API.get(`/company/cashbacks/find/all/0/30?statusId=${status}`)
      .then(response => {
        setTransactions(response.data.cashbacks)
        setOffSet(1)

        if (response.data.cashbacks.length < 30) {
          setEndList(true)
        }
      })
      .finally(() => {
        setIsLoadingPage(false)
      })
  }

  useEffect(() => {
    const findCashbackStatus = () => {
      API.get('/company/cashbacks/find/filters')
        .then(response => {
          setCashbackStatus(response.data)
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
    }

    const findCashbacks = () => {
      API.get('/company/cashbacks/find/all/0/30')
        .then(response => {
          if (response.data.cashbacks.length < 30) {
            setEndList(true)
          }
          setTransactions(response.data.cashbacks)
          setIsLoadingPage(false)
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
    }

    findCashbacks()

    findCashbackStatus()
  }, [setCashbackStatus, toast])

  return (
    <Layout title="Histórico de Cashbacks">
      {isLoadingPage ? (
        <S.ContainLoader>
          <Loader color="rgba(54, 162, 235, 1)" />
        </S.ContainLoader>
      ) : (
        <S.Container>
          <S.SubHeader>
            <OutlinedButton
              color={theme.colors['blue-600']}
              onClick={() => setFilterVisible(true)}
            >
              <IoFilter style={{ fontSize: 20 }} />
              <span>Filtrar</span>
            </OutlinedButton>
          </S.SubHeader>
          {transactions.length > 0 ? (
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>ID</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th>Cliente</S.Th>
                  <S.Th>Vendedor</S.Th>
                  <S.Th>Valor da Compra</S.Th>
                  <S.Th>Método de Pagamento</S.Th>
                  <S.Th>Cashback</S.Th>
                  <S.Th>Taxa Takeback</S.Th>
                  <S.Th>Troco</S.Th>
                  <S.Th>Total a Pagar</S.Th>
                  <S.Th>Data de Emissão</S.Th>
                </S.Tr>
              </S.THead>
              <S.TBody>
                {transactions?.map((item, index) => (
                  <S.Tr key={index}>
                    <S.Td>{item.id}</S.Td>
                    <S.Td style={{ color: '#FD79A8' }}>
                      {item.transactionStatus.description}
                    </S.Td>
                    <S.Td>{item.consumer.fullName}</S.Td>
                    <S.Td>{item.companyUser?.name ?? '-'}</S.Td>
                    <S.Td>{currencyFormat(parseFloat(item.totalAmount))}</S.Td>
                    <S.Td>
                      {item.transactionPaymentMethods.length > 1
                        ? 'MÚLTIPLOS'
                        : item.transactionPaymentMethods[0]
                            ?.companyPaymentMethod.paymentMethod.description ??
                          '-'}
                    </S.Td>
                    <S.Td>
                      {currencyFormat(parseFloat(item.cashbackAmount))}
                    </S.Td>
                    <S.Td>
                      {currencyFormat(parseFloat(item.takebackFeeAmount))}
                    </S.Td>
                    <S.Td>{currencyFormat(parseFloat(item.backAmount))}</S.Td>
                    <S.Td>
                      {currencyFormat(
                        parseFloat(item.cashbackAmount) +
                          parseFloat(item.takebackFeeAmount) +
                          parseFloat(item.backAmount)
                      )}
                    </S.Td>
                    <S.Td>{new Date(item.createdAt).toLocaleString()}</S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
          ) : (
            <S.NoCashbacksMessageContent>
              <S.NoCashbacksMessage>Nenhum cashback</S.NoCashbacksMessage>
            </S.NoCashbacksMessageContent>
          )}

          {!endList && (
            <S.Footer>
              <S.LoadMoreButton onClick={getMoreData}>
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
      <DefaultModal
        title="Filtrar Cashbacks"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <Form ref={formRef} onSubmit={handleFilters}>
          <S.ModalContent>
            <S.FormWrapper>
              <SelectInput
                name="status"
                label="Status"
                options={[...defaultSelect, ...cashbackStatus]}
              />
            </S.FormWrapper>
            <S.ModalFooter>
              <OutlinedButton type="submit" color={theme.colors['blue-600']}>
                <span>Buscar</span>
              </OutlinedButton>
            </S.ModalFooter>
          </S.ModalContent>
        </Form>
      </DefaultModal>
    </Layout>
  )
}
