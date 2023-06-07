import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction
} from 'react'
import { useNavigate } from 'react-router'
import { IoArrowDown, IoArrowUp, IoFilter } from 'react-icons/io5'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import { API } from '../../../services/API'
import { currencyFormat } from '../../../utils/currencytFormat'

import PrimaryInput from '../../../components/inputs/PrimaryInput'
import { notifyError } from '../../../components/ui/Toastify'
import Layout from '../../../components/ui/Layout'
import PageLoader from '../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'

import PALLET from '../../../styles/ColorPallet'

import * as S from './styles'
import DownloadButton from '../../../components/buttons/DownloadButton'
import { MdFileDownload, MdPictureAsPdf } from 'react-icons/md'
import FilterModal from '../../../components/modals/FilterModal'

import { AppTable } from '../../../components/tables'

import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Flex
} from '@chakra-ui/react'

import { Select, MultiValue, SingleValue } from 'chakra-react-select'

import { Pagination } from '../../../components/tables/Pagination'
import { Paginated } from '../../../types'
import useSWR from 'swr'

export interface FinancialData {
  companyId: string
  monthlyPaymentBilling: number
  feeBilling: number
  newClientsTotalValue: number
  purchasesTotalValue: number
  companyName: string
  totalInPeriod: number
}

interface Option {
  label: string | number
  value: string | number
}

interface FilterProps {
  page: number
  dateStart?: string
  dateEnd?: string
  transactionStatus?: number
  monthlyPaymentStatus?: number
  citiesIds?: Array<number>
  statesIds?: Array<number>
  sort?: string
}

interface SortProps {
  [key: string]: string | null
  feeBilling: string | null
  newClientsTotalValue: string | null
  purchasesTotalValue: string | null
}

interface TotalizerData {
  totalSelers: number
  totalSales: number
  totalNewClients: number
}

const columns = [
  {
    label: 'Faturamento Taxas',
    name: 'feeBilling'
  },
  {
    label: 'Faturamento Mensalidades',
    name: 'monthlyPaymentBilling'
  },
  {
    label: 'Total Gratificação por Compra',
    name: 'purchasesTotalValue'
  },
  {
    label: 'Total Gratificação por Novo Usuário',
    name: 'newClientsTotalValue'
  },
  {
    label: 'Saldo Período',
    name: 'totalInPeriod'
  },
  {
    label: 'Nome da Empresa',
    name: 'companyName'
  }
]

const FinancialReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [states, setStates] = useState([] as Array<Option>)
  const [cities, setCities] = useState([] as Array<Option>)
  const [monthlyPaymentStatus, setMonthlyPaymentStatus] = useState(
    [] as Array<Option>
  )
  const [transactionStatus, setTransactionStatus] = useState(
    [] as Array<Option>
  )

  const [selectedStates, setSelectedStates] = useState([] as Array<Option>)
  const [selectedCities, setSelectedCities] = useState([] as Array<Option>)
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState(
    {} as Option
  )
  const [selectedMonthlyPaymentStatus, setSelectedMonthlyPaymentStatus] =
    useState({} as Option)

  const [allCities, setAllCities] = useState(
    [] as Array<Option & { stateId: number }>
  )

  const [sortData, setSortData] = useState<SortProps>({
    feeBilling: null,
    newClientsTotalValue: null,
    purchasesTotalValue: null
  })

  const [filter, setFilter] = useState({} as FilterProps)

  const { data: totals } = useSWR<TotalizerData>([
    'manager/report/financial/totalizer',
    filter
  ])

  const { data: financial } = useSWR<Paginated<FinancialData>>([
    'manager/report/financial',
    filter
  ])

  const findFilterData = () => {
    API.get('/manager/data/find')
      .then(({ data }) => {
        const statesOfCities: Array<Option> = []
        const cities = data.cities.map((item: any) => {
          const foundState = statesOfCities.find(
            state => (state.value = item.state.id)
          )

          !foundState &&
            statesOfCities.push({
              label: item.state.name,
              value: item.state.id
            })

          return {
            label: item.name,
            value: item.id,
            stateId: item.state.id
          }
        })

        setTransactionStatus(
          data.cashbackStatus.map((item: any) => ({
            label: item.description,
            value: item.id
          }))
        )

        setMonthlyPaymentStatus(
          data.status.map((item: any) => ({
            label: item.description,
            value: item.id
          }))
        )
        setStates(statesOfCities)
        setAllCities(cities)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
  }

  const handleSort = (columnName: string) => {
    if (!(sortData[columnName] === undefined)) {
      sortData[columnName] =
        sortData[columnName] === 'asc'
          ? 'desc'
          : sortData[columnName] === null
          ? 'asc'
          : null

      setSortData({ ...sortData })

      formRef.current?.submitForm()
    }
  }

  const limpaFiltro = () => {
    formRef.current?.reset()
    setSelectedCities([])
    setSelectedStates([])
    setSelectedMonthlyPaymentStatus({} as Option)
    setSelectedTransactionStatus({} as Option)

    setFilter({} as FilterProps)
  }

  const handleSelects = (
    values: MultiValue<Option>,
    stateName: Dispatch<SetStateAction<Option[]>>,
    callback: (() => void) | undefined = undefined
  ) => {
    stateName(values as Option[])

    callback && callback()
  }

  const handleSingleSelect = (
    value: SingleValue<Option>,
    stateName: Dispatch<SetStateAction<Option>>,
    callback: (() => void) | undefined = undefined
  ) => {
    stateName(value as Option)

    callback && callback()
  }

  const handleFilters = (data: FilterProps) => {
    const dates = {} as FilterProps

    if (data.dateStart) {
      dates.dateStart = new Date(data.dateStart).toISOString()
    }
    if (data.dateEnd) {
      dates.dateEnd = new Date(data.dateEnd).toISOString()
    }

    setFilter({
      ...dates,
      page,
      transactionStatus: Number(selectedTransactionStatus),
      monthlyPaymentStatus: Number(selectedMonthlyPaymentStatus.value),
      citiesIds: selectedCities.map(item => Number(item.value)),
      statesIds: selectedStates.map(item => Number(item.value)),
      sort: JSON.stringify(sortData)
    })
  }

  const exportPdf = async () => {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório Financeiro.pdf'
    const { data } = await API.get(`manager/report/financial/pdf`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/pdf' })
    )
    link.click()
  }

  const exportExcel = async () => {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório Financeiro.xlsx'
    const { data } = await API.get(`manager/report/financial/excel`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  useEffect(() => {
    findFilterData()
  }, [])

  useEffect(() => {
    const states = selectedStates.map(item => item.value)
    const cities = allCities.filter(item => {
      return states.includes(item.stateId)
    })

    setCities(cities)
  }, [selectedStates, allCities])

  return (
    <Layout goBack={() => navigateTo(-1)} goBackTitle="Relatório financeiro">
      {pageLoading ? (
        <PageLoader label="Carregando relatório..." />
      ) : (
        <>
          <S.Container>
            <S.SubHeader>
              <Flex width="100%" align="center" justify="space-between">
                <QuartenaryButton
                  onClick={() => setFilterVisible(true)}
                  label="Filtrar"
                  color={PALLET.COLOR_06}
                  icon={IoFilter}
                  noFullWidth
                />
                <S.DownloadContainer>
                  <DownloadButton
                    icon={MdPictureAsPdf}
                    title="Baixar em PDF"
                    color="#AA0A00"
                    onClick={exportPdf}
                  />
                  <DownloadButton
                    icon={MdFileDownload}
                    title="Baixar em Excel"
                    color="#006E3D"
                    onClick={exportExcel}
                  />
                </S.DownloadContainer>
              </Flex>
            </S.SubHeader>

            <AppTable
              dataLength={financial?.data.length ?? 0}
              noDataMessage="Nenhum vendedor encontrado"
              pagination={
                <Pagination
                  page={page}
                  setPage={setPage}
                  lastPage={financial?.meta.lastPage ?? 0}
                />
              }
            >
              <Thead>
                <Tr>
                  {columns.map(column => (
                    <Th key={column.name}>
                      <S.ColumnWrapper>
                        <S.Column>
                          <button
                            type="button"
                            onClick={() => handleSort(column.name)}
                          >
                            {column.label}
                          </button>
                        </S.Column>
                        <S.Sort>
                          {sortData[column.name] === 'asc' && <IoArrowUp />}
                          {sortData[column.name] === 'desc' && <IoArrowDown />}
                        </S.Sort>
                      </S.ColumnWrapper>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {financial?.data.map(item => (
                  <Tr key={item.companyId}>
                    <Td>{currencyFormat(item.feeBilling)}</Td>
                    <Td>{currencyFormat(item.monthlyPaymentBilling)}</Td>
                    <Td>{currencyFormat(item.purchasesTotalValue)}</Td>
                    <Td>{currencyFormat(item.newClientsTotalValue)}</Td>
                    <Td>{currencyFormat(item.totalInPeriod)}</Td>
                    <Td>{item.companyName}</Td>
                  </Tr>
                ))}
              </Tbody>
            </AppTable>
            {!!financial?.data.length && (
              <>
                <Card mt="1rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Quantidade de vendedores listados</StatLabel>
                      <StatNumber>{totals?.totalSelers}</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                <Card mt="1rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Vendido</StatLabel>
                      <StatNumber>
                        {currencyFormat(totals?.totalSales)}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                <Card mt="1rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Total de novos clientes</StatLabel>
                      <StatNumber>{totals?.totalNewClients}</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </>
            )}
          </S.Container>
        </>
      )}

      <FilterModal
        title="Filtros"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <Form ref={formRef} onSubmit={handleFilters}>
          <S.DividerWrapper />
          <S.ModalContent>
            <S.InputsWrapper>
              <S.InputTitle>Período</S.InputTitle>
              <S.InputDateWrapper>
                <PrimaryInput type="date" name="dateStart" label="Início" />
                <PrimaryInput type="date" name="dateEnd" label="Fim" />
              </S.InputDateWrapper>
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Status da Mensalidade</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="companyStatus"
                placeholder="Selecione um status para a mensalidade..."
                options={monthlyPaymentStatus}
                onChange={e =>
                  handleSingleSelect(e, setSelectedMonthlyPaymentStatus)
                }
                value={selectedMonthlyPaymentStatus}
                size="sm"
                variant="flushed"
              />
            </S.SelectWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Status da Transação</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="transactionStatus"
                placeholder="Selecione um status para a transação..."
                options={transactionStatus}
                onChange={e =>
                  handleSingleSelect(e, setSelectedTransactionStatus)
                }
                value={selectedTransactionStatus}
                size="sm"
                variant="flushed"
              />
            </S.SelectWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Estados</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="states"
                options={states}
                onChange={e => handleSelects(e, setSelectedStates)}
                value={selectedStates}
                isMulti
                size="sm"
                variant="flushed"
              />
            </S.SelectWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Cidades</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="cities"
                options={cities}
                onChange={e => handleSelects(e, setSelectedCities)}
                value={selectedCities}
                isMulti
                size="sm"
                variant="flushed"
                isDisabled={!selectedStates.length}
              />
            </S.SelectWrapper>
            <S.DividerWrapper />

            <S.FooterModal>
              <QuartenaryButton
                type="button"
                label="Limpar filtros"
                color={PALLET.COLOR_17}
                onClick={() => limpaFiltro()}
              />
              <QuartenaryButton
                type="submit"
                label="Gerar relatório"
                color={PALLET.COLOR_02}
              />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </FilterModal>
    </Layout>
  )
}

export default FinancialReport
