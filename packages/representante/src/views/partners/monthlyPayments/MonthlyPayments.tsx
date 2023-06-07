import React, { useState, useEffect, useRef } from 'react'
import { IoFilter } from 'react-icons/io5'
import Loader from 'react-spinners/PulseLoader'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import moment from 'moment'

import { API } from '../../../services/API'
import { currencyFormat } from '../../../utils/currencytFormat'
import { TPlan } from '../../../types/TPlan'

import Layout from '../../../components/ui/Layout'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import PageLoader from '../../../components/loaders/primaryLoader'
import FilterModal from '../../../components/modals/FilterModal'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import SelectInput from '../../../components/inputs/SelectInput'
import DefaultModal from '../../../components/modals/DefaultModal'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import PALLET from '../../../styles/ColorPallet'
import * as S from './styles'

let monthliesSelected: Array<number> = []

interface MonthlyTypes {
  company_fantasyName: string
  company_id: string
  company_registeredNumber: string
  montlhyPayment_amountPaid: string
  montlhyPayment_createdAt: string
  montlhyPayment_dueDate: string
  montlhyPayment_id: number
  montlhyPayment_isPaid: boolean
  montlhyPayment_isForgiven: boolean
  montlhyPayment_paymentMade: boolean
  montlhyPayment_paidDate?: string
  paymentPlan_description: string
  paymentPlan_id: number
  paymentPlan_value: string
}

interface FilterProps {
  company: string
  status: string | boolean
  forgiven: string | boolean
  plan: string
  startDate: string
  endDate: string
}

