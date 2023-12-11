/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  IoArrowForwardSharp,
  IoWalletOutline,
  IoEyeOutline,
  IoFilterSharp
} from 'react-icons/io5'
import Loader from 'react-spinners/PulseLoader'

import { currencyFormat } from '../../../../utils/currencytFormat'

import Layout from '../../../../components/ui/Layout'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import Toastify from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import { FilterDrawer } from './components/filter/FilterDrawer'
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
  useDisclosure
} from '@chakra-ui/react'
import { AppTable } from '../../../../components/tables'
import { Pagination } from '../../../../components/tables/Pagination'
import { Paginated } from '../../../../types'
import useSWR from 'swr'
import { usePaymentOrders } from './components/filter/state'

export interface PaymentOrdersData {
  id: number
  value: number
  createdAt: string
  approvedAt: string
  ticketName: string
  ticketPath: string
  pixKey: string
  company: {
    id: string
    fantasyName: string
    email: string
  }
  paymentOrderStatus: {
    description: string
  }
  paymentOrderMethod: {
    id: number
    description: string
  }
}

export function PaymentOrders() {
  const navigateTo = useNavigate()

  const [page, setPage] = useState(1)

  const { statusId, paymentMethodId, companyId, startDate, endDate } =
    usePaymentOrders()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const limit = 60

  const filter = {
    page,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
    companyId,
    statusId,
    paymentMethodId,
    limit
  }

  const { data: paymentOrders, isLoading } = useSWR<
    Paginated<PaymentOrdersData>
  >(['manager/orders/find', filter])

  return (
    <Layout title="Ordens de pagamento">
      <Flex
        w="full"
        h="70vh"
        align="center"
        justify="center"
        display={isLoading ? 'flex' : 'none'}
      >
        <Loader color="rgba(54, 162, 235, 1)" />
      </Flex>
      <Box p={4} overflow="hidden" display={isLoading ? 'none' : 'block'}>
        <Flex align="center" justify="flex-end">
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
        <AppTable
          dataLength={paymentOrders?.data.length}
          noDataMessage="Nenhum cashback"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={paymentOrders?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Empresa</Th>
              <Th>Forma de pagamento</Th>
              <Th>Valor</Th>
              <Th>Status</Th>
              <Th>Data da solicitação</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentOrders?.data.map(order => (
              <Tr color="gray.500" key={order.id}>
                <Td fontSize="xs">{order.id}</Td>
                <Td fontSize="xs">{order.company.fantasyName}</Td>
                <Td fontSize="xs">{order.paymentOrderMethod.description}</Td>
                <Td fontSize="xs">{currencyFormat(order.value)}</Td>
                <Td fontSize="xs">{order.paymentOrderStatus.description}</Td>
                <Td fontSize="xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Td>
                <Td fontSize="xs">
                  {order.paymentOrderStatus.description ===
                    'Pagamento solicitado' && (
                    <QuartenaryButton
                      color={PALLET.COLOR_08}
                      icon={IoArrowForwardSharp}
                      onClick={() =>
                        navigateTo(`/cashbacks/pagamentos/${order.id}`)
                      }
                    />
                  )}
                  {order.paymentOrderStatus.description ===
                    'Aguardando confirmacao' && (
                    <QuartenaryButton
                      color={PALLET.COLOR_08}
                      icon={IoWalletOutline}
                      onClick={() =>
                        navigateTo(`/cashbacks/pagamentos/${order.id}`)
                      }
                    />
                  )}
                  {order.paymentOrderStatus.description === 'Autorizada' && (
                    <QuartenaryButton
                      color="#009900"
                      icon={IoEyeOutline}
                      onClick={() =>
                        navigateTo(`/cashbacks/pagamentos/${order.id}`)
                      }
                    />
                  )}
                  {order.paymentOrderStatus.description === 'Cancelada' && (
                    <QuartenaryButton
                      color={PALLET.COLOR_17}
                      icon={IoEyeOutline}
                      onClick={() =>
                        navigateTo(`/cashbacks/pagamentos/${order.id}`)
                      }
                    />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
      <Toastify />
    </Layout>
  )
}
