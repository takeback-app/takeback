/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { API } from '../../../services/API'
import { CData } from '../../../contexts/CData'
import { Layout } from '../../../components/ui/layout'

import { currencyFormat } from '../../../utils/currencyFormat'
import { Loader } from '../../../components/loaders/secondaryLoader'
import { DisplayInfo } from '../../../components/ui/displayInfo'

import * as S from './styles'

interface TransactionProps {
  transaction_id: number
  transaction_totalAmount: string
  transaction_takebackFeeAmount: string
  transaction_cashbackAmount: string
  transaction_backAmount: string
  transaction_createdAt: Date
  consumer_fullName: string
  status_description: string
}

export const PaymentOrderDetails: React.FC = () => {
  const { index } = useParams()
  const orderIndex = parseInt(index || '')
  const { paymentOrders } = useContext(CData)

  const [transactionsLoader, setTransactionsLoader] = useState(false)
  const [transactions, setTransactions] = useState(
    [] as Array<TransactionProps>
  )

  const findDetails = () => {
    setTransactionsLoader(true)
    API.get(
      `/company/order/find/transactions/${paymentOrders[orderIndex].order_id}`
    )
      .then(response => {
        setTransactions(response.data)
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setTransactionsLoader(false)
      })
  }

  useEffect(() => {
    findDetails()
  }, [])

  return (
    <Layout title={'Detalhe da Ordem de Pagamento'}>
      <S.Container>
        <S.Content>
          <DisplayInfo
            label="Valor"
            value={currencyFormat(paymentOrders[orderIndex].order_value || 0)}
          />
          <DisplayInfo
            label="Forma de pagamento"
            value={paymentOrders[orderIndex].paymentMethod_description}
          />
          <DisplayInfo
            label="Status"
            value={paymentOrders[orderIndex].status_description}
          />
          <DisplayInfo
            label="Data da solicitação"
            value={new Date(
              paymentOrders[orderIndex].order_createdAt
            ).toLocaleDateString()}
          />
          {paymentOrders[orderIndex].order_approvedAt && (
            <DisplayInfo
              label="Data da confirmação/cancelamento"
              value={new Date(
                paymentOrders[orderIndex].order_approvedAt
              ).toLocaleDateString()}
            />
          )}
        </S.Content>
        {paymentOrders[orderIndex].status_description !== 'Cancelada' && (
          <S.TransactionsWrapper>
            <h4>Cashbacks referentes</h4>
            {transactionsLoader ? (
              <S.ContentTransactionsLoader>
                <Loader />
                <h6>Carregando cashbacks ...</h6>
              </S.ContentTransactionsLoader>
            ) : (
              <S.Table>
                <S.THead>
                  <S.Tr>
                    <S.Th>N° Transação</S.Th>
                    <S.Th>Status</S.Th>
                    <S.Th>Cliente</S.Th>
                    <S.Th>Valor da Compra</S.Th>
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
                      <S.Td>{item.transaction_id}</S.Td>
                      <S.Td style={{ color: '#FD79A8' }}>
                        {item.status_description}
                      </S.Td>
                      <S.Td>{item.consumer_fullName}</S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_totalAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_cashbackAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_takebackFeeAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_backAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {currencyFormat(
                          parseFloat(item.transaction_cashbackAmount) +
                            parseFloat(item.transaction_takebackFeeAmount) +
                            parseFloat(item.transaction_backAmount)
                        )}
                      </S.Td>
                      <S.Td>
                        {new Date(
                          item.transaction_createdAt
                        ).toLocaleDateString()}
                      </S.Td>
                    </S.Tr>
                  ))}
                </S.TBody>
              </S.Table>
            )}
          </S.TransactionsWrapper>
        )}
      </S.Container>
    </Layout>
  )
}
