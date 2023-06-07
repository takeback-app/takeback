import React, { useState, useRef, useContext, useEffect } from 'react'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { API } from '../../../../../services/API'
import { CCompany } from '../../../../../contexts/CCompany'
import { percentFormat } from '../../../../../utils/percentFormat'

import DefaultModal from '../../../../../components/modals/DefaultModal'
import SecondaryInput from '../../../../../components/inputs/SecondaryInput'
// import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import QuartenaryButton from '../../../../../components/buttons/QuartenaryButton'
import {
  notifyError,
  notifySuccess,
  notifyWarn
} from '../../../../../components/ui/Toastify'

import PALLET from '../../../../../styles/ColorPallet'
import * as S from './styles'

import { maskCPF } from '../../../../../utils/masks'

interface Props {
  visible?: boolean
  onClose: () => void
}

interface data {
  name: string
  fee: number
  cpf: string
}

const ModalFirstAccess: React.FC<React.PropsWithChildren<Props>> = props => {
  const formRef = useRef<FormHandles>(null)
  const { company, setCompany, setCompanyUsers } = useContext(CCompany)

  const [useCustomName, setUseCustomName] = useState(false)
  const [customName, setCustomName] = useState('')
  const [useCustomFee, setUseCustomFee] = useState(false)
  const [customFee, setCustomFee] = useState(0)
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [isCPF, setIsCPF] = useState('')

  const validateData = (data: data) => {
    if (useCustomName && data.name.length < 4) {
      return notifyWarn(
        'Informe pelo menos quatro caracteres no nome do usuário'
      )
    }

    if (useCustomFee && !data.fee) {
      return notifyWarn('Informe o valor da taxa personalizada')
    }

    setConfirmModal(true)
  }

  const releaseFirstAccess = () => {
    setLoading(true)
    API.post('/manager/company/allow-access', {
      companyId: company.company_id,
      useCustomName,
      customName,
      useCustomFee,
      customFee,
      cpf: isCPF.replace(/[^\d]/g, '')
    })
      .then(response => {
        setCompany(response.data.companyData)
        setCompanyUsers(response.data.companyUsers)
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
      title="LIBERAR PRIMEIRO ACESSO"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Form ref={formRef} onSubmit={validateData}>
        {!confirmModal ? (
          <S.Container>
            <S.Title>Digite o CPF: Administrativo</S.Title>
            <SecondaryInput
              name="cpf"
              placeholder="Digite o CPF"
              value={isCPF}
              onChange={e => setIsCPF(maskCPF(e.currentTarget.value))}
            />
            <S.Content>
              <S.Title>
                Nome do usuário de acesso:{' '}
                {useCustomName ? customName : 'Administrativo'}
              </S.Title>
              {useCustomName && (
                <SecondaryInput
                  name="name"
                  placeholder="Nome"
                  value={customName}
                  onChange={e => setCustomName(e.currentTarget.value)}
                />
              )}
              <S.CheckboxWrapper>
                <input
                  type="checkbox"
                  onChange={() => setUseCustomName(!useCustomName)}
                />
                <S.CheckboxLabel>
                  utilizar um nome personalizado
                </S.CheckboxLabel>
              </S.CheckboxWrapper>
            </S.Content>

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

            <S.Content>
              <S.Title>Status da empresa: ATIVO</S.Title>
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
                Confirma a liberação do acesso da empresa{' '}
                {company.company_fantasyName}?
              </S.Title>
              <S.Label>
                Ao confirmar, será enviado um e-mail para{' '}
                <span style={{ fontWeight: 600 }}>{company.company_email}</span>{' '}
                com as credenciais de acesso.
              </S.Label>
            </S.ContentConfim>
            <S.Footer>
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
                onClick={releaseFirstAccess}
              />
            </S.Footer>
          </S.Container>
        )}
      </Form>
    </DefaultModal>
  )
}

export default ModalFirstAccess
