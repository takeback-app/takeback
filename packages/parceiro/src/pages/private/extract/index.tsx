import React, { useState } from 'react'

import { Layout } from '../../../components/ui/layout'

import useSWR from 'swr'

import { Box, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { AppTable } from '../../../components/table'
import { Pagination } from '../../../components/table/Pagination'
import { MonthTitle } from './styles'
import { PaymentOrdersItem } from './components/PaymentOrderItem'
import { MonthlyPaymentItem } from './components/MonthlyPaymentItem'
import { StoreOrderItem } from './components/StoreOrderItem'
import { TransactionItem } from './components/TransactionItem'
import { WithdrawOrderItem } from './components/WithdrawOrderItem'

export interface PaymentOrdersData {
  id: number
  value: number
  paymentOrderStatus: string
}

export interface MonthlyPaymentsData {
  id: number
  amountPaid: number
}

export interface StoreOrderData {
  id: string
  buyValue: number
  quantity: number
  productName: string
}

export interface TransactionData {
  id: number
  totalAmount: number
}

export interface WithdrawOrderData {
  id: string
  value: number
  status: string
}

type ExtractItemType =
  | { type: 'PAYMENT_ORDERS'; data: PaymentOrdersData }
  | { type: 'MONTHLY_PAYMENTS'; data: MonthlyPaymentsData }
  | { type: 'STORE_ORDER'; data: StoreOrderData }
  | { type: 'TRANSACTION'; data: TransactionData }
  | { type: 'WITHDRAW_ORDER'; data: WithdrawOrderData }

export type ExtractItem = ExtractItemType & {
  id: string
  referenceDate: Date
}

type ExtractData = ExtractItem & {
  title: string
  data: ExtractItem[]
}

enum ExtractTypes {
  PAYMENT_ORDERS = 'PAYMENT_ORDERS',
  STORE_ORDER = 'STORE_ORDER',
  MONTHLY_PAYMENTS = 'MONTHLY_PAYMENTS',
  TRANSACTION = 'TRANSACTION',
  WITHDRAW_ORDER = 'WITHDRAW_ORDER'
}

enum ExtractDescriptionTypes {
  PAYMENT_ORDERS = 'Ordens de Pagamento',
  STORE_ORDER = 'Ofertas',
  MONTHLY_PAYMENTS = 'Mensalidades',
  TRANSACTION = 'Pago com Takeback',
  WITHDRAW_ORDER = 'Saque'
}

export function Extract() {
  const [page, setPage] = useState(1)

  const { data: extract, isLoading } = useSWR<ExtractData>([
    'company/extract/paginated',
    {
      page
    }
  ])

  return (
    <Layout title="Histórico de Lançamentos">
      <Box p={4} overflow="hidden">
        <MonthTitle>{extract?.title}</MonthTitle>
        <AppTable
          dataLength={extract?.data.length}
          noDataMessage="Não há transações"
          mt={4}
          overflowY="scroll"
          pagination={
            <Pagination
              page={page}
              isLoading={isLoading}
              setPage={setPage}
              lastPage={0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th px="2">Data</Th>
              <Th px="2">Tipo</Th>
              <Th px="2">Transação</Th>
              <Th px="2">Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {extract?.data.map(item => {
              switch (item.type) {
                case 'PAYMENT_ORDERS':
                  return (
                    <PaymentOrdersItem
                      data={item?.data}
                      referenceDate={item?.referenceDate}
                      type={ExtractDescriptionTypes[item.type]}
                    ></PaymentOrdersItem>
                  )
                case 'MONTHLY_PAYMENTS':
                  return (
                    <MonthlyPaymentItem
                      data={item?.data}
                      referenceDate={item?.referenceDate}
                      type={ExtractDescriptionTypes[item.type]}
                    ></MonthlyPaymentItem>
                  )
                case 'STORE_ORDER':
                  return (
                    <StoreOrderItem
                      data={item?.data}
                      referenceDate={item?.referenceDate}
                      type={ExtractDescriptionTypes[item.type]}
                    ></StoreOrderItem>
                  )
                case 'TRANSACTION':
                  return (
                    <TransactionItem
                      data={item?.data}
                      referenceDate={item?.referenceDate}
                      type={ExtractDescriptionTypes[item.type]}
                    ></TransactionItem>
                  )
                case 'WITHDRAW_ORDER':
                  return (
                    <WithdrawOrderItem
                      data={item?.data}
                      referenceDate={item?.referenceDate}
                      type={ExtractDescriptionTypes[item.type]}
                    ></WithdrawOrderItem>
                  )
                default:
                  return null
              }
            })}
          </Tbody>
        </AppTable>
      </Box>
    </Layout>
  )
}
