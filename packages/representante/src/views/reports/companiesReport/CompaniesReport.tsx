import React, { useEffect, useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router'
import { IoFilter } from 'react-icons/io5'
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
import Checkbox from '../../../components/inputs/Checkbox'
import FilterModal from '../../../components/modals/FilterModal'

interface IReport {
  companies_id: string
  companies_fantasyName: string
  companies_corporateName: string
  companies_registeredNumber: string
  companies_email: string
  companies_phone: string
  address_zipCode: string
  state_name: string
  city_name: string
  address_district: string
  address_street: string
  address_number: string
  companies_createdAt: string
  companies_firstAccessAllowedAt: string
  industries_description: string
  status_description: string
  companies_customIndustryFeeActive: boolean
  companies_customIndustryFee: string
  industries_industryFee: string
  plan_description: string
  plan_value: string
}

interface FilterProps {
  dataActivateStart?: string
  dataActivateEnd?: string
  dataCreatedStart?: string
  dataCreatedEnd?: string
  company?: string
}

const CompaniesReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const navigateTo = useNavigate()
  const formRef = useRef<FormHandles>(null)
  const [pageLoading, setPageLoading] = useState(false)
  // eslint-disable-next-line
  const [filterVisible, setFilterVisible] = useState(false)
  const [companies, setCompanies] = useState([] as Array<IReport>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statusSelected, setStatusSelected] = useState([] as Array<number>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [industriesSelected, setIndustriesSelected] = useState(
    [] as Array<number>
  )

  const { companyStatus, setCompanyStatus, industry, setIndustry } =
    useContext(CCompany)
  const [filePathPDF, setFilePathPDF] = useState('')
  const [filePathExcel, setFilePathExcel] = useState('')

  const findCompaniesReport = () => {
    setPageLoading(true)
    API.get('/manager/report/companies')
      .then(response => {
        setCompanies(response.data.report)
        setFilePathPDF(response.data.filePathPDF)
        setFilePathExcel(response.data.filePathExcel)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

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
      .then(response => {
        setIndustry(response.data.industries)
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
  }

  // FUNÇÃO PARA ADICIONAR OU REMOVER OS MULTIPLOS STATUS AO FILTRO
  const addOrRemoveStatus = async (checked: boolean, id: number) => {
    const find = statusSelected.indexOf(id)
    if (checked) {
      statusSelected.push(id)
    } else if (find > -1) {
      statusSelected.splice(find, 1)
    }
  }

  // FUNÇÃO PARA ADICIONAR OU REMOVER OS MULTIPLOS RAMOS AO FILTRO
  const addOrRemoveIndustries = async (checked: boolean, id: number) => {
    const find = industriesSelected.indexOf(id)
    if (checked) {
      industriesSelected.push(id)
    } else if (find > -1) {
      industriesSelected.splice(find, 1)
    }
  }

  const handleFilters = (data: FilterProps) => {
    const statusIds = statusSelected.length === 0 ? '' : statusSelected
    const industryIds =
      industriesSelected.length === 0 ? '' : industriesSelected
    const company = data.company === '0' ? '' : data.company
    const dataActivateStart =
      data.dataActivateStart === '0' ? '' : data.dataActivateStart
    const dataActivateEnd =
      data.dataActivateEnd === '0' ? '' : data.dataActivateEnd
    const dataCreatedStart =
      data.dataCreatedStart === '0' ? '' : data.dataCreatedStart
    const dataCreatedEnd =
      data.dataCreatedEnd === '0' ? '' : data.dataCreatedEnd

    setFilterVisible(false)
    setPageLoading(true)

    API.get(
      `/manager/report/companies?statusIds=${statusIds}&industryIds=${industryIds}&dataActivateStart=${dataActivateStart}&dataActivateEnd=${dataActivateEnd}&dataCreatedStart=${dataCreatedStart}&dataCreatedEnd=${dataCreatedEnd}&company=${company}`
    )
      .then(response => {
        setCompanies(response.data.report)
        setFilePathPDF(response.data.filePathPDF)
        setFilePathExcel(response.data.filePathExcel)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  const limpaFiltro = () => {
    formRef.current?.reset()
    setIndustriesSelected([])
    setStatusSelected([])
  }

  const timerToClearLinks = () => {
    const time = 60000
    setTimeout(() => {
      setFilePathExcel('')
      setFilePathPDF('')
    }, time * 10)
  }

  useEffect(() => {
    timerToClearLinks()
    findCompaniesReport()
    findCompanyData()
    if (companyStatus.length === 0) {
      findCompanyStatus()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Layout goBack={() => navigateTo(-1)} goBackTitle="Relatório de empresas">
      {pageLoading ? (
        <PageLoader label="Carregando relatório..." />
      ) : (
        <S.Container>
          <S.SubHeader>
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
                disabled={filePathPDF.length === 0}
              />
              <DownloadButton
                href={filePathExcel}
                icon={MdFileDownload}
                title="Baixar em Excel"
                color="#006E3D"
                disabled={filePathExcel.length === 0}
              />
            </S.DownloadContainer>
          </S.SubHeader>

          <S.TableWrapper>
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>Nome Fantasia</S.Th>
                  <S.Th>Razão Social</S.Th>
                  <S.Th>CNPJ</S.Th>
                  <S.Th>Email</S.Th>
                  <S.Th>Telefone</S.Th>
                  <S.Th>CEP</S.Th>
                  <S.Th>Estado</S.Th>
                  <S.Th>Cidade</S.Th>
                  <S.Th>Bairro</S.Th>
                  <S.Th>Rua</S.Th>
                  <S.Th>Número</S.Th>
                  <S.Th>Data de cadastro</S.Th>
                  <S.Th>Primeiro acesso</S.Th>
                  <S.Th>Ramo de atividade</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th>Taxa personalizada</S.Th>
                  <S.Th>Valor da taxa</S.Th>
                  <S.Th>Plano de mensalidade</S.Th>
                  <S.Th>Valor da mensalidade</S.Th>
                </S.Tr>
              </S.THead>

              <S.TBody>
                {companies?.map(item => (
                  <S.Tr key={item.companies_id}>
                    <S.Td>{item.companies_fantasyName}</S.Td>
                    <S.Td>{item.companies_corporateName}</S.Td>
                    <S.Td>{maskCNPJ(item.companies_registeredNumber)}</S.Td>
                    <S.Td>{item.companies_email}</S.Td>
                    <S.Td>
                      {item.companies_phone
                        ? item.companies_phone
                        : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {item.address_zipCode
                        ? item.address_zipCode
                        : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {item.state_name ? item.state_name : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {item.city_name ? item.city_name : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {item.address_district
                        ? item.address_district
                        : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {item.address_street ? item.address_street : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {item.address_number ? item.address_number : 'Não possui'}
                    </S.Td>
                    <S.Td>
                      {new Date(item.companies_createdAt).toLocaleDateString()}
                    </S.Td>
                    <S.Td>
                      {item.companies_firstAccessAllowedAt
                        ? new Date(
                            item.companies_firstAccessAllowedAt
                          ).toLocaleDateString()
                        : 'Não aprovado'}
                    </S.Td>
                    <S.Td>{item.industries_description}</S.Td>
                    <S.Td>{item.status_description}</S.Td>
                    <S.Td>
                      {item.companies_customIndustryFeeActive === true
                        ? 'Ativa'
                        : 'Inativa'}
                    </S.Td>
                    <S.Td>
                      {item.companies_customIndustryFeeActive === true
                        ? currencyFormat(
                            parseFloat(item.companies_customIndustryFee)
                          )
                        : currencyFormat(
                            parseFloat(item.industries_industryFee)
                          )}
                    </S.Td>
                    <S.Td>{item.plan_description}</S.Td>
                    <S.Td>{currencyFormat(parseFloat(item.plan_value))}</S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
          </S.TableWrapper>
        </S.Container>
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
            <S.CheckboxWrapper>
              {companyStatus.map(item => (
                <Checkbox
                  key={item.id}
                  label={item.description}
                  onChange={event => {
                    addOrRemoveStatus(event.target.checked, item.id)
                  }}
                />
              ))}
            </S.CheckboxWrapper>
            <S.DividerWrapper />

            <S.TitleWrapper>
              <S.InputTitle>Ramo de atividade</S.InputTitle>
            </S.TitleWrapper>
            <S.CheckboxWrapper>
              {industry.map(item => (
                <Checkbox
                  key={item.id}
                  label={item.description}
                  onChange={event => {
                    addOrRemoveIndustries(event.target.checked, item.id)
                  }}
                />
              ))}
            </S.CheckboxWrapper>
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
