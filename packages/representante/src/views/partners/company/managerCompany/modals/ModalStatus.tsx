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
  notifySuccess,
  notifyWarn
} from '../../../../../components/ui/Toastify'

import PALLET from '../../../../../styles/ColorPallet'
import * as S from './styles'

interface Props {
  visible?: boolean
  onClose: () => void
}

const ModalStatus: React.FC<React.PropsWithChildren<Props>> = props => {
  const formRef = useRef<FormHandles>(null)
  const { company, setCompany, companyStatus, companyUsers } =
    useContext(CCompany)

  const [confirmModal, setConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusId, setStatusId] = useState(0)

  const confirmData = (data: { status: string }) => {
    if (companyUsers.length === 0 && data.status === '1') {
      return notifyWarn('O acesso da empresa ainda não foi liberado')
    }

    setStatusId(parseInt(data.status))
    setConfirmModal(true)
  }

  const updateStatus = () => {
    setLoading(true)
    API.put(`/manager/company/status/update/${company.company_id}`, {
      statusId
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
      status: company.status_id
    })
  }

  useEffect(() => {
    handleFillData()
  }, [props.visible])

  return (
    <DefaultModal
      title="ALTERAR STATUS DA EMPRESA"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={confirmData}>
        {!confirmModal ? (
          <S.Container>
            <SelectInput
              label="Selecione o status"
              name="status"
              options={companyStatus}
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
              <S.Title>Confirma a alteração do status da empresa</S.Title>
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
                onClick={updateStatus}
              />
            </div>
          </S.Container>
        )}
      </Form>
    </DefaultModal>
  )
}

export default ModalStatus
