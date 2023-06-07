/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import * as Yup from 'yup'

import { CUser } from '../../../../contexts/CUser'
import { TUser } from '../../../../types/TUser'
import { API } from '../../../../services/API'

import { notifyError, notifySuccess } from '../../../../components/ui/Toastify'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import SelectInput from '../../../../components/inputs/SelectInput'
import SwitchButton from '../../../../components/buttons/SwtichButton'
import Layout from '../../../../components/ui/Layout'
import PasswordInput from '../../../../components/inputs/PasswordInput'
import Checkbox from '../../../../components/inputs/Checkbox'
import QuintenaryButton from '../../../../components/buttons/QuintenaryButton'
import Modal from '../../../../components/modals/DefaultModal'

import { maskCPF, maskPhone } from '../../../../utils/masks'

import * as S from './styles'

interface PropsForm {
  newPassword?: string
  confirmPassword?: string
  generatePassword?: boolean
}

const ManagerUsers: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { users, setUsers, userType } = useContext(CUser)
  const formRefEditPersonalData = useRef<FormHandles>(null)
  const formRefEditPassword = useRef<FormHandles>(null)
  const { index } = useParams()
  const navigateTo = useNavigate()
  const userIndex = parseInt(index || '')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoadingPass, setIsLoadingPass] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [userId, setUserId] = useState('')
  const [generatePassword, setGeneratePassword] = useState(false)
  const [passVisible, setPassVisible] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [dataForm, setDataForm] = useState<PropsForm>([] as any)

  const handleFill = () => {
    formRefEditPersonalData.current?.setData({
      name: users[userIndex || 0]?.name,
      email: users[userIndex || 0]?.email,
      userType: users[userIndex || 0]?.userType.id
    })
    setUserId(users[userIndex || 0]?.id)
    setCpf(maskCPF(users[userIndex || 0]?.cpf || ''))
    setPhone(maskPhone(users[userIndex || 0]?.phone || ''))
    setIsActive(users[userIndex || 0]?.isActive)
  }

  async function validatePersonalDataEdit(data: TUser) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(4).required('Informe o seu nome'),
        cpf: Yup.string().required('Informe o cpf'),
        email: Yup.string().email().required('informe o email')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      updatePersonalData(data)

      formRefEditPersonalData.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        formRefEditPersonalData.current?.setErrors(validationErros)
      }
    }
  }

  const updatePersonalData = (data: TUser) => {
    setIsLoadingData(true)

    API.put(`/manager/user/update/${userId}`, {
      name: data.name,
      cpf: data.cpf.replace(/[^\d]/g, ''),
      email: data.email,
      phone: data.phone.replace(/[^\d]/g, ''),
      userTypeId: data.userType,
      isActive
    })
      .then(response => {
        notifySuccess(response.data.message)
        setUsers(response.data.users)
        setIsLoadingData(false)
      })
      .catch(error => {
        setIsLoadingData(false)
        notifyError(error.response.data.message)
      })
  }

  const confirmUpdatePassword = (data: PropsForm) => {
    setIsModal(true)
    setDataForm(data)
  }

  async function validatePasswordEdit(data: PropsForm) {
    setIsModal(false)
    if (!generatePassword) {
      try {
        const schema = Yup.object().shape({
          newPassword: Yup.string().min(4).required('Informe sua nova senha!'),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref('newPassword')],
            'Coloque uma senha compatível'
          )
        })

        await schema.validate(data, {
          abortEarly: false
        })

        updatePassword(data)

        formRefEditPassword.current?.setErrors({})
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const validationErros: any = {}

          error.inner.forEach(err => {
            validationErros[err.path] = err.message
          })

          formRefEditPassword.current?.setErrors(validationErros)
        }
      }
    } else {
      updatePassword(data)
    }
  }

  const updatePassword = (data: PropsForm) => {
    setIsLoadingPass(true)
    API.put(`/manager/user/password/forgot/${userId}`, {
      newPassword: data.newPassword,
      generatePassword
    })
      .then(response => {
        notifySuccess(response.data)
        setIsLoadingPass(false)
        formRefEditPassword.current?.reset()
      })
      .catch(error => {
        notifyError(error.response.data.message)
        setIsLoadingPass(false)
      })
  }

  useEffect(() => {
    if (userIndex !== undefined) {
      handleFill()
    }
  }, [userIndex])

  return (
    <Layout
      goBackTitle={users[userIndex || 0]?.name}
      goBack={() => navigateTo(-1)}
    >
      <S.Container>
        <Form ref={formRefEditPersonalData} onSubmit={validatePersonalDataEdit}>
          <S.Content>
            <S.DataTitle>
              <h5>Dados do Usuário</h5>
            </S.DataTitle>
            <S.DataContentWrapper>
              <S.DataContentGrid>
                <PrimaryInput label="Nome" name="name" />
                <PrimaryInput
                  label="CPF"
                  name="cpf"
                  onChange={e => setCpf(maskCPF(e.currentTarget.value))}
                  value={cpf}
                />
                <PrimaryInput label="Email" name="email" />
                <PrimaryInput
                  label="Telefone"
                  name="phone"
                  onChange={e => setPhone(maskPhone(e.currentTarget.value))}
                  value={phone}
                />
                <SelectInput
                  label="Permissão"
                  name="userType"
                  options={userType}
                />
                <SwitchButton
                  value={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </S.DataContentGrid>
              <S.Footer>
                <QuintenaryButton label="Salvar" loading={isLoadingData} />
              </S.Footer>
            </S.DataContentWrapper>
          </S.Content>
        </Form>

        <Form onSubmit={confirmUpdatePassword} ref={formRefEditPassword}>
          <S.DataTitle>
            <h5>Redefenir senha</h5>
          </S.DataTitle>
          <S.DataContentWrapper>
            <S.DataContentGrid>
              {!generatePassword && (
                <>
                  <PasswordInput
                    name="newPassword"
                    label="Nova Senha"
                    toggle={() => setPassVisible(!passVisible)}
                    visible={passVisible}
                  />
                  <PasswordInput
                    label="Confirme a nova senha"
                    name="confirmPassword"
                    toggle={() => setPassVisible(!passVisible)}
                    visible={passVisible}
                  />
                </>
              )}
            </S.DataContentGrid>
            <S.CheckboxWrapper>
              <Checkbox
                label="Gerar senha automática"
                checked={generatePassword}
                onChange={() => setGeneratePassword(!generatePassword)}
              />
            </S.CheckboxWrapper>
            <S.Footer>
              <QuintenaryButton label="Redefinir" loading={isLoadingPass} />
            </S.Footer>
          </S.DataContentWrapper>
        </Form>
      </S.Container>
      <Modal
        size="extrasmall"
        title="Realmente deseja redefinir a senha?"
        visible={isModal}
        onClose={() => setIsModal(false)}
      >
        <S.WrapperButton>
          <QuintenaryButton
            label="Sim"
            loading={isLoadingPass}
            onClick={() => validatePasswordEdit(dataForm)}
          />
          <QuintenaryButton
            label="Não"
            loading={isLoadingPass}
            onClick={() => setIsModal(false)}
          />
        </S.WrapperButton>
      </Modal>
    </Layout>
  )
}

export default ManagerUsers
