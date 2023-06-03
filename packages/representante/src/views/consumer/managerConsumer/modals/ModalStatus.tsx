/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../../services/API'
import { CConsumer } from '../../../../contexts/CConsumer'

import DefaultModal from '../../../../components/modals/DefaultModal'
import SelectInput from '../../../../components/inputs/SelectInput'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import { notifyError, notifySuccess } from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'

const status = [
  { id: 0, description: 'Ativo' },
  { id: 1, description: 'Inativo' }
]

interface Props {
  visible?: boolean
  onClose: () => void
}

const ModalStatus: React.FC<React.PropsWithChildren<Props>> = props => {
  const formRef = useRef<FormHandles>(null)
  const { consumer, setConsumer } = useContext(CConsumer)

  const [confirmModal, setConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deactivedAccount, setDeactivedAccount] = useState(false)

  const confirmData = (data: { status: string }) => {
    setDeactivedAccount(data.status !== '0')
    setConfirmModal(true)
  }

  const updateStatus = () => {
    setLoading(true)
    API.put(`/manager/consumers/update/status/${consumer.consumer_id}`, {
      deactivedAccount
    })
      .then(response => {
        setConsumer(response.data.consumerData)
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
      status: consumer.consumer_deactivedAccount ? 1 : 0
    })
  }

  useEffect(() => {
    handleFillData()
  }, [props.visible])

  return (
    <DefaultModal
      title="ALTERAR STATUS DO CLIENTE"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={confirmData}>
        {!confirmModal ? (
          <S.ModalContent>
            <SelectInput
              label="Selecione o status"
              name="status"
              options={status}
            />

            <S.FooterModal>
              <QuartenaryButton
                label="Concluir"
                color={PALLET.COLOR_08}
                type="submit"
              />
            </S.FooterModal>
          </S.ModalContent>
        ) : (
          <S.ModalContent>
            <S.ContentConfim>
              <S.Title>Confirma a alteração do status do cliente?</S.Title>
            </S.ContentConfim>

            <S.FooterModal>
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
            </S.FooterModal>
          </S.ModalContent>
        )}
      </Form>
    </DefaultModal>
  )
}

export default ModalStatus
