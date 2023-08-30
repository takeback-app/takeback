import React, { useState } from 'react'
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Flex,
  Box,
  Text,
  Tooltip,
  ButtonGroup,
  useDisclosure,
  SimpleGrid
} from '@chakra-ui/react'
import { IoFilterSharp, IoAttachOutline } from 'react-icons/io5'
import useSWR from 'swr'
import Loader from 'react-spinners/PulseLoader'
import { RiFileExcel2Line } from 'react-icons/ri'
import { Paginated } from '../../types'
import { FilterDrawer } from './components/client/FilterDrawer'
import { useClientReport } from './components/client/state'
import { API } from '../../services/API'
import Layout from '../../components/ui/Layout'
import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import { maskCPF, maskPhone } from '../../utils/masks'
import { currencyFormat } from '../../utils/currencytFormat'

export interface ClientData {
  id: string
  fullName: string
  cpf: string
  phone: string
  city: string
  state: string
  totalAmount: number
  cashbackApproved: number
  blockedBalance: number
  balance: number
  lastTransactionDate: string
  createdAt: string
}

export interface TotalizerData {
  consumerCount: number
  totalShoppingValue: number
  totalApprovedCashback: number
  pendingAmount: number
  balanceAmount: number
  registeredConsumers: number
}

export function ClientReport() {
  const [page, setPage] = useState(1)
  const {
    dateStart,
    dateEnd,
    order,
    orderBy,
    stateId,
    cityId,
    haveTransactions
  } = useClientReport()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    order,
    orderByColumn: orderBy,
    stateId,
    cityId,
    haveTransactions
  }

  const { data: customers, isLoading } = useSWR<Paginated<ClientData>>([
    'manager/report/clients',
    filter
  ])

  const { data: totalizer } = useSWR<TotalizerData>([
    'manager/report/clients/totalizer',
    filter
  ])

  async function exportExcel() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Clientes.xlsx'
    const { data } = await API.get(`manager/report/clients/excel`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  async function exportPdf() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Clientes.pdf'
    const { data } = await API.get(`manager/report/clients/pdf`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/pdf' })
    )
    link.click()
  }

  return (
    <Layout title="Clientes">
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
            <Tooltip label="Exportar PDF">
              <IconButton
                mb={4}
                size="lg"
                formTarget="_blank"
                aria-label="show"
                colorScheme="red"
                icon={<IoAttachOutline />}
                onClick={exportPdf}
              />
            </Tooltip>
            <Tooltip label="Exportar XLSX">
              <IconButton
                mb={4}
                size="lg"
                formTarget="_blank"
                aria-label="show"
                colorScheme="green"
                icon={<RiFileExcel2Line />}
                onClick={exportExcel}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
        <AppTable
          dataLength={customers?.data.length}
          noDataMessage="Nenhum cliente"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={customers?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Telefone</Th>
              <Th>CPF</Th>
              <Th>Cidade</Th>
              <Th>Estado</Th>
              <Th>T. Compras</Th>
              <Th>
                T. Cashback <br /> Ganho
              </Th>
              <Th>
                Saldo <br /> pendente
              </Th>
              <Th>Saldo atual</Th>
              <Th>
                Ultima <br /> Transação
              </Th>
              <Th>
                Data de <br /> Cadastro
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.data.map((customer: ClientData) => (
              <Tr color="gray.500" key={customer?.id}>
                <Td fontSize="xs">{customer?.fullName}</Td>
                <Td fontSize="xs">
                  {customer?.phone && customer?.phone !== ' '
                    ? maskPhone(customer?.phone)
                    : 'Sem telefone'}
                </Td>
                <Td fontSize="xs">
                  {customer?.cpf ? maskCPF(customer?.cpf) : 'Sem cpf'}
                </Td>
                <Td fontSize="xs">{customer?.city ?? 'Sem cidade'}</Td>
                <Td fontSize="xs">{customer?.state ?? 'Sem estado'}</Td>
                <Td fontSize="xs">{currencyFormat(customer?.totalAmount)}</Td>
                <Td fontSize="xs">
                  {currencyFormat(customer?.cashbackApproved)}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(customer?.blockedBalance)}
                </Td>
                <Td fontSize="xs">{currencyFormat(customer?.balance)}</Td>
                <Td fontSize="xs">
                  {customer?.lastTransactionDate
                    ? new Date(
                        customer?.lastTransactionDate
                      ).toLocaleDateString()
                    : 'Sem transação'}
                </Td>
                <Td fontSize="xs">
                  {new Date(customer?.createdAt).toLocaleDateString()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
        {customers?.data.length ? (
          <SimpleGrid columns={[2, 3, 6]} spacing="4" mt="6">
            <Box>
              <Text fontWeight="bold">Total de clientes:</Text>
              <Text>{totalizer?.consumerCount}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Valor total de compras:</Text>
              <Text>
                {totalizer?.totalShoppingValue
                  ? currencyFormat(totalizer?.totalShoppingValue)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de cashback aprovado:</Text>
              <Text>
                {totalizer?.totalApprovedCashback
                  ? currencyFormat(totalizer?.totalApprovedCashback)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de saldos pendentes:</Text>
              <Text>
                {totalizer?.pendingAmount
                  ? currencyFormat(totalizer?.pendingAmount)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de saldos atuais:</Text>
              <Text>
                {totalizer?.balanceAmount
                  ? currencyFormat(totalizer?.balanceAmount)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total Clientes Cadastrados:</Text>
              <Text>{totalizer?.registeredConsumers}</Text>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
