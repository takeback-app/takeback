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

import { IoBan, IoEye, IoPencil } from 'react-icons/io5'
import { Layout } from '../../../components/ui/layout'
import { chakraToastOptions } from '../../../components/ui/toast'
import { currencyFormat } from '../../../utils/currencyFormat'
import { cancelRaffle } from './services/api'
import { useNavigate } from 'react-router'
import { AppTable } from '../../../components/table'

interface Raffle {
  id: string
  title: string
  ticketValue: string
  drawDate: string
  createdAt: string
  status: {
    description: RaffleStatus
  }
  _count: {
    items: number
  }
}

export enum RaffleStatus {
  WAITING_APPROVAL = 'Aguardando aprovação',
  APPROVED = 'Aprovado',
  REPROVED = 'Reprovado',
  CANCELED = 'Cancelado',
  FINISHED = 'Finalizado',
  DELIVERING = 'Entrega dos prêmios',
  PENDING_FINISHED = 'Finalizado com pendencias'
}

const statusColor: { [key in RaffleStatus]: string } = {
  'Aguardando aprovação': 'yellow.500',
  Aprovado: 'green.500',
  Cancelado: 'red.500',
  Reprovado: 'red.500',
  Finalizado: 'blue.500',
  'Entrega dos prêmios': 'blue.500',
  'Finalizado com pendencias': 'orange.500'
}

export function Raffles() {
  const navigateTo = useNavigate()
  const toast = useToast(chakraToastOptions)

  const { data: monthlyRemainingData } = useSWR<{ monthlyRemaining: number }>(
    'company/raffles/monthly-remaining'
  )

  const {
    data: raffles,
    isLoading,
    mutate
  } = useSWR<Raffle[]>('company/raffles')

  const [cancelingId, setCancelingId] = useState<string>()

  async function cancelWithdraw(id: string) {
    setCancelingId(id)

    const [isOk, data] = await cancelRaffle(id)

    setCancelingId(undefined)

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

  if (isLoading || !raffles) {
    return (
      <Layout title="Sorteios">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout title="Sorteios">
      <Box p={4}>
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="gray.500" fontWeight="semibold">
            Sorteios restantes para esse mês:{' '}
            {monthlyRemainingData?.monthlyRemaining}
          </Text>
          <Button
            colorScheme="blue"
            isDisabled={(monthlyRemainingData?.monthlyRemaining ?? 0) <= 0}
            onClick={() => navigateTo('/sorteios/create')}
          >
            Criar
          </Button>
        </Flex>
        <AppTable
          dataLength={raffles.length}
          noDataMessage="Nenhum sorteio"
          mt={4}
        >
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Titulo</Th>
              <Th>Valor do Ticket</Th>
              <Th>Qtd de Prêmios</Th>
              <Th isNumeric>Data do sorteio</Th>
              <Th isNumeric>Data de criação</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {raffles?.map(
              ({
                createdAt,
                id,
                _count,
                drawDate,
                status,
                ticketValue,
                title
              }) => (
                <Tr color="gray.500" key={id}>
                  <Td fontSize="xs" color={statusColor[status.description]}>
                    {status.description.toUpperCase()}
                  </Td>
                  <Td fontSize="xs">{title}</Td>
                  <Td fontSize="xs">{currencyFormat(Number(ticketValue))}</Td>
                  <Td fontSize="xs">{_count.items}</Td>
                  <Td fontSize="xs" isNumeric>
                    {new Date(drawDate).toLocaleDateString()}
                  </Td>
                  <Td fontSize="xs" isNumeric>
                    {new Date(createdAt).toLocaleDateString()}
                  </Td>
                  <Td isNumeric>
                    <ButtonGroup>
                      <Tooltip
                        label={
                          status.description !== RaffleStatus.WAITING_APPROVAL
                            ? 'Visualizar'
                            : 'Editar'
                        }
                      >
                        <IconButton
                          size="sm"
                          aria-label="show"
                          icon={
                            status.description !==
                            RaffleStatus.WAITING_APPROVAL ? (
                              <IoEye />
                            ) : (
                              <IoPencil />
                            )
                          }
                          onClick={() => {
                            const route =
                              status.description !==
                              RaffleStatus.WAITING_APPROVAL
                                ? `/sorteios/${id}`
                                : `/sorteios/${id}/edit`

                            navigateTo(route)
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        isDisabled={
                          status.description !== RaffleStatus.WAITING_APPROVAL
                        }
                        label="Cancelar"
                      >
                        <IconButton
                          size="sm"
                          aria-label="cancel"
                          icon={<IoBan />}
                          isLoading={cancelingId === id}
                          isDisabled={
                            status.description !== RaffleStatus.WAITING_APPROVAL
                          }
                          onClick={() => cancelWithdraw(id)}
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
