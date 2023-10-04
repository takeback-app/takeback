import React, { useState } from 'react'
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  SimpleGrid,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import useSWR from 'swr'
import Loader from 'react-spinners/PulseLoader'
import { IoFilterSharp } from 'react-icons/io5'
import { FilterDrawer } from './FilterDrawer'
import { Paginated } from '../../../types'
import { TransactionSourceEnum } from '../../../enums/TransactionSource.enum'
import { useTransfer } from './state'
import Layout from '../../../components/ui/Layout'
import { AppTable } from '../../../components/tables'
import { Pagination } from '../../../components/tables/Pagination'
import { TextBreak } from '../../../components/tables/TextBreak'
import { currencyFormat } from '../../../utils/currencytFormat'
import { OptionsButton } from './OptionsButton'

export interface TransfersData {
  id: number
  value: number
  createdAt: string
  isPaid: boolean
  pix: {
    value: number
  }
  consumer: {
    fullName: string
    consumerAddress: {
      city: {
        name: string
      }
    }
  }
}

export function Transfers() {
  const [page, setPage] = useState(1)
  const { dateStart, dateEnd, order, orderBy, isPaid } = useTransfer()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    isPaid,
    order,
    orderByColumn: orderBy
  }

  const { data: transfers, isLoading } = useSWR<Paginated<TransfersData>>([
    'manager/consumers/deposits',
    filter
  ])

  return (
    <Layout title="Transferências">
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
          <OptionsButton />
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
          dataLength={transfers?.data.length}
          noDataMessage="Nenhum cashback"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={transfers?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Cidade</Th>
              <Th>Valor Creditado</Th>
              <Th>Valor Pago</Th>
              <Th>Foi Pago?</Th>
              <Th>Dt. de emissão</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transfers?.data.map(transfer => (
              <Tr color="gray.500" key={transfer.id}>
                <Td fontSize="xs">{transfer.consumer.fullName}</Td>
                <Td fontSize="xs">
                  <TextBreak>
                    {transfer.consumer.consumerAddress.city.name}
                  </TextBreak>
                </Td>
                <Td fontSize="xs">{currencyFormat(transfer.value)}</Td>
                <Td fontSize="xs">{currencyFormat(transfer.pix.value)}</Td>
                <Td fontSize="xs">{transfer.isPaid ? 'Sim' : 'Não'}</Td>
                <Td fontSize="xs">
                  {new Date(transfer.createdAt).toLocaleString()}
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
