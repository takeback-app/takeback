import React, { useState, useRef, useContext } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../../services/API'
import { CConsumer } from '../../../../contexts/CConsumer'

import DefaultModal from '../../../../components/modals/DefaultModal'
import SecondaryInput from '../../../../components/inputs/SecondaryInput'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import {
  notifyError,
  notifySuccess,
  notifyWarn
} from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'

interface Props {
  visible?: boolean
  onClose: () => void
}

interface data {
  customEmail: string
}

const ModalForgotPassword: React.FC<React.PropsWithChildren<Props>> = props => {
  const formRef = useRef<FormHandles>(null)
  const { consumer } = useContext(CConsumer)

  const [customEmail, setCustomEmail] = useState('')
  const [useCustomEmail, setUseCustomEmail] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateData = (data: data) => {
    if (useCustomEmail && data.customEmail.length < 4) {
      return notifyWarn('Informe o email para envio da senha')
    }

    setConfirmModal(true)
  }

  const forgotPassword = () => {
    setLoading(true)
    API.put(`/manager/consumers/forgot-password/${consumer.consumer_id}`, {
      email: useCustomEmail ? customEmail : consumer.consumer_email
    })
      .then(response => {
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
    setUseCustomEmail(!useCustomEmail)
  }

  return (
    <DefaultModal
      title="RECUPERAR SENHA DO USUÁRIO"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={validateData}>
        {!confirmModal ? (
          <S.Container>
            <S.Content>
              <S.Title>
                Email para envio da senha:{' '}
                {useCustomEmail ? customEmail : consumer.consumer_email}
              </S.Title>
              {useCustomEmail && (
                <SecondaryInput
                  name="customEmail"
                  placeholder="Informe o email"
                  type="string"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.currentTarget.value)}
                />
              )}
              <S.CheckboxWrapper>
                <input
                  type="checkbox"
                  checked={useCustomEmail}
                  onChange={toggleCustomFee}
                />
                <S.CheckboxLabel>utilizar outro email</S.CheckboxLabel>
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
                Confirma a alteração da senha do usuário{' '}
                {consumer.consumer_fullName}?
              </S.Title>
              <S.Label>
                Ao confirmar, será enviado um e-mail para{' '}
                <span style={{ fontWeight: 600 }}>
                  {useCustomEmail ? customEmail : consumer.consumer_email}
                </span>{' '}
                com as instruções para alterar a senha.
              </S.Label>
            </S.ContentConfim>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
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
                onClick={forgotPassword}
              />
            </div>
          </S.Container>
        )}
      </Form>
    </DefaultModal>
  )
}

export default ModalForgotPassword
