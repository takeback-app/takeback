/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import Loader from 'react-spinners/PulseLoader'
import { useNavigate } from 'react-router'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { IoFilter, IoSettingsOutline } from 'react-icons/io5'

import { API } from '../../../services/API'
import { TConsumer } from '../../../types/TConsumer'

import Layout from '../../../components/ui/Layout'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import SelectInput from '../../../components/inputs/SelectInput'
import PageLoader from '../../../components/loaders/primaryLoader'
import FilterModal from '../../../components/modals/FilterModal'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import Toastify, { notifyError } from '../../../components/ui/Toastify'

import PALLET from '../../../styles/ColorPallet'
import * as S from './styles'

const statusOptions = [
  { id: 0, description: 'Todos' },
  { id: 1, description: 'Ativos' },
  { id: 2, description: 'Inativos' }
]

const defaultSelect = [{ id: 0, description: 'Todos' }]

interface Cities {
  id: number
  name: string
}

interface FilterProps {
  status?: string | boolean
  city?: string
  consumer?: string
}

const Consumer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const formRef = useRef<FormHandles>(null)
  const navigateTo = useNavigate()

  const [consumers, setConsumers] = useState(([] as Array<TConsumer>) || null)
  const [filterVisible, setFilterVisible] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [endList, setEndList] = useState(false)
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState<FilterProps>({
    city: '',
    status: '',
    consumer: ''
  })

  const [cities, setCities] = useState([] as Array<Cities>)

  const limit = 60

  // Buscando os consumidores
  const findConsumers = () => {
    API.get(
      `/manager/consumers/find?offset=${offset}&limit=${limit}&consumer=${filters.consumer}&status=${filters.status}&city=${filters.city}`
    )
      .then(response => {
        setOffset(offset + 1)
        setConsumers([...consumers, ...response.data])

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
    setPageLoading(true)
    setEndList(false)
    setConsumers([])
    setOffset(0)

    setFilters({
      city: data?.city === '0' ? '' : data?.city,
      consumer: data?.consumer ? data?.consumer : '',
      status: data?.status === '0' ? '' : data?.status === '1'
    })
  }

  // Ação do botão de paginação da busca
  const findMoreConsumers = () => {
    setMoreLoading(true)
    findConsumers()
  }

  useEffect(() => {
    function findFiltersData() {
      API.get('/manager/data/find')
        .then(response => {
          setCities(response.data.cities)
        })
        .catch(error => {
          if (error.isAxiosError) {
            notifyError(error.response.data.message)
          }
        })
    }

    findFiltersData()
  }, [])

  useEffect(() => {
    findConsumers()
  }, [filters])

  return (
    <Layout title="Clientes">
      {pageLoading ? (
        <PageLoader label="Carregando clientes..." />
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
          </S.SubHeader>

          <S.Table>
            <S.THead>
              <S.Tr>
                <S.Th>Nome</S.Th>
                <S.Th>Cidade</S.Th>
                <S.Th>Saldo disponível</S.Th>
                <S.Th>Saldo pendente</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>Data de Cadastro</S.Th>
                <S.Th></S.Th>
              </S.Tr>
            </S.THead>

            <S.TBody>
              {consumers?.map(item => (
                <S.Tr key={item.consumer_id}>
                  <S.Td>{item.consumer_fullName}</S.Td>
                  <S.Td>{item.city_name}</S.Td>
                  <S.Td>
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.consumer_balance || 0)}
                  </S.Td>
                  <S.Td>
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.consumer_blockedBalance || 0)}
                  </S.Td>
                  <S.Td>
                    {item.consumer_deactivedAccount ? 'INATIVO' : 'ATIVO'}
                  </S.Td>
                  <S.Td>
                    {new Date(item.consumer_createdAt).toLocaleDateString()}
                  </S.Td>
                  <S.Td>
                    <QuartenaryButton
                      color={PALLET.COLOR_08}
                      icon={IoSettingsOutline}
                      onClick={() => {
                        navigateTo(`/clientes/${item.consumer_id}`)
                      }}
                    />
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>
          {!endList && (
            <S.Footer>
              <S.LoadMoreButton onClick={findMoreConsumers}>
                {moreLoading ? (
                  <Loader color="#3A4D5C" size="0.6rem" />
                ) : (
                  'Carregar mais'
                )}
              </S.LoadMoreButton>
            </S.Footer>
          )}
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
            <S.InputFilterTitle>Cliente</S.InputFilterTitle>
            <PrimaryInput
              label="Nome ou CPF do cliente"
              name="consumer"
              maxLength={40}
              minLength={3}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Status do cliente</S.InputFilterTitle>
            <SelectInput
              name="status"
              label="Selecione"
              options={statusOptions}
            />
          </S.InputsFilterWrapper>

          <S.Divider />

          <S.InputsFilterWrapper>
            <S.InputFilterTitle>Cidade do cliente</S.InputFilterTitle>
            <SelectInput
              name="city"
              label="Selecione"
              options={[...defaultSelect, ...cities]}
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

export default Consumer
