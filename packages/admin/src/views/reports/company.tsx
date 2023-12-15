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
import { FilterDrawer } from './components/company/FilterDrawer'
import { API } from '../../services/API'
import Layout from '../../components/ui/Layout'
import { AppTable } from '../../components/tables'
import { Pagination } from '../../components/tables/Pagination'
import { maskCNPJ } from '../../utils/masks'
import { currencyFormat } from '../../utils/currencytFormat'
import { useCompanyReport } from './components/company/state'

export interface CompanyData {
  id: string
  companyName: string
  registeredNumber: string
  city: string
  state: string
  status: string
  industry: string
  totalAmount: number
  cashbackAmount: number
  takebackFeeAmount: number
  positiveBalance: number
  lastTransactionDate: string
}

export interface TotalizerData {
  companiesCount: number
  totalAmount: number
  totalCashbackAmount: number
  totalTakebackFeeAmount: number
  totalPositiveBalances: number
}

export function CompanyReport() {
  const [page, setPage] = useState(1)
  const {
    dateStart,
    dateEnd,
    order,
    companyStatusId,
    transactionStatusId,
    orderBy,
    stateId,
    cityId
  } = useCompanyReport()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filter = {
    page,
    dateStart: new Date(dateStart).toISOString(),
    dateEnd: new Date(dateEnd).toISOString(),
    order,
    orderByColumn: orderBy,
    stateId,
    cityId,
    companyStatusId,
    transactionStatusId
  }

  const { data: companies, isLoading } = useSWR<Paginated<CompanyData>>([
    'manager/report/company',
    filter
  ])

  const { data: totalizer } = useSWR<TotalizerData>([
    'manager/report/company/totalizer',
    filter
  ])

  async function exportExcel() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Empresas.xlsx'
    const { data } = await API.get(`manager/report/company/excel`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  async function exportPdf() {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Empresas.pdf'
    const { data } = await API.get(`manager/report/company/pdf`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/pdf' })
    )
    link.click()
  }

  return (
    <Layout title="Empresas">
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
          dataLength={companies?.data.length}
          noDataMessage="Nenhuma empresa"
          mt={4}
          overflowY="scroll"
          maxH="650px"
          pagination={
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={companies?.meta.lastPage || 0}
            />
          }
        >
          <Thead>
            <Tr>
              <Th>Empresa</Th>
              <Th>CNPJ</Th>
              <Th>Cidade</Th>
              <Th>Estado</Th>
              <Th>Status</Th>
              <Th>Ramo de atividade</Th>
              <Th>T. de faturamento</Th>
              <Th>T. de Cashbacks</Th>
              <Th>Taxas</Th>
              <Th>Saldo Atual</Th>
              <Th>
                Ultima <br /> Transação
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {companies?.data.map((company: CompanyData) => (
              <Tr color="gray.500" key={company?.id}>
                <Td fontSize="xs">{company?.companyName}</Td>
                <Td fontSize="xs">
                  {company?.registeredNumber
                    ? maskCNPJ(company?.registeredNumber)
                    : 'Sem CNPJ'}
                </Td>
                <Td fontSize="xs">{company?.city ?? 'Sem cidade'}</Td>
                <Td fontSize="xs">{company?.state ?? 'Sem estado'}</Td>
                <Td fontSize="xs">{company?.status}</Td>
                <Td fontSize="xs">{company?.industry}</Td>
                <Td fontSize="xs">{currencyFormat(company?.totalAmount)}</Td>
                <Td fontSize="xs">{currencyFormat(company?.cashbackAmount)}</Td>
                <Td fontSize="xs">
                  {currencyFormat(company?.takebackFeeAmount)}
                </Td>
                <Td fontSize="xs">
                  {currencyFormat(company?.positiveBalance)}
                </Td>
                <Td fontSize="xs">
                  {company?.lastTransactionDate
                    ? new Date(company.lastTransactionDate).toLocaleDateString()
                    : 'Sem transação'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </AppTable>
        {companies?.data.length ? (
          <SimpleGrid columns={[2, 3, 5]} spacing="4" mt="6">
            <Box>
              <Text fontWeight="bold">Total de empresas:</Text>
              <Text>{totalizer?.companiesCount}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total em faturamento:</Text>
              <Text>
                {totalizer?.totalAmount
                  ? currencyFormat(totalizer?.totalAmount)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de cashbacks:</Text>
              <Text>
                {totalizer?.totalCashbackAmount
                  ? currencyFormat(totalizer?.totalCashbackAmount)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total em Taxas:</Text>
              <Text>
                {totalizer?.totalTakebackFeeAmount
                  ? currencyFormat(totalizer?.totalTakebackFeeAmount)
                  : '-'}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Total de saldos:</Text>
              <Text>
                {totalizer?.totalPositiveBalances
                  ? currencyFormat(totalizer?.totalPositiveBalances)
                  : '-'}
              </Text>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
