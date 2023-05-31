import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  Dispatch,
  SetStateAction
} from 'react'
import { useNavigate } from 'react-router'
import { IoArrowDown, IoArrowUp, IoFilter } from 'react-icons/io5'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import { API } from '../../../services/API'
import { CCompany } from '../../../contexts/CCompany'
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
import { maskCNPJ } from '../../../utils/masks'
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

import { Select, MultiValue } from 'chakra-react-select'

import { Pagination } from '../../../components/tables/Pagination'
import { Paginated } from '../../../types'
import useSWR from 'swr'

export interface CompaniesData {
  id: string
  fantasyName: string
  corporateName: string
  registeredNumber: string
  email: string
  phone: string
  zipCode: string
  state_name: string
  city_name: string
  district: string
  street: string
  number: string
  createdAt: string
  firstAccessAllowedAt: string
  industries_description: string
  company_status_description: string
  customIndustryFeeActive: boolean
  customIndustryFee: string
  industries_industryFee: string
  payment_plans_description: string
  payment_plans_value: string
  positiveBalance: string
  quantityOfPaidTransactions: string
  valueofpaidtransactions: string
  valueOfCashbacks: string
  valueOfTotalAmount: string
}

interface Option {
  label: string | number
  value: string | number
}

interface FilterProps {
  page: number
  dataActivateStart?: string
  dataActivateEnd?: string
  dataCreatedStart?: string
  dataCreatedEnd?: string
  company?: string
  statusIds?: Array<string | number>
  industryIds?: Array<string | number>
  cashbacksStatusIds?: Array<string | number>
  citiesIds?: Array<string | number>
  statesIds?: Array<string | number>
  sort?: string
}

interface SortProps {
  [key: string]: string | null
  fantasyName: string | null
  positiveBalance: string | null
  quantityOfPaidTransactions: string | null
  valueOfPaidTransactions: string | null
  valueOfTotalAmount: string | null
}

interface TotalizerData {
  totalBilling: number
  totalCashbacksValues: number
  totalCompanies: number
  totalInBalance: number
}

const columns = [
  {
    label: 'NOME',
    name: 'fantasyName'
  },
  {
    label: 'RAZÃO SOCIAL',
    name: 'corporateName'
  },
  {
    label: 'CNPJ',
    name: 'registeredNumber'
  },
  {
    label: 'EMAIL',
    name: 'email'
  },
  {
    label: 'TELEFONE',
    name: 'phone'
  },
  {
    label: 'CEP',
    name: 'zipCode'
  },
  {
    label: 'ESTADO',
    name: 'state_name'
  },
  {
    label: 'CIDADE',
    name: 'city_name'
  },
  {
    label: 'BAIRRO',
    name: 'district'
  },
  {
    label: 'RUA',
    name: 'street'
  },
  {
    label: 'NÚMERO',
    name: 'number'
  },
  {
    label: 'DATA DE CADASTRO',
    name: 'createdAt'
  },
  {
    label: 'PRIMEIRO ACESSO',
    name: 'firstAccessAllowedAt'
  },
  {
    label: 'RAMO DE ATIVIDADE',
    name: 'industries_description'
  },
  {
    label: 'STATUS',
    name: 'company_status_description'
  },
  {
    label: 'TAXA PERSONALIZADA',
    name: 'customIndustryFeeActive'
  },
  {
    label: 'VALOR DA TAXA',
    name: ''
  },
  {
    label: 'PLANO DE MENSALIDADE',
    name: 'payment_plans_description'
  },
  {
    label: 'VALOR DA MENSALIDADE',
    name: 'payment_plans_value'
  },
  {
    label: 'SALDO DA EMPRESA',
    name: 'positiveBalance'
  },
  {
    label: 'QUANTIDADE DE TAXAS PAGAS',
    name: 'quantityOfPaidTransactions'
  },
  {
    label: 'VALOR TOTAL DE TAXAS PAGAS',
    name: 'valueOfPaidTransactions'
  },
  {
    label: 'VALOR DE CASHBACKS AOS CLIENTES',
    name: 'valueOfCashbacks'
  },
  {
    label: 'VALOR TOTAL EM FATURAMENTO',
    name: 'valueOfTotalAmount'
  }
]

const CompaniesReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [states, setStates] = useState([] as Array<Option>)
  const [cities, setCities] = useState([] as Array<Option>)
  const [cashbacksStatus, setCashbacksStatus] = useState([] as Array<Option>)

  const [statusSelected, setStatusSelected] = useState([] as Array<Option>)
  const [selectedStates, setSelectedStates] = useState([] as Array<Option>)
  const [selectedCities, setSelectedCities] = useState([] as Array<Option>)
  const [industriesSelected, setIndustriesSelected] = useState(
    [] as Array<Option>
  )
  const [selectedCashbacksStatus, setSelectedCashbacksStatus] = useState(
    [] as Array<Option>
  )

  const [allCities, setAllCities] = useState(
    [] as Array<Option & { stateId: number }>
  )

  const [sortData, setSortData] = useState<SortProps>({
    fantasyName: null,
    positiveBalance: null,
    quantityOfPaidTransactions: null,
    valueOfPaidTransactions: null,
    valueOfTotalAmount: null
  })

  const { companyStatus, setCompanyStatus, industry, setIndustry } =
    useContext(CCompany)

  const [filePathPDF, setFilePathPDF] = useState('')
  const [filePathExcel, setFilePathExcel] = useState('')

  const [filter, setFilter] = useState({} as FilterProps)

  const { data: totals } = useSWR<TotalizerData>([
    'manager/report/companies/totalizer',
    filter
  ])

  const { data: companies } = useSWR<Paginated<CompaniesData>>([
    'manager/report/companies',
    filter
  ])

  const findCompanyStatus = () => {
    API.get('/manager/data/find')
      .then(response => {
        setCompanyStatus(response.data.status)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
  }

  const findCompanyData = () => {
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

        setCashbacksStatus(
          data.cashbackStatus.map((item: any) => {
            return {
              label: item.description,
              value: item.id
            }
          })
        )

        setIndustry(data.industries)
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
    setIndustriesSelected([])
    setStatusSelected([])
    setSelectedCities([])
    setSelectedStates([])
    setSelectedCashbacksStatus([])
    setStatusSelected([])
    setIndustriesSelected([])

    setFilter({} as FilterProps)
  }

  const timerToClearLinks = () => {
    const time = 60000
    setTimeout(() => {
      setFilePathExcel('')
      setFilePathPDF('')
    }, time * 10)
  }

  const handleSelects = (
    values: MultiValue<Option>,
    stateName: Dispatch<SetStateAction<Option[]>>,
    callback: (() => void) | undefined = undefined
  ) => {
    stateName(values as Option[])

    callback && callback()
  }

  const handleFilters = (data: FilterProps) => {
    const dates = {} as FilterProps

    if (data.dataActivateStart?.length) {
      dates.dataActivateStart = new Date(data.dataActivateStart).toISOString()
    }

    if (data.dataActivateEnd?.length) {
      dates.dataActivateEnd = new Date(data.dataActivateEnd).toISOString()
    }

    if (data.dataCreatedStart?.length) {
      dates.dataCreatedStart = new Date(data.dataCreatedStart).toISOString()
    }

    if (data.dataCreatedEnd?.length) {
      dates.dataCreatedEnd = new Date(data.dataCreatedEnd).toISOString()
    }

    setFilter({
      ...dates,
      page,
      company: data?.company,
      citiesIds: selectedCities.map(item => item.value),
      statesIds: selectedStates.map(item => item.value),
      statusIds: statusSelected.map(item => item.value),
      industryIds: industriesSelected.map(item => item.value),
      cashbacksStatusIds: selectedCashbacksStatus.map(item => item.value),
      sort: JSON.stringify(sortData)
    })
  }

  const exportPdf = async () => {
    const link = document.createElement('a')
    link.target = '_blank'
    link.download = 'Relatório de Empresas.pdf'
    const { data } = await API.get(`manager/report/companies/pdf`, {
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
    link.download = 'Relatório de Empresas.xlsx'
    const { data } = await API.get(`manager/report/companies/excel`, {
      responseType: 'blob',
      params: filter
    })

    link.href = URL.createObjectURL(new Blob([data], { type: 'text/xlsx' }))
    link.click()
  }

  useEffect(() => {
    timerToClearLinks()
    findCompanyData()
    if (companyStatus.length === 0) {
      findCompanyStatus()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const states = selectedStates.map(item => item.value)
    const cities = allCities.filter(item => {
      return states.includes(item.stateId)
    })

    setCities(cities)
  }, [selectedStates, allCities])

  return (
    <Layout goBack={() => navigateTo(-1)} goBackTitle="Relatório de empresas">
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
                    href={filePathPDF}
                    icon={MdPictureAsPdf}
                    title="Baixar em PDF"
                    color="#AA0A00"
                    onClick={exportPdf}
                  />
                  <DownloadButton
                    href={filePathExcel}
                    icon={MdFileDownload}
                    title="Baixar em Excel"
                    color="#006E3D"
                    onClick={exportExcel}
                  />
                </S.DownloadContainer>
              </Flex>
            </S.SubHeader>

            <AppTable
              dataLength={companies?.data.length ?? 0}
              noDataMessage="Nenhuma empresa encontrada"
              pagination={
                <Pagination
                  page={page}
                  setPage={setPage}
                  lastPage={companies?.meta.lastPage ?? 0}
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
                {companies?.data.map(item => (
                  <Tr key={item.id}>
                    <Td>{item.fantasyName}</Td>
                    <Td>{item.corporateName}</Td>
                    <Td>{maskCNPJ(item.registeredNumber)}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.phone ? item.phone : 'Não possui'}</Td>
                    <Td>{item.zipCode ? item.zipCode : 'Não possui'}</Td>
                    <Td>{item.state_name ? item.state_name : 'Não possui'}</Td>
                    <Td>{item.city_name ? item.city_name : 'Não possui'}</Td>
                    <Td>{item.district ? item.district : 'Não possui'}</Td>
                    <Td>{item.street ? item.street : 'Não possui'}</Td>
                    <Td>{item.number ? item.number : 'Não possui'}</Td>
                    <Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      {item.firstAccessAllowedAt
                        ? new Date(
                            item.firstAccessAllowedAt
                          ).toLocaleDateString()
                        : 'Não aprovado'}
                    </Td>
                    <Td>{item.industries_description}</Td>
                    <Td>{item.company_status_description}</Td>
                    <Td>
                      {item.customIndustryFeeActive === true
                        ? 'Ativa'
                        : 'Inativa'}
                    </Td>
                    <Td>
                      {item.customIndustryFeeActive === true
                        ? currencyFormat(parseFloat(item.customIndustryFee))
                        : currencyFormat(
                            parseFloat(item.industries_industryFee)
                          )}
                    </Td>
                    <Td>{item.payment_plans_description}</Td>
                    <Td>
                      {currencyFormat(parseFloat(item.payment_plans_value))}
                    </Td>
                    <Td>{currencyFormat(parseFloat(item.positiveBalance))}</Td>
                    <Td>{item.quantityOfPaidTransactions}</Td>
                    <Td>
                      {currencyFormat(parseFloat(item.valueofpaidtransactions))}
                    </Td>
                    <Td>{currencyFormat(parseFloat(item.valueOfCashbacks))}</Td>
                    <Td>
                      {currencyFormat(parseFloat(item.valueOfTotalAmount))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </AppTable>
            {!!companies?.data.length && (
              <>
                <Card mt="1rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Quantidade de companias listadas</StatLabel>
                      <StatNumber>{totals?.totalCompanies}</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                <Card mt="1rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Faturado</StatLabel>
                      <StatNumber>
                        {currencyFormat(totals?.totalBilling)}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                <Card mt="1rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Valor total dos cashbacks listados</StatLabel>
                      <StatNumber>
                        {currencyFormat(totals?.totalCashbacksValues)}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                <Card mt="1rem" mb="0.5rem">
                  <CardBody>
                    <Stat>
                      <StatLabel>Valor total em saldos</StatLabel>
                      <StatNumber>
                        {currencyFormat(totals?.totalInBalance)}
                      </StatNumber>
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
              <S.InputTitle>Empresa</S.InputTitle>
              <PrimaryInput name="company" label="Nome da empresa ou CNPJ" />
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.InputsWrapper>
              <S.InputTitle>Cadastro</S.InputTitle>
              <S.InputDateWrapper>
                <PrimaryInput
                  type="date"
                  name="dataCreatedStart"
                  label="Início"
                />
                <PrimaryInput type="date" name="dataCreatedEnd" label="Fim" />
              </S.InputDateWrapper>
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.InputsWrapper>
              <S.InputTitle>Ativação</S.InputTitle>
              <S.InputDateWrapper>
                <PrimaryInput
                  type="date"
                  name="dataActivateStart"
                  label="Início"
                />
                <PrimaryInput type="date" name="dataActivateEnd" label="Fim" />
              </S.InputDateWrapper>
            </S.InputsWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Status</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="companyStatus"
                options={companyStatus.map(item => ({
                  label: item.description,
                  value: item.id
                }))}
                onChange={e => handleSelects(e, setStatusSelected)}
                value={statusSelected}
                isMulti
                size="sm"
                variant="flushed"
              />
            </S.SelectWrapper>
            <S.DividerWrapper />
            <S.TitleWrapper>
              <S.InputTitle>Status do Cashback</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="companyStatus"
                options={cashbacksStatus}
                onChange={e => handleSelects(e, setSelectedCashbacksStatus)}
                value={selectedCashbacksStatus}
                isMulti
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

            <S.TitleWrapper>
              <S.InputTitle>Ramo de atividade</S.InputTitle>
            </S.TitleWrapper>
            <S.SelectWrapper>
              <Select
                name="industries"
                options={industry.map(item => ({
                  label: item.description,
                  value: item.id
                }))}
                onChange={e => handleSelects(e, setIndustriesSelected)}
                value={industriesSelected}
                isMulti
                size="sm"
                variant="flushed"
              />
            </S.SelectWrapper>
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

export default CompaniesReport
