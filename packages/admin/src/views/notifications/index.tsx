import React, { useState } from 'react'

import { Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

import PageLoader from '../../components/loaders/primaryLoader'

import useSWR from 'swr'

import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import Layout from '../../components/ui/Layout'
import { Paginated } from '../../types'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  readAt: string | null
  createdAt: string
}

const NotificationType: { [key: string]: string } = {
  NEW_CASHBACK: 'Novo Cashback',
  CASHBACK_APPROVED: 'Cashback aprovado',
  PAYMENT_APPROVED: 'Pagamento aprovado',
  NEW_RAFFLE: 'Novo sorteio',
  NEW_COMPANY: 'Nova companhia',
  RAFFLE_WINNER: 'Vencedor do sorteio',
  BONUS: 'Bonus',
  CUSTOM: 'Notificação aprovada',
  NEW_CUSTOM_NOTIFICATION_REQUEST: 'Nova solicitação de notificação',
  NEW_PAYMENT_ORDER: 'Nova ordem de pedido',
  NEW_RAFFLE_TO_APPROVE: 'Novo sorteio para aprovação',
  NEW_REPRESENTATIVE_WITHDRAW_REQUEST: 'Novo saque de representante',
  NEW_PARTNER_WITHDRAW_REQUEST: 'Novo saque de parceiro'
}

export function Notifications() {
  const [page, setPage] = useState(1)

  const { data } = useSWR<Paginated<Notification>>(
    `/manager/notifications?page=${page}`
  )

  if (!data) {
    return (
      <Layout title="Notificações">
        <Flex w="full" h="70vh" align="center" justify="center">
          <PageLoader />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Notificações" p={4}>
      <AppTable
        dataLength={data.data.length}
        noDataMessage="Nenhuma Notificação"
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
            <Th>Titulo</Th>
            <Th>Mensagem</Th>
            <Th>Tipo</Th>
            <Th>Data da visualização</Th>
            <Th isNumeric>Data de criação</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map(notification => (
            <Tr color="gray.500" key={notification.id}>
              <Td>{notification.title}</Td>
              <Td fontSize="xs">
                <Text maxW="md">{notification.body}</Text>
              </Td>
              <Td fontSize="xs">{NotificationType[notification.type]}</Td>
              <Td fontSize="xs">
                {notification.readAt != null
                  ? new Date(notification.readAt).toLocaleString()
                  : '-'}
              </Td>
              <Td fontSize="xs" isNumeric>
                {new Date(notification.createdAt).toLocaleDateString()}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </AppTable>
    </Layout>
  )
}
