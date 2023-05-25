import React, { useState } from 'react'

import {
  Flex,
  IconButton,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr
} from '@chakra-ui/react'

import PageLoader from '../../../components/loaders/primaryLoader'

import { IoEye } from 'react-icons/io5'

import useSWR from 'swr'

import { useNavigate } from 'react-router'
import Layout from '../../../components/ui/Layout'
import { Pagination } from '../../../components/tables/Pagination'
import { Paginated } from '../../../types'
import { AppTable } from '../../../components/tables'

interface Raffle {
  id: string
  title: string
  drawDate: string
  company: {
    fantasyName: true
  }
  createdAt: string
  status: {
    id: number
    description: RaffleStatus
  }
  _count: {
    items: number
  }
}

export enum RaffleStatus {
  WAITING = 'Aguardando aprovação',
  APPROVED = 'Aprovado',
  REPROVED = 'Reprovado',
  CANCELED = 'Cancelado',
  FINISHED = 'Finalizado',
  DELIVERING = 'Entrega dos prêmios',
  PENDING_FINISHED = 'Finalizado com pendencias',
  CANCELED_FOR_NON_COMPLIANCE = 'Cancelado por inconformidade'
}

const statusColor: { [key in RaffleStatus]: string } = {
  'Aguardando aprovação': 'yellow',
  Aprovado: 'green',
  Cancelado: 'red',
  Reprovado: 'red',
  Finalizado: 'blue',
  'Cancelado por inconformidade': 'red',
  'Entrega dos prêmios': 'blue',
  'Finalizado com pendencias': 'teal'
}

export function Raffles() {
  const navigateTo = useNavigate()

  const [page, setPage] = useState(1)

  const { data } = useSWR<Paginated<Raffle>>(`manager/raffles?page=${page}`)

  if (!data) {
    return (
      <Layout title="Saque">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Sorteios" p={4}>
      <AppTable
        dataLength={data.data.length}
        noDataMessage="Nenhum sorteio"
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
            <Th>Titulo</Th>
            <Th>Status</Th>
            <Th>Qtd de Prêmios</Th>
            <Th isNumeric>Data do sorteio</Th>
            <Th isNumeric>Data de criação</Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map(raffle => (
            <Tr color="gray.500" key={raffle.id}>
              <Td>{raffle.company.fantasyName}</Td>
              <Td fontSize="xs">
                <Text maxW="md" isTruncated noOfLines={1}>
                  {raffle.title}
                </Text>
              </Td>
              <Td fontSize="xs">
                <Tag colorScheme={statusColor[raffle.status.description]}>
                  {raffle.status.description}
                </Tag>
              </Td>
              <Td fontSize="xs">
                <Tag size="sm">{raffle._count.items}</Tag>
              </Td>
              <Td fontSize="xs" isNumeric>
                {new Date(raffle.drawDate).toLocaleString()}
              </Td>
              <Td fontSize="xs" isNumeric>
                {new Date(raffle.createdAt).toLocaleDateString()}
              </Td>
              <Td isNumeric>
                <Tooltip label="Detalhes">
                  <IconButton
                    size="sm"
                    aria-label="cancel"
                    icon={<IoEye />}
                    onClick={() =>
                      navigateTo(`/parceiros/sorteios/${raffle.id}`)
                    }
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
