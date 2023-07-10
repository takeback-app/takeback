import React, { useContext, useState } from 'react'

import { IoFilterSharp } from 'react-icons/io5'

import { Layout } from '../../../components/ui/layout'
import { currencyFormat } from '../../../utils/currencyFormat'

import useSWR from 'swr'

import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { AppTable } from '../../../components/table'
import { Pagination } from '../../../components/table/Pagination'
import { Paginated } from '../../../types'
import { FilterDrawer } from './components/FilterDrawer'
import { AuthContext } from '../../../contexts/AuthContext'
import { chakraToastOptions } from '../../../components/ui/toast'
import {
  ChargebackModalButton,
  chargebackTransaction
} from '../../../components/modals/ChargebackModalButton'
import { FiRotateCw } from 'react-icons/fi'

interface Cashback {
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
  transactionStatusId: number
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

export function CashbackHistoric() {
  const toast = useToast(chakraToastOptions)
  const [transactionId, setTransactionId] = useState<number>()

  const { isManager } = useContext(AuthContext)

  const [page, setPage] = useState(1)
  const [statusId, setStatusId] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isChargeBackOpen,
    onOpen: onChargebackOpen,
    onClose: onChargebackClose
  } = useDisclosure()

  const {
    data: cashbacks,
    isLoading,
    mutate
  } = useSWR<Paginated<Cashback>>([
    'company/cashbacks/find/all',
    { page, statusId, cashierLimit: isManager ? undefined : '1' }
  ])

  function selectTransaction(transactionId: number) {
    setTransactionId(transactionId)
    onChargebackOpen()
  }

  async function handleChargebackSubmit() {
    if (!transactionId) return

    const [isOk, response] = await chargebackTransaction(transactionId)

    if (!isOk) {
      return toast({
        title: 'Atenção',
        description: response.message,
        status: 'error'
      })
    }

    toast({
      title: 'Sucesso',
      description: response.message,
      status: 'success'
    })

    await mutate()

    onChargebackClose()
  }

  return (
    <Layout title="Clientes">
      <Box p={4} overflow="hidden">
        <Flex align="center" justify="flex-end">
          <ButtonGroup>
            <Tooltip label="Filtrar">
              <IconButton
                size="lg"
                aria-label="show"
                colorScheme="twitter"
                icon={<IoFilterSharp />}
                onClick={onOpen}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
        <AppTable
          dataLength={cashbacks?.data.length}
          noDataMessage={
            isManager
              ? 'Nenhuma venda realizada'
              : 'Nenhuma venda realizada hoje'
          }
          mt={4}
          overflowY="scroll"
          pagination={
            <Pagination
              page={page}
              isLoading={isLoading}
              setPage={setPage}
              lastPage={cashbacks?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Status</Th>
              <Th>Cliente</Th>
              <Th>Vendedor</Th>
              <Th>Valor da Compra</Th>
              <Th>Método de Pgto</Th>
              <Th>Cashback</Th>
              <Th>Tx. Takeback</Th>
              <Th>Troco</Th>
              <Th>T. a Pagar</Th>
              <Th>Data de Emissão</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cashbacks?.data.map(item => (
              <Tr color="gray.500" key={item.id}>
                <Td fontSize="xs">{item.id}</Td>
                <Td fontSize="xs" color="pink.400">
                  {item.transactionStatus.description}
                </Td>
                <Td fontSize="xs">{item.consumer.fullName}</Td>
                <Td fontSize="xs">{item.companyUser?.name ?? '-'}</Td>
                <Td fontSize="xs">
                  {currencyFormat(parseFloat(item.totalAmount))}
                </Td>
                <Td fontSize="xs">
                  {item.transactionPaymentMethods.length > 1
                    ? 'Múltiplos'
                    : item.transactionPaymentMethods[0]?.companyPaymentMethod
                        .paymentMethod.description ?? '-'}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(parseFloat(item.cashbackAmount))}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(parseFloat(item.takebackFeeAmount))}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(parseFloat(item.backAmount))}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(
                    parseFloat(item.cashbackAmount) +
                      parseFloat(item.takebackFeeAmount) +
                      parseFloat(item.backAmount)
                  )}
                </Td>
                <Td fontSize="xs">
                  {new Date(item.createdAt).toLocaleString()}
                </Td>

                <Td>
                  {isManager && item.transactionStatusId === 3 && (
                    <Tooltip label="Estornar" aria-label="Estornar">
                      <IconButton
                        size="xs"
                        onClick={() => selectTransaction(item.id)}
                        colorScheme="orange"
                        icon={<FiRotateCw />}
                        aria-label="Estornar"
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Box>
      <FilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        setStatusId={setStatusId}
        statusId={statusId}
      />
      <ChargebackModalButton
        isOpen={isChargeBackOpen}
        onClose={onChargebackClose}
        onSubmit={handleChargebackSubmit}
      />
    </Layout>
  )
}
