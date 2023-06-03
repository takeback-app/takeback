/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { IoAdd, IoFilter, IoSettingsOutline } from 'react-icons/io5'

import Loader from 'react-spinners/PulseLoader'

import { API } from '../../../../services/API'
import { CCompany } from '../../../../contexts/CCompany'
import { CAppData } from '../../../../contexts/CAppData'
import { maskCNPJ } from '../../../../utils/masks'

import Layout from '../../../../components/ui/Layout'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import SelectInput from '../../../../components/inputs/SelectInput'
import PageLoader from '../../../../components/loaders/primaryLoader'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import { notifyError } from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'
import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure
} from '@chakra-ui/react'
import { AuthContext } from '../../../../contexts/AuthContext'

interface PropsCompany {
  id: string
  fantasyName: string
  registeredNumber: string
  createdAt: string
  currentMonthlyPaymentPaid: boolean
  industry: {
    description: string
  }
  companyStatus: {
    description: string
  }
  firstAccessAllowedAt: Date
  periodFree: boolean
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
  const { isAdmin } = useContext(AuthContext)

  const { isOpen, onClose, onOpen } = useDisclosure()

  const { industry, setIndustry, companyStatus, setCompanyStatus } =
    useContext(CCompany)

  const { cities, setCities, setPlans } = useContext(CAppData)

  const formRef = useRef<FormHandles>(null)

  const navigate = useNavigate()

  const [company, setCompany] = useState(([] as Array<PropsCompany>) || null)
  const [moreLoading, setMoreLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [endList, setEndList] = useState(false)
  const [filters, setFilters] = useState<FilterProps>({
    city: '',
    company: '',
    industry: '',
    monthlyPayment: '',
    status: ''
  })

  // Buscando dados para filtros
  useEffect(() => {
    function findFiltersData() {
      API.get('/representative/data/find')
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
    API.get(`/representative/companies`, {
      params: {
        page,
        company: filters.company,
        industryId: filters.industry,
        statusId: filters.status,
        cityId: filters.city,
        monthlyPayment: filters.monthlyPayment
      }
    })
      .then(response => {
        setEndList(
          page === response.data.meta.lastPage ||
            response.data.data.length === 0
        )
        setPage(state => state + 1)
        setCompany([...company, ...response.data.data])
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
    onClose()
    setEndList(false)
    setPageLoading(true)
    setPage(1)
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
            <ButtonGroup>
              {isAdmin && (
                <Button
                  colorScheme="green"
                  onClick={() => {
                    navigate(`/empresas/criar`)
                  }}
                  leftIcon={<IoAdd />}
                >
                  Criar
                </Button>
              )}

              <IconButton
                aria-label="Filtrar empresas"
                colorScheme="gray"
                onClick={onOpen}
                icon={<IoFilter />}
              ></IconButton>
            </ButtonGroup>
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
                  <S.Tr key={item.id}>
                    <S.Td>{maskCNPJ(item.registeredNumber || '')}</S.Td>
                    <S.Td>{item.fantasyName}</S.Td>
                    <S.Td>{item.industry.description}</S.Td>
                    <S.Td>{item.companyStatus.description}</S.Td>
                    <S.Td>{new Date(item.createdAt).toLocaleDateString()}</S.Td>
                    <S.Td>
                      {item.periodFree
                        ? 'Período gratuito'
                        : item.currentMonthlyPaymentPaid
                        ? 'Paga'
                        : 'Não paga'}
                    </S.Td>
                    <S.Td>
                      <QuartenaryButton
                        color={PALLET.COLOR_08}
                        icon={IoSettingsOutline}
                        onClick={() => {
                          navigate(`/empresas/${item.id}`)
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

      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Filtros</DrawerHeader>
          <DrawerCloseButton />
          <Form ref={formRef} onSubmit={findWithFilters}>
            <DrawerBody p={0}>
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
            </DrawerBody>

            <DrawerFooter>
              <ButtonGroup>
                <Button type="reset">Limpar filtros</Button>
                <Button type="submit" colorScheme="blue">
                  Aplicar filtros
                </Button>
              </ButtonGroup>
            </DrawerFooter>
          </Form>
        </DrawerContent>
      </Drawer>
    </Layout>
  )
}

export default Company
