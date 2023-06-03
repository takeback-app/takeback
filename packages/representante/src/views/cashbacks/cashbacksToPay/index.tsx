import React, { useState } from 'react'

import useSWR from 'swr'
import Layout from '../../../components/ui/Layout'
import { Flex, IconButton, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { currencyFormat } from '../../../utils/currencytFormat'
import Loader from '../../../components/loaders/secondaryLoader'
import { IoEyeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router'
import { Paginated } from '../../../types'
import { Pagination } from '../../../components/tables/Pagination'
import { AppTable } from '../../../components/tables'

export enum WithdrawStatus {
  PAGO = 'Pago',
  CANCELADO = 'Cancelado',
  SOLICITADO = 'Saque solicitado'
}

interface Withdraw {
  id: string
  value: number
  pixKey: string
  company: {
    id: string
    fantasyName: string
  }
  status: {
    id: number
    description: WithdrawStatus
  }
  createdAt: string
}

const statusColor = {
  Pago: 'green.500',
  Cancelado: 'red.500',
  'Saque solicitado': 'orange.500'
}

export function CashbackWithdraw() {
  const navigateTo = useNavigate()

  const [page, setPage] = useState(1)

  const { data } = useSWR<Paginated<Withdraw>>(`manager/withdraws?page=${page}`)

  if (!data) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Saque" p={4}>
      <AppTable
        dataLength={data.data.length}
        noDataMessage="Nenhum pedido de saque"
        pagination={
          <Pagination
            page={page}
            setPage={setPage}
            lastPage={data.meta.lastPage}
          />
        }
      >
        <Thead>
          <Tr>
            <Th>Empresa</Th>
            <Th>Status</Th>
            <Th>Valor</Th>
            <Th>Chave Pix</Th>
            <Th isNumeric>Data de criação</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map(
            ({ createdAt, id, pixKey, status, value, company }) => (
              <Tr color="gray.500" key={id}>
                <Td>{company.fantasyName}</Td>
                <Td fontSize="xs" color={statusColor[status.description]}>
                  {status.description.toUpperCase()}
                </Td>
                <Td fontSize="xs">{currencyFormat(value)}</Td>
                <Td fontSize="xs">{pixKey}</Td>
                <Td fontSize="xs" isNumeric>
                  {new Date(createdAt).toLocaleDateString()}
                </Td>
                <Td isNumeric>
                  <IconButton
                    icon={<IoEyeOutline />}
                    onClick={() => navigateTo(`/cashbacks/saque/${id}`)}
                    aria-label="eye"
                    size="sm"
                  />
                </Td>
              </Tr>
            )
          )}
        </Tbody>
      </AppTable>
    </Layout>
  )
}