const MonthlyPaymets: React.FC<React.PropsWithChildren<unknown>> = () => {
  const formRef = useRef<FormHandles>(null)
  const formRefPlanUpdate = useRef<FormHandles>(null)

  const [monthlies, setMonthlies] = useState(
    ([] as Array<MonthlyTypes>) || null
  )
  const [plans, setPlans] = useState([] as Array<TPlan>)
  const [allChecked, setAllChecked] = useState(false)
  const [renderingAux, setRenderingAux] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [endList, setEndList] = useState(false)
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState<FilterProps>({
    company: '',
    endDate: '',
    plan: '',
    startDate: '',
    status: '',
    forgiven: ''
  })
  const [filterVisible, setFilterVisible] = useState(false)
  const [confirmPaymentVisible, setConfirmPaymentVisible] = useState(false)
  const [forgivenPaymentVisible, setForgivenPaymentVisible] = useState(false)
  const [updatePlanVisible, setUpdatePlanVisible] = useState(false)
  const [confirmUpdatePlan, setConfirmUpdatePlan] = useState(false)
  const [planId, setPlanId] = useState('')

  const limit = 30

  // Buscando os planos de pagamento cadastrados
  useEffect(() => {
    function findPlans() {
      API.get('/manager/plan/find')
        .then(response => {
          setPlans(response.data)
        })
        .catch(error => {
          notifyError(error.response.data.message)
        })
        .finally(() => {
          setPageLoading(false)
        })
    }

    findPlans()
  }, [])

  // Buscando as mensalidades das empresas
  const findMonthlies = () => {
    API.get(
      `/manager/montlhy/find?limit=${limit}&offset=${offset}&company=${filters?.company}&isPaid=${filters?.status}&isForgiven=${filters.forgiven}&planId=${filters?.plan}&startDate=${filters?.startDate}&endDate=${filters?.endDate}`
    )
      .then(res => {
        setOffset(offset + 1)
        setMonthlies([...monthlies, ...res.data])

        if (res.data.length < limit) {
          setEndList(true)
        }
      })
      .catch(err => {
        notifyError(err.response.data.message)
      })
      .finally(() => {
        setPageLoading(false)
        setMoreLoading(false)
      })
  }

  // Ação do botão de paginação da busca
  const findMoreMonthlies = () => {
    setMoreLoading(true)
    findMonthlies()
  }

  // Ação do botão de busca dos filtros
  const findWithFilters = (data?: FilterProps) => {
    setPageLoading(true)
    setOffset(0)
    setEndList(false)
    setMonthlies([])
    setFilterVisible(false)

    setFilters({
      status:
        data?.status === '0' ? '' : data?.status ? data?.status === '1' : '',
      forgiven: data?.status === '3' ? true : '',
      plan: data?.plan === '0' ? '' : data?.plan ? data.plan : '',
      company: data?.company ? data.company : '',
      startDate: data?.startDate ? data.startDate : '',
      endDate: data?.endDate ? data.endDate : ''
    })
  }

  // Ouve alterações nos filtros
  useEffect(() => {
    findMonthlies()
    // eslint-disable-next-line
  }, [filters])

  // Adiciona ou remove todas as mensalidades da lista ao array "monthliesSelected"
  const addOrRemoveAllItems = () => {
    if (allChecked) {
      monthliesSelected = []
      setAllChecked(false)
    } else {
      monthliesSelected = []
      monthlies?.map(item => {
        return monthliesSelected.push(item.montlhyPayment_id)
      })

      setAllChecked(true)
    }

    setRenderingAux(!renderingAux)
  }

  // Adiciona ou remove uma mensalidade individual da lista ao array "monthliesSelected"
  const addOrRemoveItem = (id: number) => {
    setRenderingAux(!renderingAux)

    if (monthliesSelected.includes(id)) {
      return monthliesSelected.splice(monthliesSelected.indexOf(id), 1)
    }

    monthliesSelected.push(id)
  }

  // Envia as informações para confirmação do recebimento das mensalidades
  const confirmPaymentMonthly = () => {
    setPageLoading(true)
    setConfirmPaymentVisible(false)

    API.put(
      `/manager/montlhy/confirm?limit=${limit}&offset=${0}&company=${
        filters?.company
      }&isPaid=${filters?.status}&isForgiven=${filters.forgiven}&planId=${
        filters?.plan
      }&startDate=${filters?.startDate}&endDate=${filters?.endDate}`,
      {
        monthlyIds: monthliesSelected
      }
    )
      .then(res => {
        setMonthlies(res.data.monthlies)
        notifySuccess(res.data.message)
      })
      .catch(err => {
        notifyError(err.response.data.message)
      })
      .finally(() => {
        monthliesSelected = []
        setOffset(1)
        setPageLoading(false)
      })
  }

  // Envia as informações para realizar a dispensa das mensalidades selecionadas
  const forgivenPaymentMonthly = () => {
    setPageLoading(true)
    setForgivenPaymentVisible(false)

    API.put(
      `/manager/montlhy/forgiven?limit=${limit}&offset=${0}&company=${
        filters?.company
      }&isPaid=${filters?.status}&isForgiven=${filters.forgiven}&planId=${
        filters?.plan
      }&startDate=${filters?.startDate}&endDate=${filters?.endDate}`,
      {
        monthlyIds: monthliesSelected
      }
    )
      .then(res => {
        setMonthlies(res.data.monthlies)
        notifySuccess(res.data.message)
      })
      .catch(err => {
        notifyError(err.response.data.message)
      })
      .finally(() => {
        monthliesSelected = []
        setOffset(1)
        setPageLoading(false)
      })
  }

  // Envia as informações para a alteração do plano de pagamento das mensalidades
  const updatePlanOfPaymentMonthly = () => {
    setPageLoading(true)
    setUpdatePlanVisible(false)
    setConfirmUpdatePlan(false)

    API.put(
      `/manager/montlhy/update?limit=${limit}&offset=${0}&company=${
        filters?.company
      }&isPaid=${filters?.status}&isForgiven=${filters.forgiven}&planId=${
        filters?.plan
      }&startDate=${filters?.startDate}&endDate=${filters?.endDate}`,
      {
        monthlyIds: monthliesSelected,
        planId
      }
    )
      .then(res => {
        setMonthlies(res.data.monthlies)
        notifySuccess(res.data.message)
      })
      .catch(err => {
        notifyError(err.response.data.message)
      })
      .finally(() => {
        monthliesSelected = []
        setOffset(1)
        setPageLoading(false)
      })
  }

  return (
    <Layout title="Mensalidades dos parceiros">
      {pageLoading ? (
        <PageLoader label="Carregando mensalidades" />
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
                  <S.Th>
                    <S.Checkbox
                      onChange={addOrRemoveAllItems}
                      checked={allChecked}
                    />
                  </S.Th>
                  <S.Th>Empresa</S.Th>
                  <S.Th>Plano</S.Th>
                  <S.Th>Valor</S.Th>
                  <S.Th>Referente</S.Th>
                  <S.Th>Vencimento</S.Th>
                  <S.Th>Pagamento</S.Th>
                  <S.Th>Status</S.Th>
                </S.Tr>
              </S.THead>

              <S.TBody>
                {monthlies?.map(item => (
                  <S.Tr key={item.montlhyPayment_id}>
                    <S.Td>
                      <S.Checkbox
                        checked={monthliesSelected.includes(
                          item.montlhyPayment_id
                        )}
                        value={item.montlhyPayment_id}
                        onChange={() => addOrRemoveItem(item.montlhyPayment_id)}
                      />
                    </S.Td>
                    <S.Td>{item.company_fantasyName}</S.Td>
                    <S.Td>{item.paymentPlan_description}</S.Td>
                    <S.Td>
                      {currencyFormat(
                        parseFloat(item.montlhyPayment_amountPaid)
                      )}
                    </S.Td>
                    <S.Td>
                      {moment
                        .utc(item.montlhyPayment_createdAt)
                        .format('MMMM [DE] YYYY')}
                    </S.Td>
                    <S.Td>
                      {moment
                        .utc(item.montlhyPayment_dueDate || '')
                        .format('DD/MM/YYYY')}
                    </S.Td>
                    <S.Td>
                      {item.montlhyPayment_isPaid
                        ? moment
                            .utc(item.montlhyPayment_paidDate || '')
                            .format('DD/MM/YYYY')
                        : '-'}
                    </S.Td>
                    <S.Td>
                      {item.montlhyPayment_isPaid
                        ? 'Paga'
                        : item.montlhyPayment_isForgiven
                        ? 'Dispensada'
                        : item.montlhyPayment_paymentMade
                        ? 'Solicitado'
                        : 'Pendente'}
                    </S.Td>
                  </S.Tr>
                ))}
              </S.TBody>
            </S.Table>
            {!endList && (
              <S.Footer>
                <S.LoadMoreButton
                  onClick={findMoreMonthlies}
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

      {/* Barra de opções inferior */}
      <S.FooterBar visibility={monthliesSelected.length > 0}>
        <S.TotalMonthlies>
          Mensalidades selecionadas: {monthliesSelected.length}
        </S.TotalMonthlies>
        <S.ButtonsWrapper>
          <QuartenaryButton
            label="Dispensar Mensalidade"
            color={PALLET.COLOR_18}
            onClick={() => setForgivenPaymentVisible(true)}
          />
          <QuartenaryButton
            label="Alterar Plano"
            color={PALLET.COLOR_05}
            onClick={() => setUpdatePlanVisible(true)}
          />
          <QuartenaryButton
            label="Confirmar Recebimento"
            color={PALLET.COLOR_15}
            onClick={() => setConfirmPaymentVisible(true)}
          />
        </S.ButtonsWrapper>
      </S.FooterBar>

      {/* Modal com os filtros */}
      <FilterModal
        title="Filtros"
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      >
        <S.Divider />
        <Form ref={formRef} onSubmit={findWithFilters}>
          <S.InputsWrapper>
            <S.InputTitle>Empresa</S.InputTitle>
            <PrimaryInput
              label="Nome fantasia ou CNPJ da empresa"
              name="company"
              maxLength={40}
              minLength={3}
            />
          </S.InputsWrapper>

          <S.Divider />

          <S.InputsWrapper>
            <S.InputTitle>Status da mensalidade</S.InputTitle>
            <SelectInput
              label="Selecione"
              name="status"
              options={[
                { id: 0, description: 'Todos' },
                { id: 1, description: 'Paga' },
                { id: 2, description: 'Pendente' },
                { id: 3, description: 'Dispensada' }
              ]}
            />
          </S.InputsWrapper>

          <S.Divider />

          <S.InputsWrapper>
            <S.InputTitle>Plano de mensalidade</S.InputTitle>
            <SelectInput
              label="Selecione"
              name="plan"
              options={[{ id: 0, description: 'Todos' }, ...plans]}
            />
          </S.InputsWrapper>

          <S.Divider />

          <S.InputsWrapper>
            <S.InputTitle>Período referente</S.InputTitle>
            <S.InputDateWrapper>
              <PrimaryInput type="date" name="startDate" label="Início" />
              <PrimaryInput type="date" name="endDate" label="Fim" />
            </S.InputDateWrapper>
          </S.InputsWrapper>

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

      {/* Modal de confirmação de recebimento de mensalidades */}
      <DefaultModal
        title="CONFIRME A OPERAÇÃO"
        visible={confirmPaymentVisible}
        onClose={() => setConfirmPaymentVisible(false)}
        size="medium"
      >
        <S.ModalContainer>
          <S.ModalContent>
            <S.Label>
              Confirma o recebimento de {monthliesSelected.length}{' '}
              mensalidade(s)?
            </S.Label>
          </S.ModalContent>

          <S.ModalFooter>
            <QuartenaryButton
              label="Cancelar"
              color={PALLET.COLOR_17}
              type="button"
              onClick={() => setConfirmPaymentVisible(false)}
            />
            <QuartenaryButton
              label="Confirmar"
              color={PALLET.COLOR_08}
              type="button"
              onClick={confirmPaymentMonthly}
            />
          </S.ModalFooter>
        </S.ModalContainer>
      </DefaultModal>

      {/* Modal de confirmação de dispensa de mensalidade */}
      <DefaultModal
        title="ATENÇÃO! CONFIRME A OPERAÇÃO"
        visible={forgivenPaymentVisible}
        onClose={() => setForgivenPaymentVisible(false)}
        size="medium"
      >
        <S.ModalContainer>
          <S.ModalContent>
            <S.Label>
              Confirma a dispensa de {monthliesSelected.length} mensalidade(s)?
            </S.Label>
          </S.ModalContent>

          <S.ModalFooter>
            <QuartenaryButton
              label="Cancelar"
              color={PALLET.COLOR_17}
              type="button"
              onClick={() => setForgivenPaymentVisible(false)}
            />
            <QuartenaryButton
              label="Confirmar"
              color={PALLET.COLOR_08}
              type="button"
              onClick={forgivenPaymentMonthly}
            />
          </S.ModalFooter>
        </S.ModalContainer>
      </DefaultModal>

      {/* Modal de confirmação de alteração de plano */}
      <DefaultModal
        title="ALTERAÇÃO DE PLANO DE MENSALIDADE"
        visible={updatePlanVisible}
        onClose={() => setUpdatePlanVisible(false)}
        size="medium"
      >
        <Form ref={formRefPlanUpdate} onSubmit={updatePlanOfPaymentMonthly}>
          {!confirmUpdatePlan ? (
            <S.ModalContainer>
              <S.ModalContent>
                <SelectInput
                  label="Selecione o plano"
                  name="planId"
                  options={plans}
                  onChange={e => setPlanId(e.currentTarget.value)}
                />
              </S.ModalContent>

              <S.ModalFooter>
                <QuartenaryButton
                  label="Cancelar"
                  color={PALLET.COLOR_17}
                  type="button"
                  onClick={() => setUpdatePlanVisible(false)}
                />
                <QuartenaryButton
                  label="Continuar"
                  color={PALLET.COLOR_08}
                  type="button"
                  onClick={() => setConfirmUpdatePlan(true)}
                />
              </S.ModalFooter>
            </S.ModalContainer>
          ) : (
            <S.ModalContainer>
              <S.ModalContent>
                <S.Label>
                  Confirma a alteração dos planos de {monthliesSelected.length}{' '}
                  mensalidade(s)?
                </S.Label>
              </S.ModalContent>

              <S.ModalFooter>
                <QuartenaryButton
                  label="Cancelar"
                  color={PALLET.COLOR_17}
                  type="button"
                  onClick={() => setConfirmUpdatePlan(false)}
                />
                <QuartenaryButton
                  label="Confirmar"
                  color={PALLET.COLOR_08}
                  type="button"
                  onClick={updatePlanOfPaymentMonthly}
                />
              </S.ModalFooter>
            </S.ModalContainer>
          )}
        </Form>
      </DefaultModal>

      <Toastify />
    </Layout>
  )
}

export default MonthlyPaymets
