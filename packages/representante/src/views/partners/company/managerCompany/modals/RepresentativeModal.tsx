/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../../../services/API'
import { CCompany } from '../../../../../contexts/CCompany'

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

export const RepresentativeModal: React.FC<
  React.PropsWithChildren<Props>
> = props => {
  const formRef = useRef<FormHandles>(null)
  const { company, setCompany, representatives } = useContext(CCompany)

  const [confirmModal, setConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [representativeId, setRepresentativeId] = useState('')

  const confirmData = (data: { representative: string }) => {
    setRepresentativeId(data.representative)

    setConfirmModal(true)
  }

  const updateRepresentative = () => {
    setLoading(true)
    API.put(`/manager/company/representative`, {
      companyId: company.company_id,
      representativeId
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

  const handleFillData = () => {
    formRef.current?.setData({
      representative: company.representative_id || '0'
    })
  }

  useEffect(() => {
    handleFillData()
  }, [props.visible])

  return (
    <DefaultModal
      title="ALTERAR REPRESENTANTE DA EMPRESA"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={confirmData}>
        {!confirmModal ? (
          <S.Container>
            <SelectInput
              label="Selecione o representante"
              name="representative"
              options={[{ id: '0', name: 'Nenhum' }, ...representatives]}
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
                Confirma a alteração do representante da empresa
              </S.Title>
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
                onClick={updateRepresentative}
              />
            </div>
          </S.Container>
        )}
      </Form>
    </DefaultModal>
  )
}
