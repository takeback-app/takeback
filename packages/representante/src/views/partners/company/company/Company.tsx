/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { IoFilter, IoSettingsOutline } from 'react-icons/io5'

import Loader from 'react-spinners/PulseLoader'

import { API } from '../../../../services/API'
import { CCompany } from '../../../../contexts/CCompany'
import { CAppData } from '../../../../contexts/CAppData'
import { maskCNPJ } from '../../../../utils/masks'

import Layout from '../../../../components/ui/Layout'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import SelectInput from '../../../../components/inputs/SelectInput'
import PageLoader from '../../../../components/loaders/primaryLoader'
import FilterModal from '../../../../components/modals/FilterModal'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import Toastify, { notifyError } from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'

interface PropsCompany {
  company_id: string
  company_fantasyName: string
  company_registeredNumber: string
  company_createdAt: string
  company_currentMonthlyPaymentPaid: boolean
  industry_description: string
  status_description: string
  company_firstAccessAllowedAt: Date
  company_periodFree: boolean
}

interface FilterProps {
  company?: string
  status?: string
  city?: string
  industry?: string
  monthlyPayment?: string
}

const defaultSelect = [{ id: 0, description: 'Todos' }]

const currentMonthlyPayment = [
  { id: 1, description: 'Paga' },
  { id: 2, description: 'Não paga' }
]

