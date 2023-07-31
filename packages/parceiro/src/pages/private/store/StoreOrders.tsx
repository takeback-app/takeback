import React from 'react'

import {
  Box,
  ButtonGroup,
  Flex,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react'
import Loader from 'react-spinners/PulseLoader'
import useSWR from 'swr'
import { AppTable } from '../../../components/table'
import { Layout } from '../../../components/ui/layout'
import { StoreOrder } from '../../../types'
import { currencyFormat } from '../../../utils/currencyFormat'
import { ConfirmationWithdrawalButton } from '../raffles/components/ConfirmationWithdrawalButton'

export function StoreOrders() {
  const { data, isLoading } = useSWR<StoreOrder[]>('company/store/orders')

  if (isLoading || !data) {
    return (
      <Layout title="Retirada de produtos">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Sorteios">
      <Box p={4}>
        <AppTable
          dataLength={data.length}
          noDataMessage="Nenhuma retirada"
          mt={4}
        >
          <Thead>
            <Tr>
              <Th>Produto</Th>
              <Th>Qtd</Th>
              <Th>Cliente</Th>
              <Th>Valor creditado</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(order => (
              <Tr color="gray.500" key={order.id}>
                <Td fontSize="xs">{order.product.name}</Td>
                <Td fontSize="xs">{order.quantity}</Td>
                <Td fontSize="xs">{order.consumer.fullName}</Td>
                <Td fontSize="xs">
                  {currencyFormat(
                    order.quantity * Number(order.product.buyPrice)
                  )}
                </Td>
                <Td isNumeric>
                  <ButtonGroup>
                    <Tooltip label="Cancelar">
                      <ConfirmationWithdrawalButton id={order.id} />
                    </Tooltip>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
      </Box>
    </Layout>
  )
}
