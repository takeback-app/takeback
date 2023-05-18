import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useRef, useState } from 'react'
import { IoCreateOutline } from 'react-icons/io5'
import * as Yup from 'yup'

import useSWR from 'swr'

import { API } from '../../../../../services/API'

import {
  CompanyUsersTypes,
  TCompanyUserTypes
} from '../../../../../types/TCompanyUsers'

import QuintenaryButton from '../../../../../components/buttons/QuintenaryButton'
import PrimaryInput from '../../../../../components/inputs/PrimaryInput'
import SelectInput from '../../../../../components/inputs/SelectInput'
import DefaultModal from '../../../../../components/modals/DefaultModal'
import Toaster, {
  notifyError,
  notifySuccess,
  notifyWarn
} from '../../../../../components/ui/Toastify'
import { maskCPF } from '../../../../../utils/masks'

import { AxiosError } from 'axios'
import SecondaryLoader from '../../../../../components/loaders/secondaryLoader'
import * as S from './styles'
import { Tag } from '@chakra-ui/react'

const statusOptions = [
  { id: 0, description: 'Ativo' },
  { id: 1, description: 'Inativo' }
]

const isRootUserOptions = [
  { id: 0, description: 'Não' },
  { id: 1, description: 'Sim' }
]

interface IUsersProps {
  companyId?: string
}

interface Response {
  users: CompanyUsersTypes[]
  userTypes: TCompanyUserTypes[]
}

export const Users: React.FC<IUsersProps> = ({ companyId }: IUsersProps) => {
  const formRefUpdateUser = useRef<FormHandles>(null)

  const [editVisible, setEditVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [isManagerUser, setIsManagerUser] = useState(true)
  const [cpf, setCpf] = useState('')

  const { data, isLoading, mutate } = useSWR<Response>(
    `manager/companies/${companyId}/users`
  )

  const openEdit = (item: CompanyUsersTypes) => {
    setEditVisible(true)

    formRefUpdateUser.current?.setData({
      name: item.name,
      office: item.companyUserType.id,
      email: item.email,
      isRootUser: item.isRootUser ? 1 : 0,
      status: item.isActive ? 0 : 1,
      cpf: maskCPF(item.cpf || '')
    })

    setIsManagerUser(!!item.companyUserType.isManager)

    setUserId(item.id)
    setCpf(maskCPF(item.cpf || ''))
  }

  const onCancel = () => {
    setEditVisible(false)
    setIsManagerUser(true)
  }

  async function validateDataToUpdate(data: {
    name: string
    email: string
    office: string
    status: string
    isRootUser: string
    cpf: string
  }) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(4).required('Informe o nome')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      if (isManagerUser && !data.email) {
        return notifyWarn('Informe o email')
      }

      if (isManagerUser && !data.cpf) {
        return notifyWarn('Informe o cpf')
      }

      setLoading(true)

      const response = await API.put(`/manager/company/user/update/${userId}`, {
        userTypeId: data.office,
        isRootUser: data.isRootUser === '1',
        name: data.name.replace(/\s+$/, ''),
        email: data.email?.replace(/\s/g, ''),
        isActive: data.status === '0',
        cpf: data.cpf.replace(/[^\d]/g, '')
      })

      await mutate()

      notifySuccess(response.data)
      setEditVisible(false)

      formRefUpdateUser.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErrors: any = {}

        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })

        return formRefUpdateUser.current?.setErrors(validationErrors)
      }

      const axiosError = error as AxiosError

      notifyError(
        axiosError.response?.data?.message || 'Contate um administrador'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <SecondaryLoader />
      </>
    )
  }

  return (
    <>
      <S.Table>
        <S.THead>
          <S.Tr>
            <S.Th>Nome</S.Th>
            <S.Th>Cargo</S.Th>
            <S.Th>Status</S.Th>
            <S.Th>Root</S.Th>
            <S.Th>&nbsp;</S.Th>
          </S.Tr>
        </S.THead>
        <S.TBody>
          {data?.users?.map((item, index) => (
            <S.Tr key={index}>
              <S.Td>{item.name}</S.Td>
              <S.Td>{item.companyUserType.description}</S.Td>
              <S.Td>{item.isActive ? 'Ativo' : 'Inativo'}</S.Td>
              <S.Td>
                <Tag
                  size="sm"
                  textTransform="none"
                  colorScheme={item.isRootUser ? 'green' : undefined}
                >
                  {item.isRootUser ? 'Sim' : 'Não'}
                </Tag>
              </S.Td>
              <S.Td>
                <S.ButtonWrapper>
                  <IoCreateOutline
                    size={20}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openEdit(item)}
                  />
                </S.ButtonWrapper>
              </S.Td>
            </S.Tr>
          ))}
        </S.TBody>
      </S.Table>

      <DefaultModal title="Editar" visible={editVisible} onClose={onCancel}>
        <Form ref={formRefUpdateUser} onSubmit={validateDataToUpdate}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput name="name" label="Nome" />
              <SelectInput
                label="Função"
                name="office"
                options={data?.userTypes ?? []}
              />
              <PrimaryInput name="email" label="Email" />
              <PrimaryInput
                name="cpf"
                label="CPF"
                maxLength={14}
                value={cpf}
                onChange={e => setCpf(maskCPF(e.currentTarget.value))}
              />
              <SelectInput
                label="Status"
                name="status"
                options={statusOptions}
              />
              {isManagerUser && (
                <SelectInput
                  label="Usuário Root"
                  name="isRootUser"
                  options={isRootUserOptions}
                />
              )}
            </S.InputsWrapper>

            <S.Footer>
              <QuintenaryButton loading={loading} label="Salvar" />
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <Toaster />
    </>
  )
}
