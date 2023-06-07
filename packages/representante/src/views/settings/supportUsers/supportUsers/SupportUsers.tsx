/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect, useRef } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { IoAddCircleOutline, IoCreateOutline } from 'react-icons/io5'

import { API } from '../../../../services/API'
import { CUser } from '../../../../contexts/CUser'

import Layout from '../../../../components/ui/Layout'
import PrimaryLoader from '../../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../../components/ui/Toastify'

import DefaultModal from '../../../../components/modals/DefaultModal'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import QuintenaryButton from '../../../../components/buttons/QuintenaryButton'
import { maskCPF } from '../../../../utils/masks'
import { TSupportUser } from '../../../../types/TSupportUser'
import PasswordInput from '../../../../components/inputs/PasswordInput'
import SelectInput from '../../../../components/inputs/SelectInput'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'

const statusOptions = [
  { id: 0, description: 'Ativo' },
  { id: 1, description: 'Inativo' }
]

const SupportUsers: React.FC<React.PropsWithChildren<unknown>> = () => {
  const registerRef = useRef<FormHandles>(null)
  const updateRef = useRef<FormHandles>(null)
  const { supportUsers, setSupportUsers } = useContext(CUser)

  const [registerVisible, setRegisterVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const [userCpf, setUserCpf] = useState('')
  const [visible, setVisible] = useState(false)

  function toggle() {
    setVisible(!visible)
  }

  const closeUpdateModal = () => {
    setUserCpf('')
    setUpdateVisible(false)
  }

  const handleFill = (supportUser: TSupportUser) => {
    updateRef.current?.setData({
      name: supportUser.name,
      mail: supportUser.mail,
      isActive: supportUser.isActive ? '0' : '1'
    })
    setUserCpf(maskCPF(supportUser.cpf || '00000000000'))
    setUserId(supportUser.id)
    setUpdateVisible(true)
  }

  const validateAndRegisterUser = async (data: TSupportUser) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3).required('Informe o nome'),
        cpf: Yup.string().min(11).required('Informe o cpf'),
        mail: Yup.string().min(3).required('Informe o email'),
        password: Yup.string().min(3).required('Informe a senha')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.post('/manager/support/register', {
        name: data.name,
        cpf: userCpf.replace(/[^\d]/g, ''),
        mail: data.mail,
        password: data.password
      })
        .then(response => {
          notifySuccess(response.data.message)
          setSupportUsers(response.data.users)
          setRegisterVisible(false)
          setUserCpf('')
          registerRef.current?.reset()
        })
        .catch(error => {
          if (error.isAxiosError) {
            notifyError(error.response.data.message)
          }
        })
        .finally(() => {
          setLoadingButton(false)
          registerRef.current?.setErrors({})
        })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        registerRef.current?.setErrors(validationErros)
      }
    }
  }

  const validateAndUpdateUser = async (data: TSupportUser) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3).required('Informe o nome'),
        cpf: Yup.string().min(11).required('Informe o cpf'),
        mail: Yup.string().min(3).required('Informe o email')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.put(`/manager/support/update/${userId}`, {
        name: data.name,
        cpf: userCpf.replace(/[^\d]/g, ''),
        mail: data.mail,
        password: data.password,
        isActive: data.isActive
      })
        .then(response => {
          notifySuccess(response.data.message)
          setSupportUsers(response.data.users)
          setUpdateVisible(false)
          setUserCpf('')
          updateRef.current?.reset()
        })
        .catch(error => {
          if (error.isAxiosError) {
            notifyError(error.response.data.message)
          }
        })
        .finally(() => {
          setLoadingButton(false)
          updateRef.current?.setErrors({})
        })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        updateRef.current?.setErrors(validationErros)
      }
    }
  }

  const findUser = () => {
    setLoading(true)
    API.get('/manager/support/find/all')
      .then((response: any) => {
        setSupportUsers(response.data)
        setLoading(false)
      })
      .catch((error: any) => {
        notifyError(error.response.data.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    findUser()
  }, [])

  return (
    <Layout title="Suportes">
      {loading ? (
        <PrimaryLoader label="Carregando usuários..." />
      ) : (
        <S.Container>
          <S.SubHeader>
            <QuartenaryButton
              label="Adicionar"
              icon={IoAddCircleOutline}
              color={PALLET.COLOR_06}
              onClick={() => setRegisterVisible(true)}
            />
          </S.SubHeader>

          <S.Table>
            <S.THead>
              <S.Tr>
                <S.Th>Nome</S.Th>
                <S.Th>CPF</S.Th>
                <S.Th>Email</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>&nbsp;</S.Th>
              </S.Tr>
            </S.THead>
            <S.TBody>
              {supportUsers.map(suppportUser => (
                <S.Tr key={suppportUser.id}>
                  <S.Td>{suppportUser.name}</S.Td>
                  <S.Td>{suppportUser.cpf}</S.Td>
                  <S.Td>{suppportUser.mail}</S.Td>
                  <S.Td>{suppportUser.isActive ? 'Ativo' : 'Inativo'}</S.Td>
                  <S.Td>
                    <IoCreateOutline
                      size={20}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFill(suppportUser)}
                    />
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>
        </S.Container>
      )}

      <DefaultModal
        title="Cadastrar usuário suporte"
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
      >
        <Form ref={registerRef} onSubmit={validateAndRegisterUser}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Nome" name="name" />
              <PrimaryInput label="Email" name="mail" />
              <PrimaryInput
                label="CPF"
                name="cpf"
                value={userCpf}
                onChange={e => setUserCpf(maskCPF(e.currentTarget.value))}
              />
              <PasswordInput
                label="Senha"
                name="password"
                toggle={toggle}
                visible={visible}
              />
            </S.InputsWrapper>

            <S.FooterModal>
              <QuintenaryButton label="Cadastrar" loading={loadingButton} />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        title="Editar usuário suporte"
        visible={updateVisible}
        onClose={closeUpdateModal}
      >
        <Form ref={updateRef} onSubmit={validateAndUpdateUser}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Nome" name="name" />
              <PrimaryInput label="Email" name="mail" />
              <PrimaryInput
                label="CPF"
                name="cpf"
                value={userCpf}
                onChange={e => setUserCpf(maskCPF(e.currentTarget.value))}
              />
              <PasswordInput
                label="Senha"
                name="password"
                toggle={toggle}
                visible={visible}
              />
              <SelectInput
                label="Status"
                name="isActive"
                options={statusOptions}
              />
            </S.InputsWrapper>

            <S.FooterModal>
              <QuintenaryButton label="Atualizar" loading={loadingButton} />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <Toastify />
    </Layout>
  )
}

export default SupportUsers
