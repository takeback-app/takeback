import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback
} from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { IoCreateOutline, IoKeyOutline } from 'react-icons/io5'
import { useTheme } from 'styled-components'

import { API } from '../../../services/API'

import {
  CompanyUsersTypes,
  CompanyUserTypesTypes
} from '../../../types/CompanyUsersTypes'

import { DefaultModal } from '../../../components/modals/defaultModal'
import { Layout } from '../../../components/ui/layout'
import { SelectInput } from '../../../components/inputs/selectInput'
import { PrimaryInput } from '../../../components/inputs/primaryInput'
import { OutlinedButton } from '../../../components/buttons'
import { PasswordInput } from '../../../components/inputs/passwordInput'
import { maskCPF } from '../../../utils/masks'

import * as S from './styles'
import { AuthContext } from '../../../contexts/AuthContext'
import { useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'

interface UpdatePasswordFormProps {
  userName: string
  newPassword: string
  confirmNewPassword: string
}

const statusOptions = [
  { id: 0, description: 'Ativo' },
  { id: 1, description: 'Inativo' }
]

export const Users: React.FC = () => {
  const formRefRegisterUser = useRef<FormHandles>(null)
  const formRefUpdateUser = useRef<FormHandles>(null)
  const formRefUpdateUserPassword = useRef<FormHandles>(null)
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const authUser = useContext(AuthContext)

  const [companyUsers, setCompanyUsers] = useState<[CompanyUsersTypes]>()
  const [companyUsersOffice, setCompanyUsersOffice] =
    useState<[CompanyUserTypesTypes]>()
  const [editVisible, setEditVisible] = useState(false)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [isManagerUser, setIsManagerUser] = useState(true)
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false)
  const [cpf, setCpf] = useState('')

  const findCompanyUsers = useCallback(() => {
    API.get('/company/user/find')
      .then(response => {
        setCompanyUsers(response.data.users)
        setCompanyUsersOffice(response.data.userTypes)
      })
      .catch(error => {
        toast({
          title: 'Ops :(',
          description: error.response.data.message,
          status: 'error'
        })
      })
  }, [toast])

  const openEdit = (item: CompanyUsersTypes) => {
    setEditVisible(true)
    formRefUpdateUser.current?.setData({
      name: item.name,
      office: item.companyUserType.id,
      email: item.email,
      status: item.isActive ? 0 : 1,
      cpf: maskCPF(item.cpf || '')
    })

    if (item.isRootUser) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }

    if (item.companyUserType.isManager) {
      setIsManagerUser(true)
    } else {
      setIsManagerUser(false)
    }

    setUserId(item.id)
    setCpf(maskCPF(item.cpf || ''))
  }

  const onCancel = () => {
    setEditVisible(false)
    setRegisterVisible(false)
    setIsManagerUser(true)
  }

  function toggle() {
    setVisible(!visible)
  }

  function verifyUserType(type: string) {
    if (type === '1') {
      setIsManagerUser(true)
    } else if (type === '2') {
      setIsManagerUser(false)
    }
  }

  const openModalUpdatePassword = (item: CompanyUsersTypes) => {
    setModalPasswordVisible(true)
    setUserId(item.id)
    setUserName(item.name)

    formRefUpdateUserPassword.current?.reset()
  }

  async function validateDataToUpdate(data: {
    name: string
    email: string
    office: string
    status: string
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
        return toast({
          title: 'Atenção!',
          description: 'Informe o email',
          status: 'warning'
        })
      }

      if (isManagerUser && !data.cpf) {
        return toast({
          title: 'Atenção!',
          description: 'Informe o cpf',
          status: 'warning'
        })
      }

      setLoading(true)
      API.put(`/company/user/update/${userId}`, {
        userTypeId: data.office,
        name: data.name.replace(/\s+$/, ''),
        email: data.email?.replace(/\s/g, ''),
        isActive: data.status === '0',
        cpf: data.cpf.replace(/[^\d]/g, '')
      })
        .then(response => {
          toast({
            title: 'Sucesso!',
            description: response.data,
            status: 'success'
          })
          findCompanyUsers()
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
        .finally(() => {
          setLoading(false)
          onCancel()
        })

      formRefUpdateUser.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErrors: any = {}

        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })

        formRefUpdateUser.current?.setErrors(validationErrors)
      }
    }
  }

  async function validateDataToRegister(data: {
    userName: string
    password?: string
    confirmPassword?: string
    office: string
    email?: string
    cpf: string
  }) {
    try {
      const schema = Yup.object().shape({
        userName: Yup.string().min(4).required('Informe o nome')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      if (isManagerUser && !data.email) {
        return toast({
          title: 'Atenção!',
          description: 'Informe o email',
          status: 'warning'
        })
      }

      if (isManagerUser && !data.cpf) {
        return toast({
          title: 'Atenção!',
          description: 'Informe o cpf',
          status: 'warning'
        })
      }

      if (!isManagerUser && !data.password) {
        return toast({
          title: 'Atenção!',
          description: 'Informe a senha',
          status: 'warning'
        })
      }

      if (!isManagerUser && !data.confirmPassword) {
        return toast({
          title: 'Atenção!',
          description: 'Confirme a senha',
          status: 'warning'
        })
      } else if (data.password !== data.confirmPassword) {
        return toast({
          title: 'Atenção!',
          description: 'Senhas divergentes',
          status: 'warning'
        })
      }

      setLoading(true)
      API.post('/company/user/register', {
        name: data.userName.replace(/\s+$/, ''),
        userTypeId: data.office,
        password: data.password?.replace(/\s/g, ''),
        email: data.email?.replace(/\s/g, ''),
        cpf: cpf.replace(/[^\d]/g, '')
      })
        .then(response => {
          toast({
            title: 'Sucesso!',
            description: response.data,
            status: 'success'
          })

          setRegisterVisible(false)
          findCompanyUsers()
          formRefRegisterUser.current?.reset()
          setCpf('')
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
        .finally(() => {
          setLoading(false)
          onCancel()
        })

      formRefRegisterUser.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErrors: any = {}

        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })

        formRefRegisterUser.current?.setErrors(validationErrors)
      }
    }
  }

  async function validateDataToUpdatePassword(data: UpdatePasswordFormProps) {
    try {
      const schema = Yup.object().shape({
        userName: Yup.string().min(4).required('Informe o nome do usuário'),
        newPassword: Yup.string().min(4).required('Informe sua nova senha!'),
        confirmNewPassword: Yup.string().oneOf(
          [Yup.ref('newPassword')],
          'Coloque uma senha compatível'
        )
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoading(true)
      API.put(`/company/user/password/update/root/${userId}`, {
        userName: data.userName,
        newPassword: data.newPassword.replace(/\s/g, ''),
        confirmNewPassword: data.confirmNewPassword.replace(/\s/g, '')
      })
        .then(response => {
          toast({
            title: 'Sucesso!',
            description: response.data.message,
            status: 'success'
          })
          setModalPasswordVisible(false)
          formRefUpdateUserPassword.current?.reset()
        })
        .catch(error => {
          toast({
            title: 'Ops :(',
            description: error.response.data.message,
            status: 'error'
          })
        })
        .finally(() => {
          setLoading(false)
        })

      formRefUpdateUserPassword.current?.setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // eslint-disable-next-line
        const validationErros: any = {}

        error.inner.forEach(err => {
          validationErros[err.path] = err.message
        })

        formRefUpdateUserPassword.current?.setErrors(validationErros)
      }
    }
  }

  const toggleRegisterVisible = () => {
    setCpf('')
    setIsManagerUser(true)
    formRefRegisterUser.current?.reset()
    setRegisterVisible(true)
  }

  useEffect(() => {
    findCompanyUsers()
  }, [findCompanyUsers])

  return (
    <Layout title="Usuários">
      <S.Container>
        <S.SubHeader>
          <OutlinedButton
            color={theme.colors['blue-600']}
            onClick={toggleRegisterVisible}
          >
            <span>Adicionar</span>
          </OutlinedButton>
        </S.SubHeader>
        <S.Table>
          <S.THead>
            <S.Tr>
              <S.Th>Nome</S.Th>
              <S.Th>Cargo</S.Th>
              <S.Th>Status</S.Th>
              <S.Th>&nbsp;</S.Th>
            </S.Tr>
          </S.THead>
          <S.TBody>
            {companyUsers?.map((item, index) => (
              <S.Tr key={index}>
                <S.Td>{item.name}</S.Td>
                <S.Td>{item.companyUserType.description}</S.Td>
                <S.Td>{item.isActive ? 'Ativo' : 'Inativo'}</S.Td>
                <S.Td>
                  <S.ButtonWrapper>
                    {(authUser.isRootUser || !item.isRootUser) && (
                      <OutlinedButton
                        color={theme.colors['gray-600']}
                        style={{
                          height: 'auto',
                          padding: '0.46rem 0.8rem'
                        }}
                        onClick={() => openModalUpdatePassword(item)}
                      >
                        <IoKeyOutline />
                      </OutlinedButton>
                    )}
                    {(authUser.isRootUser || !item.isRootUser) && (
                      <OutlinedButton
                        color={theme.colors['gray-600']}
                        style={{
                          height: 'auto',
                          padding: '0.46rem 0.8rem'
                        }}
                        onClick={() => openEdit(item)}
                      >
                        <IoCreateOutline />
                      </OutlinedButton>
                    )}
                  </S.ButtonWrapper>
                </S.Td>
              </S.Tr>
            ))}
          </S.TBody>
        </S.Table>
      </S.Container>

      <DefaultModal title="Editar" visible={editVisible} onClose={onCancel}>
        <Form ref={formRefUpdateUser} onSubmit={validateDataToUpdate}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput name="name" label="Nome" />
              <SelectInput
                label="Função"
                name="office"
                disabled={!authUser.isManager}
                options={companyUsersOffice}
                onChange={e => verifyUserType(e.currentTarget.value)}
              />

              {isManagerUser && <PrimaryInput name="email" label="Email" />}
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
                disabled={disabled}
                options={statusOptions}
              />
            </S.InputsWrapper>

            <S.Footer>
              <OutlinedButton
                onClick={() => setRegisterVisible(false)}
                loading={loading}
                disabled={loading}
                color={theme.colors['blue-600']}
              >
                <span>Salvar</span>
              </OutlinedButton>
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        title="Cadastrar"
        visible={registerVisible}
        onClose={onCancel}
      >
        <Form ref={formRefRegisterUser} onSubmit={validateDataToRegister}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput name="userName" label="Nome" />
              <SelectInput
                label="Função"
                name="office"
                disabled={false}
                options={companyUsersOffice}
                onChange={e => verifyUserType(e.currentTarget.value)}
              />
              {isManagerUser && (
                <>
                  <PrimaryInput name="email" label="Email" />
                </>
              )}
              <PrimaryInput
                name="cpf"
                label="CPF"
                maxLength={14}
                value={cpf}
                onChange={e => setCpf(maskCPF(e.currentTarget.value))}
              />
              {!isManagerUser && (
                <>
                  <PasswordInput
                    name="password"
                    label="Senha"
                    toggle={toggle}
                    visible={visible}
                  />
                  <PasswordInput
                    name="confirmPassword"
                    label="Confirme a senha"
                    toggle={toggle}
                    visible={visible}
                  />
                </>
              )}
            </S.InputsWrapper>
            <S.Footer>
              <OutlinedButton type="submit" color={theme.colors['blue-600']}>
                <span>Salvar</span>
              </OutlinedButton>
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        title="Redefinir senha"
        visible={modalPasswordVisible}
        onClose={() => setModalPasswordVisible(false)}
      >
        <Form
          ref={formRefUpdateUserPassword}
          onSubmit={validateDataToUpdatePassword}
          style={{ width: '100%' }}
        >
          <S.ModalContent>
            <PrimaryInput
              name="userName"
              label="Confirme o nome do usuário"
              value={userName}
              readOnly
            />
            <S.InputsWrapper>
              <PasswordInput
                name="newPassword"
                label="Nova senha"
                toggle={toggle}
                visible={visible}
              />
              <PasswordInput
                name="confirmNewPassword"
                label="Confirme a nova senha"
                toggle={toggle}
                visible={visible}
              />
            </S.InputsWrapper>
            <S.Footer>
              <OutlinedButton
                color={theme.colors['blue-600']}
                loading={loading}
                disabled={loading}
              >
                <span>Salvar</span>
              </OutlinedButton>
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>
    </Layout>
  )
}
