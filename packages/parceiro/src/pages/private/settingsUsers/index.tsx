import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo
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
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { chakraToastOptions } from '../../../components/ui/toast'
import { FiFilter } from 'react-icons/fi'
import { FilterDrawer } from './components/FilterDrawer'
import { useUserCompanyActivated } from './components/state'
import {
  Option,
  Select,
  Container,
  Label
} from '../../../components/inputs/selectInput/styles'

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
  const formRefUpdateUserPassword = useRef<FormHandles>(null)
  const theme = useTheme()
  const toast = useToast(chakraToastOptions)

  const authUser = useContext(AuthContext)

  const [allCompanyUsers, setAllCompanyUsers] = useState<CompanyUsersTypes[]>(
    []
  )
  const [companyUsersOffice, setCompanyUsersOffice] =
    useState<[CompanyUserTypesTypes]>()
  const [editVisible, setEditVisible] = useState(false)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [editCompanyUser, setEditCompanyUser] = useState({
    name: '',
    office: '',
    email: '',
    status: 0,
    cpf: ''
  })
  const [userName, setUserName] = useState('')
  const [isManagerUser, setIsManagerUser] = useState(true)
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false)
  const [cpf, setCpf] = useState('')
  const { type: typeFilter, setForm: setFilterForm } = useUserCompanyActivated()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const findCompanyUsers = useCallback(() => {
    API.get('/company/user/find')
      .then(response => {
        setAllCompanyUsers(response.data.users)
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
    setEditCompanyUser({
      cpf: maskCPF(item.cpf || ''),
      email: item.email,
      name: item.name,
      office: item.companyUserType.id,
      status: item.isActive ? 0 : 1
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

  async function validateDataToUpdate() {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(4).required('Informe o nome')
      })

      await schema.validate(editCompanyUser, {
        abortEarly: false
      })

      if (isManagerUser && !editCompanyUser.email) {
        return toast({
          title: 'Atenção!',
          description: 'Informe o email',
          status: 'warning'
        })
      }

      if (isManagerUser && !cpf) {
        return toast({
          title: 'Atenção!',
          description: 'Informe o cpf',
          status: 'warning'
        })
      }

      setLoading(true)
      API.put(`/company/user/update/${userId}`, {
        userTypeId: editCompanyUser.office,
        name: editCompanyUser.name.replace(/\s+$/, ''),
        email: editCompanyUser.email?.replace(/\s/g, ''),
        isActive: editCompanyUser.status === 0,
        cpf: cpf.replace(/[^\d]/g, '')
      })
        .then(response => {
          toast({
            title: 'Sucesso!',
            description: response.data,
            status: 'success'
          })
          setEditCompanyUser({
            cpf: '',
            email: '',
            name: '',
            office: '',
            status: 0
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
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        toast({
          title: 'Ops :(',
          description: error.message,
          status: 'error'
        })
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

  useEffect(() => {
    setFilterForm({ type: 'ACTIVATED' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const companyUsers = useMemo(() => {
    if (typeFilter === 'ALL') return allCompanyUsers

    return allCompanyUsers.filter(t => t.isActive)
  }, [allCompanyUsers, typeFilter])

  return (
    <Layout title="Usuários">
      <S.Container>
        <S.SubHeader>
          <Button leftIcon={<FiFilter />} onClick={onOpen} colorScheme="teal">
            Filtro
          </Button>
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
        <Form onSubmit={validateDataToUpdate}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput
                name="name"
                label="Nome"
                value={editCompanyUser.name}
                onChange={e => {
                  setEditCompanyUser({
                    ...editCompanyUser,
                    name: e.currentTarget.value
                  })
                }}
              />
              <Container>
                <Label>Função</Label>
                <Select
                  name="office"
                  disabled={!authUser.isManager}
                  onChange={e => {
                    verifyUserType(e.currentTarget.value)
                    setEditCompanyUser({
                      ...editCompanyUser,
                      office: e.currentTarget.value
                    })
                  }}
                >
                  {companyUsersOffice?.map(option => {
                    return (
                      <Option
                        key={option.id}
                        value={option.id}
                        selected={option.id === editCompanyUser.office}
                      >
                        {option.description}
                      </Option>
                    )
                  })}
                </Select>
              </Container>
              {isManagerUser && (
                <PrimaryInput
                  name="email"
                  label="Email"
                  value={editCompanyUser.email}
                  onChange={e => {
                    setEditCompanyUser({
                      ...editCompanyUser,
                      email: e.currentTarget.value
                    })
                  }}
                />
              )}
              <PrimaryInput
                name="cpf"
                label="CPF"
                maxLength={14}
                value={cpf}
                onChange={e => setCpf(maskCPF(e.currentTarget.value))}
              />
              <Container>
                <Label>Status</Label>
                <Select
                  name="status"
                  disabled={disabled}
                  onChange={e =>
                    setEditCompanyUser({
                      ...editCompanyUser,
                      status: +e.currentTarget.value
                    })
                  }
                >
                  {statusOptions?.map(option => {
                    return (
                      <Option
                        key={option.id}
                        value={option.id}
                        selected={+option.id === editCompanyUser.status}
                      >
                        {option.description}
                      </Option>
                    )
                  })}
                </Select>
              </Container>
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
      <FilterDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}
