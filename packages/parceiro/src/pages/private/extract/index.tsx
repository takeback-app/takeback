import React from 'react'

import { Layout } from '../../../components/ui/layout'

import useSWR from 'swr'

import {
  Box,
  Tbody,
  Th,
  Thead,
  Tr,
  Flex,
  ButtonGroup,
  Tooltip,
  IconButton,
  Td,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { AppTable } from './components/table'
import { MonthTitle } from './styles'
import { PaymentOrdersItem } from './components/PaymentOrderItem'
import { MonthlyPaymentItem } from './components/MonthlyPaymentItem'
import { StoreOrderItem } from './components/StoreOrderItem'
import { TransactionItem } from './components/TransactionItem'
import { WithdrawOrderItem } from './components/WithdrawOrderItem'
import { FilterDrawer } from './components/filter/FilterDrawer'
import { useExtractReport } from './components/filter/state'
import { IoFilterSharp } from 'react-icons/io5'
import { Loader } from '../../../components/ui/loader'
import { currencyFormat } from '../../../utils/currencyFormat'

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
  companyCreditValue: number
  quantity: number
  productName: string
}

export interface TransactionData {
  id: number
  totalAmount: number
  consumerFullName: string
}

export interface WithdrawOrderData {
  id: string
  value: number
  status: string
}

interface Totalizer {
  currentBalance: number
  endPeriodBalance: number
  startPeriodBalance: number
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

interface ExtractData {
  title: string
  data: ExtractItem[]
  totalizer: Totalizer
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
  TRANSACTION = 'Venda',
  WITHDRAW_ORDER = 'Saque'
}

export function Extract() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { month, year } = useExtractReport()

  const { data: extract, isLoading } = useSWR<ExtractData>([
    'company/extract/paginated',
    {
      month,
      year
    }
  ])

  function getTable() {
    return (
      <AppTable
        dataLength={extract?.data.length}
        noDataMessage="Não há transações"
        mt={4}
        overflowY="scroll"
      >
        <Thead>
          <Tr key="tableHeader">
            <Th px="2">Data</Th>
            <Th px="2">Transação</Th>
            <Th px="2">Valor</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr color="gray.500" key="startBalance">
            <Td p="2" fontSize="md"></Td>
            <Td p="2" fontSize="md">
              <Text fontWeight="semibold" color="black">
                Saldo Anterior
              </Text>
            </Td>
            <Td p="2" fontSize="md">
              {getPeriodBalance(extract?.totalizer?.startPeriodBalance)}
            </Td>
          </Tr>
          {extract?.data.map(item => {
            switch (item.type) {
              case ExtractTypes.PAYMENT_ORDERS:
                return (
                  <PaymentOrdersItem
                    key={item.id}
                    data={item?.data}
                    referenceDate={item?.referenceDate}
                    type={ExtractDescriptionTypes[item.type]}
                  ></PaymentOrdersItem>
                )
              case ExtractTypes.MONTHLY_PAYMENTS:
                return (
                  <MonthlyPaymentItem
                    key={item.id}
                    data={item?.data}
                    referenceDate={item?.referenceDate}
                    type={ExtractDescriptionTypes[item.type]}
                  ></MonthlyPaymentItem>
                )
              case ExtractTypes.STORE_ORDER:
                return (
                  <StoreOrderItem
                    key={item.id}
                    data={item?.data}
                    referenceDate={item?.referenceDate}
                    type={ExtractDescriptionTypes[item.type]}
                  ></StoreOrderItem>
                )
              case ExtractTypes.TRANSACTION:
                return (
                  <TransactionItem
                    key={item.id}
                    data={item?.data}
                    referenceDate={item?.referenceDate}
                    type={ExtractDescriptionTypes[item.type]}
                  ></TransactionItem>
                )
              case ExtractTypes.WITHDRAW_ORDER:
                return (
                  <WithdrawOrderItem
                    key={item.id}
                    data={item?.data}
                    referenceDate={item?.referenceDate}
                    type={ExtractDescriptionTypes[item.type]}
                  ></WithdrawOrderItem>
                )
              default:
                return null
            }
          })}
          <Tr color="gray.500" key="startBalance">
            <Td p="2" fontSize="md"></Td>
            <Td p="2" fontSize="md">
              <Text fontWeight="semibold" color="black">
                Saldo Final do Período
              </Text>
            </Td>
            <Td p="2" fontSize="md">
              {getPeriodBalance(extract?.totalizer?.endPeriodBalance)}
            </Td>
          </Tr>
        </Tbody>
      </AppTable>
    )
  }

  function getPeriodBalance(periodBalance?: number) {
    const balance = periodBalance ?? 0
    if (balance === 0) {
      return (
        <Text fontWeight="semibold" color="black">
          {currencyFormat(balance)}
        </Text>
      )
    }
    if (balance > 0) {
      return (
        <Text fontWeight="semibold" color="green.600">
          +{currencyFormat(balance)}
        </Text>
      )
    }
    return (
      <Text fontWeight="semibold" color="red.600">
        {currencyFormat(balance)}
      </Text>
    )
  }

  return (
    <Layout title="Extrato">
      <Box p={4} overflow="hidden">
        <Flex align="center" justify="space-between">
          <MonthTitle>{extract?.title}</MonthTitle>
          {!isLoading && (
            <MonthTitle>
              Saldo Atual: {getPeriodBalance(extract?.totalizer.currentBalance)}
            </MonthTitle>
          )}
          <ButtonGroup>
            <Tooltip label="Filtrar">
              <IconButton
                mb={4}
                size="lg"
                aria-label="show"
                colorScheme="twitter"
                icon={<IoFilterSharp />}
                onClick={onOpen}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
        {!isLoading ? (
          getTable()
        ) : (
          <Flex
            w="full"
            align="center"
            justify="center"
            h="10vh"
            backgroundColor="white"
            mt={4}
            rounded="lg"
          >
            <Loader color="#3A4D5C" />
          </Flex>
        )}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
