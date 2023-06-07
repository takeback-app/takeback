/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../../../services/API'
import { CCompany } from '../../../../../contexts/CCompany'
import { CAppData } from '../../../../../contexts/CAppData'
import { TPlan } from '../../../../../types/TPlan'
import { currencyFormat } from '../../../../../utils/currencytFormat'

import DefaultModal from '../../../../../components/modals/DefaultModal'
import SelectInput from '../../../../../components/inputs/SelectInput'
import QuartenaryButton from '../../../../../components/buttons/QuartenaryButton'
import {
  notifyError,
  notifySuccess
} from '../../../../../components/ui/Toastify'

import PALLET from '../../../../../styles/ColorPallet'
import * as S from './styles'

interface Props {
  visible?: boolean
  onClose: () => void
}

const ModalMontly: React.FC<React.PropsWithChildren<Props>> = props => {
  const formRef = useRef<FormHandles>(null)
  const { company, setCompany } = useContext(CCompany)
  const { plans } = useContext(CAppData)

  const [confirmModal, setConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [planSelected, setPlanSelected] = useState<TPlan>()

  const updatePlan = () => {
    setLoading(true)
    API.put(`/manager/company/plan/update/${company.company_id}`, {
      planId: planSelected?.id
    })
      .then(response => {
        setCompany(response.data.companyData)
        notifySuccess(response.data.message)
        setConfirmModal(false)
        props.onClose()
      })
      .catch(error => {
        if (error.isAxiosError) {
          notifyError(error.response.data.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const cancelUpdate = () => {
    formRef.current?.setData({
      montlyPlan: company.plan_id
    })

    setPlanSelected(plans.find(p => p.id === company.plan_id))
    setConfirmModal(false)
  }

  const handleFillData = () => {
    formRef.current?.setData({
      montlyPlan: company.plan_id
    })

    setPlanSelected(plans.find(p => p.id === company.plan_id))
  }

  useEffect(() => {
    handleFillData()
  }, [props.visible])

  return (
    <DefaultModal
      title="ALTERAR MENSALIDADE DA EMPRESA"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={() => setConfirmModal(true)}>
        {!confirmModal ? (
          <S.Container>
            <S.Title>
              Mensalidade: {currencyFormat(planSelected?.value || 0)}
            </S.Title>
            <SelectInput
              label="Plano de mensalidade"
              name="montlyPlan"
              options={plans}
              onChange={e =>
                setPlanSelected(
                  plans.find(p => p.id === parseInt(e.currentTarget.value))
                )
              }
            />

            <S.Footer>
              <QuartenaryButton
                label="Concluir"
                color={PALLET.COLOR_08}
                type="submit"
              />
            </S.Footer>
          </S.Container>
        ) : (
          <S.Container>
            <S.ContentConfim>
              <S.Title>
                Confirma a alteração do plano de mensalidade da empresa?
              </S.Title>
              <S.Label>
                Ao confirmar, a mensalidade da empresa{' '}
                <span style={{ fontWeight: 600 }}>
                  {company.company_fantasyName}
                </span>{' '}
                será de{' '}
                <span style={{ fontWeight: 600 }}>
                  {currencyFormat(planSelected?.value || 0)}
                </span>{' '}
                conforme o plano{' '}
                <span style={{ fontWeight: 600 }}>
                  {planSelected?.description}
                </span>
              </S.Label>
            </S.ContentConfim>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '10px',
                gap: '10px'
              }}
            >
              <QuartenaryButton
                label="Cancelar"
                color={PALLET.COLOR_17}
                type="button"
                onClick={cancelUpdate}
              />
              <QuartenaryButton
                label="Confirmar"
                color={PALLET.COLOR_08}
                type="button"
                loading={loading}
                onClick={updatePlan}
              />
            </div>
          </S.Container>
        )}
      </Form>
    </DefaultModal>
  )
}

export default ModalMontly
