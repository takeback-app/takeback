import React, { useState } from 'react'
import {
  Box,
  ButtonGroup,
  Flex,
  IconButton,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
  useDisclosure,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import useSWR from 'swr'
import { IoAttachOutline, IoFilterSharp } from 'react-icons/io5'
import { RiFileExcel2Line } from 'react-icons/ri'
import Loader from 'react-spinners/PulseLoader'
import { Paginated } from '../../types/index'
import { FilterDrawer } from './components/seller/FilterDrawerx'
import { maskCPF } from '../../utils/masks'
import { API } from '../../services/API'
import Layout from '../../components/ui/Layout'
import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import { currencyFormat } from '../../utils/currencytFormat'
import { useSellerReport } from './components/seller/state'

export interface SellersData {
  id: string
  sellerName: string
  cpf: string
  description: string
  totalAmount: number
  newClients: number
  companyName: string
}

interface TotalizerData {
  companyCount: number
  totalTransactions: number
  newClients: number
}

export function SellerReport() {
  const [page, setPage] = useState(1)
  const {
    dateStart,
    dateEnd,
    stateId,
    cityId,
    companyId,
    order,
    orderBy,
    officeJob,
    statusTransaction
  } = useSellerReport()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    cityId,
    companyId,
    stateId,
    office: officeJob,
    transactionStatus: statusTransaction,
    order,
    orderByColumn: orderBy
  }

  const { data: sellers, isLoading } = useSWR<Paginated<SellersData>>([
    'manager/report/seller',
    filter
  ])

  const { data: totalizer } = useSWR<TotalizerData>([
    'manager/report/seller/totalizer',
    filter
  ])

  async function exportExcel() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Vendedores.xlsx'
    const { data } = await API.get(`manager/report/seller/excel`, {
      params: filter,
      responseType: 'blob'
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  async function exportPdf() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Vendedores.pdf'
    const { data } = await API.get(`manager/report/seller/pdf`, {
      params: filter,
      responseType: 'blob'
    })

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/pdf' })
    )
    link.click()
  }

  return (
    <Layout title="Vendedores">
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
                onClick={() => exportPdf()}
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
                onClick={() => exportExcel()}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
        <AppTable
          dataLength={sellers?.data.length}
          noDataMessage="Nenhum vendedor"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={sellers?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Cargo</Th>
              <Th>CPF</Th>
              <Th>Empresa</Th>
              <Th>T. em Vendas</Th>
              <Th>Clientes Indicados</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sellers?.data?.map(companyUser => (
              <Tr color="gray.500" key={companyUser.id}>
                <Td fontSize="xs">{companyUser.sellerName}</Td>
                <Td fontSize="xs">{companyUser.description}</Td>
                <Td fontSize="xs">
                  {companyUser.cpf ? maskCPF(companyUser.cpf) : '-'}
                </Td>
                <Td fontSize="xs">{companyUser.companyName}</Td>
                <Td fontSize="xs">{currencyFormat(companyUser.totalAmount)}</Td>
                <Td fontSize="xs">{companyUser.newClients}</Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
        {sellers?.data.length && totalizer ? (
          <SimpleGrid columns={[2, 2, 4]} spacing="4" mt="6">
            <Box>
              <Text fontWeight="bold">Total de vendedores:</Text>
              <Text>{totalizer.companyCount}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de vendas:</Text>
              <Text>{currencyFormat(totalizer.totalTransactions)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de novos clientes:</Text>
              <Text>{totalizer.newClients}</Text>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
