import React, { useState } from 'react'

import {
  Flex,
  IconButton,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react'

import PageLoader from '../../components/loaders/primaryLoader'

import { IoEye } from 'react-icons/io5'

import useSWR from 'swr'

import { useNavigate } from 'react-router'
import Layout from '../../components/ui/Layout'
import { maskCurrency } from '../../utils/masks'
import { Paginated } from '../../types'
import { Pagination } from '../../components/tables/Pagination'
import { AppTable } from '../../components/tables'

interface Bonus {
  id: string
  type: BonusType
  value: number
  createdAt: string
  transactionId?: number
  consumer: {
    fullName: string
  }
}

export enum BonusType {
  SELL = 'SELL',
  NEW_USER = 'NEW_USER',
  CONSULTANT = 'CONSULTANT'
}

export const typeText: { [key in BonusType]: string } = {
  SELL: 'Venda',
  NEW_USER: 'Novo Usuário',
  CONSULTANT: 'Consultor'
}

export function Bonus() {
  const navigateTo = useNavigate()

  const [page, setPage] = useState(1)

  const { data } = useSWR<Paginated<Bonus>>(`manager/bonus?page=${page}`)

  if (!data) {
    return (
      <Layout title="Gratificações">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Gratificações" p={4}>
      <AppTable
        dataLength={data.data.length}
        noDataMessage="Nenhuma gratificação"
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
            <Th>Cliente</Th>
            <Th>Tipo</Th>
            <Th>Valor</Th>
            <Th isNumeric>Transação originaria</Th>
            <Th isNumeric>Data de criação</Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map(bonus => (
            <Tr color="gray.500" key={bonus.id}>
              <Td>{bonus.consumer.fullName}</Td>
              <Td fontSize="xs">
                <Text maxW="md">{typeText[bonus.type]}</Text>
              </Td>
              <Td fontSize="xs">{maskCurrency(bonus.value)}</Td>
              <Td fontSize="xs" isNumeric>
                {bonus.transactionId ?? '-'}
              </Td>
              <Td fontSize="xs" isNumeric>
                {new Date(bonus.createdAt).toLocaleDateString()}
              </Td>
              <Td isNumeric>
                <Tooltip label="Detalhes">
                  <IconButton
                    size="sm"
                    aria-label="cancel"
                    icon={<IoEye />}
                    onClick={() => navigateTo(`/bonus/${bonus.id}`)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </AppTable>
    </Layout>
  )
}
