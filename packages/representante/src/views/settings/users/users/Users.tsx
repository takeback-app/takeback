/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect, useRef } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { IoAddCircleOutline, IoCreateOutline } from 'react-icons/io5'

import { API } from '../../../../services/API'
import { CUser } from '../../../../contexts/CUser'
import { TUser } from '../../../../types/TUser'

import Layout from '../../../../components/ui/Layout'
import PrimaryLoader from '../../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as S from './styles'
import DefaultModal from '../../../../components/modals/DefaultModal'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import QuintenaryButton from '../../../../components/buttons/QuintenaryButton'
import SelectInput from '../../../../components/inputs/SelectInput'
import { maskCPF } from '../../../../utils/masks'

const statusOptions = [
  { id: 0, description: 'Ativo' },
  { id: 1, description: 'Inativo' }
]

const Team: React.FC<React.PropsWithChildren<unknown>> = () => {
  const registerRef = useRef<FormHandles>(null)
  const updateRef = useRef<FormHandles>(null)
  const { users, setUsers, userType, setUserType, setEndListUser } =
    useContext(CUser)

  const [registerVisible, setRegisterVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const [generatePassword, setGeneratePassword] = useState(false)
  const [userCpf, setUserCpf] = useState('')

  const closeUpdateModal = () => {
    setUserCpf('')
    setUpdateVisible(false)
  }

  const handleFill = (user: TUser) => {
    updateRef.current?.setData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType.id,
      isActive: user.isActive ? '0' : '1'
    })
    setUserCpf(maskCPF(user.cpf || '00000000000'))
    setUserId(user.id)
    setUpdateVisible(true)
  }

  const validateAndRegisterUser = async (data: TUser) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3).required('Informe o nome'),
        cpf: Yup.string().min(11).required('Informe o cpf'),
        email: Yup.string().min(3).required('Informe o email'),
        phone: Yup.string().min(3).required('Informe o telefone')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.post('/manager/user/register', {
        name: data.name,
        cpf: userCpf.replace(/[^\d]/g, ''),
        email: data.email,
        userTypeId: data.userType,
        phone: data.phone
      })
        .then(response => {
          notifySuccess(response.data.message)
          setUsers(response.data.users)
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

  const validateAndUpdateUser = async (data: TUser) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3).required('Informe o nome'),
        cpf: Yup.string().min(11).required('Informe o cpf'),
        email: Yup.string().min(3).required('Informe o email'),
        phone: Yup.string().min(3).required('Informe o telefone')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.put(`/manager/user/update/${userId}`, {
        name: data.name,
        cpf: userCpf.replace(/[^\d]/g, ''),
        email: data.email,
        password: data.password,
        userTypeId: data.userType,
        phone: data.phone,
        generatePassword,
        isActive: data.isActive
      })
        .then(response => {
          notifySuccess(response.data.message)
          setUsers(response.data.users)
          setUpdateVisible(false)
          setGeneratePassword(false)
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
    API.get('/manager/user/find/0/999')
      .then((response: any) => {
        setUsers(response.data)

        if (response.data.length < 12) {
          setEndListUser(true)
        }

        setLoading(false)
      })
      .catch((error: any) => {
        notifyError(error.response.data.message)
        setLoading(false)
      })
  }

  const findUserType = () => {
    API.get('/manager/user/types/find')
      .then((response: any) => {
        setUserType(response.data)
      })
      .catch((error: any) => {
        notifyError(error.response.data.message)
      })
  }

  useEffect(() => {
    findUser()

    if (userType.length === 0) {
      findUserType()
    }
  }, [])

  return (
    <Layout title="Usuários">
      {loading ? (
        <PrimaryLoader label="Carregando time..." />
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
                <S.Th>Permissão</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>&nbsp;</S.Th>
              </S.Tr>
            </S.THead>
            <S.TBody>
              {users.map(user => (
                <S.Tr key={user.id}>
                  <S.Td>{user.name}</S.Td>
                  <S.Td>{user.userType.description}</S.Td>
                  <S.Td>{user.isActive ? 'ATIVO' : 'INATIVO'}</S.Td>
                  <S.Td>
                    <IoCreateOutline
                      size={20}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFill(user)}
                    />
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>
        </S.Container>
      )}

      <DefaultModal
        title="Cadastrar usuário"
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
      >
        <Form ref={registerRef} onSubmit={validateAndRegisterUser}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Nome" name="name" />
              <PrimaryInput
                label="CPF"
                name="cpf"
                value={userCpf}
                onChange={e => setUserCpf(maskCPF(e.currentTarget.value))}
              />
              <PrimaryInput label="Email" name="email" />
              <PrimaryInput label="Telefone" name="phone" />
              <SelectInput label="Tipo" name="userType" options={userType} />
            </S.InputsWrapper>

            <S.FooterModal>
              <QuintenaryButton label="Cadastrar" loading={loadingButton} />
            </S.FooterModal>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        title="Editar usuário"
        visible={updateVisible}
        onClose={closeUpdateModal}
      >
        <Form ref={updateRef} onSubmit={validateAndUpdateUser}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Nome" name="name" />
              <PrimaryInput
                label="CPF"
                name="cpf"
                value={userCpf}
                onChange={e => setUserCpf(maskCPF(e.currentTarget.value))}
              />
              <PrimaryInput label="Email" name="email" />
              <PrimaryInput label="Telefone" name="phone" />
              <SelectInput label="Tipo" name="userType" options={userType} />
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

export default Team
