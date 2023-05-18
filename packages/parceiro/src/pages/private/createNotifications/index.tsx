import React, { useState } from 'react'

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast
} from '@chakra-ui/react'
import Loader from 'react-spinners/PulseLoader'

import useSWR from 'swr'

import { IoTrash } from 'react-icons/io5'
import { Layout } from '../../../components/ui/layout'
import { chakraToastOptions } from '../../../components/ui/toast'
import { useNavigate } from 'react-router'
import { AppTable } from '../../../components/table'
import { deleteNotificationSolicitation } from './services/api'

enum NotificationSolicitationSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ALL = 'ALL'
}

enum NotificationSolicitationStatus {
  CREATED = 'CREATED',
  APPROVED = 'APPROVED',
  REPROVED = 'REPROVED'
}

enum StoreVisitType {
  NEVER = 'NEVER',
  FROM_THE_DATE_OF_PURCHASE = 'FROM_THE_DATE_OF_PURCHASE',
  ALL = 'ALL'
}

interface NotificationSolicitation {
  id: string
  title: string
  message: string
  companyId: string
  status: NotificationSolicitationStatus
  audienceSex: NotificationSolicitationSex
  minAudienceAge: number | null
  maxAudienceAge: number | null
  audienceBalance: string | null
  storeVisitType: StoreVisitType
  dateOfPurchase: Date | null
  hasChildren: boolean | null
  createdAt: Date
}

const statusColor: { [key in NotificationSolicitationStatus]: string } = {
  CREATED: 'yellow.500',
  APPROVED: 'green.500',
  REPROVED: 'red.500'
}

const statusText: { [key in NotificationSolicitationStatus]: string } = {
  CREATED: 'Aguardando aprovação',
  APPROVED: 'Aprovado',
  REPROVED: 'Reprovado'
}

export function Notifications() {
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastOptions)

  const { data: monthlyRemainingData } = useSWR<{ monthlyRemaining: number }>(
    'company/notification-solicitations/monthly-remaining'
  )

  const {
    data: notificationSolicitations,
    isLoading,
    mutate
  } = useSWR<NotificationSolicitation[]>('company/notification-solicitations')

  const [deletingId, setDeletingId] = useState<string>()

  async function handleDeleteNotificationSolicitation(id: string) {
    setDeletingId(id)

    const [isOk, data] = await deleteNotificationSolicitation(id)

    setDeletingId(undefined)

    if (!isOk) {
      return toast({
        title: 'Ops :(',
        description: data.message,
        status: 'error'
      })
    }

    await mutate()

    toast({
      title: 'Sucesso',
      description: data.message,
      status: 'success'
    })
  }

  if (isLoading || !notificationSolicitations) {
    return (
      <Layout title="Notificações">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Notificações">
      <Box p={4}>
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="gray.500" fontWeight="semibold">
            Notificações restantes para esse mês:{' '}
            {monthlyRemainingData?.monthlyRemaining}
          </Text>
          <Button
            colorScheme="blue"
            isDisabled={(monthlyRemainingData?.monthlyRemaining ?? 0) <= 0}
            onClick={() => navigateTo('/notificacoes/create')}
          >
            Criar
          </Button>
        </Flex>
        <AppTable
          dataLength={notificationSolicitations.length}
          noDataMessage="Nenhuma notificação"
          mt={4}
        >
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Mensagem</Th>
              <Th isNumeric>Data de criação</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {notificationSolicitations?.map(
              ({ createdAt, id, status, message }) => (
                <Tr color="gray.500" key={id}>
                  <Td fontSize="xs" color={statusColor[status]}>
                    {statusText[status]}
                  </Td>
                  <Td fontSize="xs">{message}</Td>
                  <Td fontSize="xs" isNumeric>
                    {new Date(createdAt).toLocaleDateString()}
                  </Td>
                  <Td isNumeric>
                    <ButtonGroup>
                      <Tooltip
                        isDisabled={
                          status !== NotificationSolicitationStatus.CREATED
                        }
                        label="Apagar"
                      >
                        <IconButton
                          size="sm"
                          aria-label="cancel"
                          icon={<IoTrash />}
                          isLoading={deletingId === id}
                          isDisabled={
                            status !== NotificationSolicitationStatus.CREATED
                          }
                          onClick={() =>
                            handleDeleteNotificationSolicitation(id)
                          }
                        />
                      </Tooltip>
                    </ButtonGroup>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </AppTable>
      </Box>
    </Layout>
  )
}
