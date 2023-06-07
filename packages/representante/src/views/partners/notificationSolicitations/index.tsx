import React from 'react'

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
  Tr
} from '@chakra-ui/react'
import Loader from 'react-spinners/PulseLoader'

import useSWR from 'swr'

import { IoEye } from 'react-icons/io5'
import { useNavigate } from 'react-router'
import Layout from '../../../components/ui/Layout'
import { AppTable } from '../../../components/tables'

enum NotificationSolicitationSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ALL = 'ALL'
}

export enum NotificationSolicitationStatus {
  CREATED = 'CREATED',
  APPROVED = 'APPROVED',
  REPROVED = 'REPROVED'
}

enum StoreVisitType {
  NEVER = 'NEVER',
  FROM_THE_DATE_OF_PURCHASE = 'FROM_THE_DATE_OF_PURCHASE',
  ALL = 'ALL'
}

export interface NotificationSolicitation {
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
  dateOfPurchase: string | null
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

export function NotificationSolicitationIndex() {
  const navigateTo = useNavigate()

  const { data: notificationSolicitations, isLoading } = useSWR<
    NotificationSolicitation[]
  >('manager/notification-solicitations')

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
                      <Tooltip label="Visualizar">
                        <IconButton
                          size="sm"
                          aria-label="view"
                          icon={<IoEye />}
                          onClick={() =>
                            navigateTo(
                              `/parceiros/notification-solicitations/${id}`
                            )
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
