import React, { useMemo, useState } from 'react'
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
import { Layout } from '../../../components/ui/layout'
import { AppTable } from '../../../components/table'
import { IoFilterSharp, IoAttachOutline } from 'react-icons/io5'
import useSWR from 'swr'
import { maskPhone } from '../../../utils/masks'
import Loader from 'react-spinners/PulseLoader'
import { RiFileExcel2Line } from 'react-icons/ri'
import { Pagination } from '../../../components/table/Pagination'
import { Paginated } from '../../../types'
import { FilterDrawer } from './components/client/FilterDrawer'
import { useClientReport } from './components/client/state'
import { API } from '../../../services/API'
import { currencyFormat } from '../../../utils/currencyFormat'
import { BlockModal } from '../../../components/modals/BlockModal'

export interface ClientData {
  id: string
  fullName: string
  phone: string
  city: string
  state: string
  totalAmount: number
  cashbackApproved: number
  transactionCount: number
  lastTransactionDate: string
}

export interface TotalizerData {
  consumerCount: number
  totalShoppingValue: number
  totalApprovedCashback: number
  totalVisits: number
}

export function ClientReport() {
  const [page, setPage] = useState(1)
  const { firstDate, secondDate, order, orderBy } = useClientReport()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filter = useMemo(
    () => ({
      page,
      dateStart: new Date(firstDate).toISOString(),
      dateEnd: new Date(secondDate).toISOString(),
      order,
      orderByColumn: orderBy
    }),
    [firstDate, secondDate, order, orderBy, page]
  )

  const { data: customers, isLoading } = useSWR<Paginated<ClientData>>([
    'company/report/clients',
    filter
  ])

  const { data: totalizer } = useSWR<TotalizerData>([
    'company/report/clients/totalizer',
    filter
  ])

  if (!customers || isLoading) {
    return (
      <Layout title="Clientes">
        <Flex w="full" h="70vh" align="center" justify="center">
          <Loader color="rgba(54, 162, 235, 1)" />
        </Flex>
      </Layout>
    )
  }

  async function exportExcel() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Clientes.xlsx'
    const { data } = await API.get(`company/report/clients/excel`, {
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
    const { data } = await API.get(`company/report/clients/pdf`, {
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
      <Box p={4} overflow="hidden">
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
          dataLength={customers.data.length}
          noDataMessage="Nenhum cliente"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={customers.meta.lastPage}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Telefone</Th>
              <Th>Cidade</Th>
              <Th>Estado</Th>
              <Th>T. Compras</Th>
              <Th>T. Cashback Ganho</Th>
              <Th>Qtd. de Visitas</Th>
              <Th>Ult. Transação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.data.map((customer: ClientData) => (
              <Tr color="gray.500" key={customer?.id}>
                <Td fontSize="xs">{customer?.fullName}</Td>
                <Td fontSize="xs">
                  {customer?.phone && customer?.phone !== ' '
                    ? maskPhone(customer?.phone)
                    : 'Sem telefone'}
                </Td>
                <Td fontSize="xs">{customer?.city ?? 'Sem cidade'}</Td>
                <Td fontSize="xs">{customer?.state ?? 'Sem estado'}</Td>
                <Td fontSize="xs">
                  {customer?.totalAmount
                    ? currencyFormat(customer?.totalAmount)
                    : 'Sem compras'}
                </Td>
                <Td fontSize="xs">
                  {customer?.cashbackApproved
                    ? currencyFormat(customer?.cashbackApproved)
                    : 'Sem cashback'}
                </Td>
                <Td fontSize="xs">{customer?.transactionCount}</Td>
                <Td fontSize="xs">
                  {customer?.lastTransactionDate
                    ? new Date(
                        customer?.lastTransactionDate
                      ).toLocaleDateString()
                    : 'Sem transação'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
        {customers.data.length ? (
          <SimpleGrid columns={[2, 2, 4]} spacing="4" mt="6">
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
              <Text fontWeight="bold">Total de visitas:</Text>
              <Text>{totalizer?.totalVisits}</Text>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
      <BlockModal
        isOpen={true}
        hasBlur
        title="Você não tem acesso a esse  relatório ainda"
        subtitle="Entre em contato com o administrador da sua empresa para solicitar acesso a esse relatório."
      />
    </Layout>
  )
}
