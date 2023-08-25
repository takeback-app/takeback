import React, { useState } from 'react'

import {
  Box,
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
  useDisclosure
} from '@chakra-ui/react'

import { IoEye, IoFilterSharp } from 'react-icons/io5'

import useSWR from 'swr'
import Loader from 'react-spinners/PulseLoader'
import { useNavigate } from 'react-router'
import Layout from '../../components/ui/Layout'
import { maskCurrency } from '../../utils/masks'
import { Paginated } from '../../types'
import { Pagination } from '../../components/tables/Pagination'
import { AppTable } from '../../components/tables'
import { FilterDrawer } from './filter/FilterDrawer'
import { useExtract } from './filter/state'
import { currencyFormat } from '../../utils/currencytFormat'

interface Bonus {
  id: string
  type: BonusType
  value: number
  createdAt: string
  transaction: {
    company: {
      fantasyName: string
    }
    consumer: {
      fullName: string
    }
  }
  transactionId?: number
  consumer: {
    fullName: string
  }
}

interface BonusPaginated<T> extends Paginated<T> {
  totalizer: {
    bonusCount: number
    totalAmount: number
  }
}

export enum BonusType {
  SELL = 'SELL',
  NEW_USER = 'NEW_USER',
  CONSULTANT = 'CONSULTANT',
  REFERRAL = 'REFERRAL'
}

export const typeText: { [key in BonusType]: string } = {
  SELL: 'Venda',
  NEW_USER: 'Novo Usuário',
  CONSULTANT: 'Consultor',
  REFERRAL: 'Indicação'
}

export function Bonus() {
  const navigateTo = useNavigate()
  const [page, setPage] = useState(1)
  const { dateStart, dateEnd, bonusType } = useExtract()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    bonusType
  }

  const { data, isLoading } = useSWR<BonusPaginated<Bonus>>([
    `manager/bonus`,
    filter
  ])

  function getBonusType(bonus: Bonus) {
    if (
      bonus.type === BonusType.NEW_USER ||
      bonus.type === BonusType.REFERRAL
    ) {
      return `${typeText[bonus.type]} (${
        bonus.transaction?.consumer?.fullName
      })`
    }
    return typeText[bonus.type]
  }

  return (
    <Layout title="Gratificações">
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
        <Flex align="center" justify="space-between">
          <Flex gap="20">
            <Box>
              <Text fontWeight="bold">Total de Bônus:</Text>
              <Text>{data?.totalizer.bonusCount}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Valor Total:</Text>
              <Text>{currencyFormat(data?.totalizer.totalAmount)}</Text>
            </Box>
          </Flex>
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
          dataLength={data?.data.length}
          noDataMessage="Nenhuma gratificação"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={data?.meta?.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Cliente</Th>
              <Th>Empresa</Th>
              <Th>Tipo</Th>
              <Th>Valor</Th>
              <Th isNumeric>Transação originaria</Th>
              <Th isNumeric>Data de criação</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data.map(bonus => (
              <Tr color="gray.500" key={bonus.id}>
                <Td fontSize="xs">{bonus.consumer.fullName}</Td>
                <Td fontSize="xs">{bonus.transaction?.company?.fantasyName}</Td>
                <Td fontSize="xs">{getBonusType(bonus)}</Td>
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
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
