import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../../../services/API'
import { CCompany } from '../../../../../contexts/CCompany'
import { percentFormat } from '../../../../../utils/percentFormat'

import DefaultModal from '../../../../../components/modals/DefaultModal'
import SecondaryInput from '../../../../../components/inputs/SecondaryInput'
import QuartenaryButton from '../../../../../components/buttons/QuartenaryButton'
import {
  notifyError,
  notifySuccess,
  notifyWarn
} from '../../../../../components/ui/Toastify'

import PALLET from '../../../../../styles/ColorPallet'
import * as S from './styles'

interface Props {
  visible?: boolean
  onClose: () => void
}

interface data {
  name: string
  fee: number
}

const ModalFee: React.FC<React.PropsWithChildren<Props>> = props => {
  const formRef = useRef<FormHandles>(null)
  const { company, setCompany } = useContext(CCompany)

  const [useCustomFee, setUseCustomFee] = useState(false)
  const [customFee, setCustomFee] = useState(0)
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)

  const validateData = (data: data) => {
    if (useCustomFee && !data.fee) {
      return notifyWarn('Informe o valor da taxa personalizada')
    }

    setConfirmModal(true)
  }

  const updateFee = () => {
    setLoading(true)
    API.put(`/manager/company/fee/update/${company.company_id}`, {
      customIndustryFeeActive: useCustomFee,
      customIndustryFee: customFee
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

  const toggleCustomFee = () => {
    setCustomFee(0)
    setUseCustomFee(!useCustomFee)
  }

  const handleFillData = () => {
    setCustomFee(company.company_customIndustryFee * 100)
    setUseCustomFee(company.company_customIndustryFeeActive)
  }

  useEffect(() => {
    handleFillData()
    // eslint-disable-next-line
  }, [props.visible])

  return (
    <DefaultModal
      title="CONFIGURAR TAXA POR CASHBACK"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={validateData}>
        {!confirmModal ? (
          <S.Container>
            <S.Content>
              <S.Title>
                Taxa por cashback emitido:{' '}
                {useCustomFee
                  ? percentFormat(customFee / 100)
                  : percentFormat(company.industry_industryFee)}
              </S.Title>
              {useCustomFee && (
                <SecondaryInput
                  name="fee"
                  placeholder="Informe a taxa"
                  type="number"
                  value={customFee}
                  min={0}
                  max={100}
                  step={0.01}
                  onChange={e =>
                    setCustomFee(parseFloat(e.currentTarget.value))
                  }
                />
              )}
              <S.CheckboxWrapper>
                <input
                  type="checkbox"
                  checked={useCustomFee}
                  onChange={toggleCustomFee}
                />
                <S.CheckboxLabel>utilizar taxa personalizada</S.CheckboxLabel>
              </S.CheckboxWrapper>
            </S.Content>

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
                Confirma a alteração da taxa para{' '}
                {useCustomFee
                  ? percentFormat(customFee / 100)
                  : percentFormat(company.industry_industryFee)}
                ?
              </S.Title>
              <S.Label>
                Ao confirmar, os cashbacks emitidos pela empresa{' '}
                <span style={{ fontWeight: 600 }}>
                  {company.company_fantasyName}
                </span>{' '}
                terão uma taxa de{' '}
                <span style={{ fontWeight: 600 }}>
                  {useCustomFee
                    ? percentFormat(customFee / 100)
                    : percentFormat(company.industry_industryFee)}{' '}
                </span>
                por cashback.
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
                onClick={() => setConfirmModal(false)}
              />
              <QuartenaryButton
                label="Confirmar"
                color={PALLET.COLOR_08}
                type="button"
                loading={loading}
                onClick={updateFee}
              />
            </div>
          </S.Container>
        )}
      </Form>
    </DefaultModal>
  )
}

export default ModalFee