const Company: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { industry, setIndustry, companyStatus, setCompanyStatus } =
    useContext(CCompany)

  const { cities, setCities, setPlans } = useContext(CAppData)

  const formRef = useRef<FormHandles>(null)

  const navigate = useNavigate()

  const [company, setCompany] = useState(([] as Array<PropsCompany>) || null)
  const [moreLoading, setMoreLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [filterVisible, setFilterVisible] = useState(false)
  const [offset, setOffset] = useState(0)
  const [endList, setEndList] = useState(false)
  const [filters, setFilters] = useState<FilterProps>({
    city: '',
    company: '',
    industry: '',
    monthlyPayment: '',
    status: ''
  })

  const limit = 30

  // Buscando dados para filtros
  useEffect(() => {
    function findFiltersData() {
      API.get('/manager/data/find')
        .then(response => {
          setIndustry(response.data.industries)
          setCompanyStatus(response.data.status)
          setCities(response.data.cities)
          setPlans(response.data.plans)
        })
        .catch(error => {
          if (error.isAxiosError) {
            notifyError(error.response.data.message)
          }
        })
    }

    findFiltersData()
  }, [])

  // Buscando as empresas cadastradas
  const findCompanies = () => {
    API.get(
      `/manager/companies/find?offset=${offset}&limit=${limit}&company=${filters.company}&industryId=${filters.industry}&statusId=${filters.status}&cityId=${filters.city}&monthlyPayment=${filters.monthlyPayment}`
    )
      .then(response => {
        setOffset(offset + 1)
        setCompany([...company, ...response.data])

        if (response.data.length < limit) {
          setEndList(true)
        }
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
      .finally(() => {
        setPageLoading(false)
        setMoreLoading(false)
      })
  }

  // Ação do botão de filtro da busca
  const findWithFilters = (data?: FilterProps) => {
    setFilterVisible(false)
    setEndList(false)
    setPageLoading(true)
    setOffset(0)
    setCompany([])

    setFilters({
      city: data?.city === '0' ? '' : data?.city,
      company: data?.company ? data?.company : '',
      industry: data?.industry === '0' ? '' : data?.industry,
      status: data?.status === '0' ? '' : data?.status,
      monthlyPayment:
        data?.monthlyPayment === '0'
          ? ''
          : data?.monthlyPayment === '1'
          ? 'true'
          : 'false'
    })
  }

  // Ação do botão de paginação da busca
  const findMoreCompanies = () => {
    setMoreLoading(true)
    findCompanies()
  }

  // Ouve alterações nos filtros
  useEffect(() => {
    findCompanies()
  }, [filters])

  return (
    <Layout title="Empresas">
      {pageLoading ? (
        <PageLoader label="Carregando empresas parceiras" />
      ) : (
        <S.Container>
          <S.SubHeader>
            <QuartenaryButton
              label="Filtrar"
              icon={IoFilter}
              color={PALLET.COLOR_06}
              onClick={() => setFilterVisible(true)}
              noFullWidth
            />
          </S.SubHeader>
          <S.Content>
            <S.Table>
              <S.THead>
                <S.Tr>
                  <S.Th>CNPJ</S.Th>
                  <S.Th>Nome fantasia</S.Th>
                  <S.Th>Ramo de Atividade</S.Th>
                  <S.Th>Status</S.Th>
                  <S.Th>Data de Cadastro</S.Th>
                  <S.Th>Mensalidade Atual</S.Th>
                  <S.Th></S.Th>
                </S.Tr>
              </S.THead>

              <S.TBody>
                {company?.map(item => (
                  <S.Tr key={item.company_id}>
                    <S.Td>{maskCNPJ(item.company_registeredNumber || '')}</S.Td>
                    <S.Td>{item.company_fantasyName}</S.Td>
                    <S.Td>{item.industry_description}</S.Td>
                    <S.Td>{item.status_description}</S.Td>
                    <S.Td>
                      {new Date(item.company_createdAt).toLocaleDateString()}
                    </S.Td>
                    <S.Td>
                      {item.company_periodFree
                        ? 'Período gratuito'
                        : item.company_currentMonthlyPaymentPaid
                        ? 'Paga'
                        : 'Não paga'}
                    </S.Td>
                    <S.Td>
                      <QuartenaryButton
                        color={PALLET.COLOR_08}
                        icon={IoSettingsOutline}
                        onClick={() => {
                          navigate(`/parceiros/empresa/${item.company_id}`)
                        }}
                      />
                    </S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
            {!endList && (
              <S.Footer>
                <S.LoadMoreButton
                  onClick={findMoreCompanies}
                  disabled={moreLoading}
                >
                  {moreLoading ? (
                    <Loader color="#3A4D5C" size="0.6rem" />
                  ) : (
                    'Carregar mais'
                  )}
                </S.LoadMoreButton>
              </S.Footer>
            )}
          </S.Content>
        </S.Container>
      )}

      {/* Modal com os filtros */}
      <FilterModal
        title="Filtros"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <S.Divider />
        <Form ref={formRef} onSubmit={findWithFilters}>
          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Empresa</S.InputFilterTitle>
            <PrimaryInput
              label="Nome fantasia, razão social ou CNPJ da empresa"
              name="company"
              maxLength={40}
              minLength={3}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Status da empresa</S.InputFilterTitle>
            <SelectInput
              name="status"
              label="Selecione"
              options={[...defaultSelect, ...companyStatus]}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Cidade da empresa</S.InputFilterTitle>
            <SelectInput
              name="city"
              label="Selecione"
              options={[...defaultSelect, ...cities]}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Ramo de atividade</S.InputFilterTitle>
            <SelectInput
              name="industry"
              label="Selecione"
              options={[...defaultSelect, ...industry]}
            />
          </S.InputsFilterWrapper>

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Status da mensalidade</S.InputFilterTitle>
            <SelectInput
              name="monthlyPayment"
              label="Selecione"
              options={[...defaultSelect, ...currentMonthlyPayment]}
            />
          </S.InputsFilterWrapper>

          <S.FooterFilter>
            <QuartenaryButton
              type="reset"
              label="Limpar filtros"
              color={PALLET.COLOR_10}
            />
            <QuartenaryButton
              type="submit"
              label="Aplicar filtros"
              color={PALLET.COLOR_02}
            />
          </S.FooterFilter>
        </Form>
      </FilterModal>

      <Toastify />
    </Layout>
  )
}

export default Company
