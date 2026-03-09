import React, { useState, useEffect, useRef } from 'react'
import { IoAddCircleOutline, IoCreateOutline } from 'react-icons/io5'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import { API } from '../../../../services/API'

import Layout from '../../../../components/ui/Layout'
import PageLoader from '../../../../components/loaders/primaryLoader'
import QuartenaryButton from '../../../../components/buttons/QuartenaryButton'
import QuintenaryButton from '../../../../components/buttons/QuintenaryButton'
import DefaultModal from '../../../../components/modals/DefaultModal'
import PrimaryInput from '../../../../components/inputs/PrimaryInput'
import SelectInput from '../../../../components/inputs/SelectInput'
import { maskCPF } from '../../../../utils/masks'
import { percentFormat } from '../../../../utils/percentFormat'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../../components/ui/Toastify'

import PALLET from '../../../../styles/ColorPallet'
import * as Styles from './styles'

interface RepresentativesProps {
  cpf: string
  createdAt: string
  email: string
  gainPercentage: number
  id: string
  isActive: true
  name: string
  phone: string
  updatedAt: string
  whatsapp: string
}

const statusOptions = [
  { id: 0, description: 'Ativo' },
  { id: 1, description: 'Inativo' }
]

export default function Representatives(): JSX.Element {
  const registerRef = useRef<FormHandles>(null)
  const updateRef = useRef<FormHandles>(null)

  const [representatives, setRepresentatives] =
    React.useState<Array<RepresentativesProps>>()
  const [pageLoading, setPageLoading] = React.useState(true)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [userId, setUserId] = useState('')
  const [userCpf, setUserCpf] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)

  // eslint-disable-next-line
  const validateAndRegisterUser = async (data: any) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3).required('Informe o nome'),
        cpf: Yup.string().min(11).required('Informe o cpf'),
        email: Yup.string().min(3).required('Informe o email'),
        gainPercentage: Yup.number()
          .positive()
          .max(100)
          .required('Informe o percentual')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.post('/manager/representative/register', {
        name: data.name,
        cpf: userCpf.replace(/[^\d]/g, ''),
        email: data.email,
        whatsapp: data.whatsapp,
        phone: data.phone,
        gainPercentage: parseFloat(data.gainPercentage) / 100
      })
        .then(response => {
          notifySuccess(response.data.message)
          setRepresentatives(response.data.representatives)
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

  // eslint-disable-next-line
  const handleFill = (data: any) => {
    updateRef.current?.setData({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      gainPercentage: data.gainPercentage * 100,
      isActive: data.isActive ? '0' : '1'
    })
    setUserCpf(maskCPF(data.cpf || '00000000000'))
    setUserId(data.id)
    setUpdateVisible(true)
  }

  const closeUpdateModal = () => {
    setUserCpf('')
    setUpdateVisible(false)
  }

  // eslint-disable-next-line
  const validateAndUpdateUser = async (data: any) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().min(3).required('Informe o nome'),
        cpf: Yup.string().min(11).required('Informe o cpf'),
        email: Yup.string().min(3).required('Informe o email'),
        gainPercentage: Yup.number()
          .positive()
          .max(100)
          .required('Informe o percentual')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setLoadingButton(true)
      API.put(`/manager/representative/update`, {
        id: userId,
        name: data.name,
        cpf: data.cpf.replace(/[^\d]/g, ''),
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        gainPercentage: parseFloat(data.gainPercentage) / 100,
        isActive: data.isActive === '0'
      })
        .then(response => {
          notifySuccess(response.data.message)
          setRepresentatives(response.data.representatives)
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

  const toggleRegisterVisible = () => {
    setUserCpf('')
    setRegisterVisible(true)
  }

  function findRepresentatives() {
    API.get('/manager/representative/find')
      .then(res => {
        setRepresentatives(res.data)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  useEffect(() => {
    findRepresentatives()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout title="Representantes">
      {pageLoading ? (
        <PageLoader label="Carregando representantes" />
      ) : (
        <Styles.Container>
          <Styles.SubHeader>
            <QuartenaryButton
              label="Adicionar"
              icon={IoAddCircleOutline}
              color={PALLET.COLOR_06}
              onClick={toggleRegisterVisible}
            />
          </Styles.SubHeader>

          {representatives?.length === 0 ? (
            <Styles.NotItemsWrapper>
              <h4>Cadastre um representante</h4>
            </Styles.NotItemsWrapper>
          ) : (
            <Styles.Content>
              <Styles.Table>
                <Styles.THead>
                  <Styles.Tr>
                    <Styles.Th>Nome</Styles.Th>
                    <Styles.Th>CPF</Styles.Th>
                    <Styles.Th>email</Styles.Th>
                    <Styles.Th>Telefone</Styles.Th>
                    <Styles.Th>WhatsApp</Styles.Th>
                    <Styles.Th>Status</Styles.Th>
                    <Styles.Th>Percentual</Styles.Th>
                    <Styles.Th>Data de Cadastro</Styles.Th>
                    <Styles.Th>&nbsp;</Styles.Th>
                  </Styles.Tr>
                </Styles.THead>

                <Styles.TBody>
                  {representatives?.map(item => (
                    <Styles.Tr key={item.id}>
                      <Styles.Td>{item.name}</Styles.Td>
                      <Styles.Td>{maskCPF(item.cpf || '')}</Styles.Td>
                      <Styles.Td>{item.email}</Styles.Td>
                      <Styles.Td>{item.phone}</Styles.Td>
                      <Styles.Td>{item.whatsapp}</Styles.Td>
                      <Styles.Td>
                        {item.isActive ? 'Ativo' : 'Inativo'}
                      </Styles.Td>
                      <Styles.Td>
                        {percentFormat(item.gainPercentage)}
                      </Styles.Td>
                      <Styles.Td>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Styles.Td>
                      <Styles.Td>
                        <IoCreateOutline
                          size={20}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleFill(item)}
                        />
                      </Styles.Td>
                    </Styles.Tr>
                  ))}
                </Styles.TBody>
              </Styles.Table>
            </Styles.Content>
          )}
        </Styles.Container>
      )}

      <DefaultModal
        title="Cadastrar representante"
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
      >
        <Form ref={registerRef} onSubmit={validateAndRegisterUser}>
          <Styles.ModalContent>
            <Styles.InputsWrapper>
              <PrimaryInput label="Nome" name="name" />
              <PrimaryInput
                label="CPF"
                name="cpf"
                value={userCpf}
                onChange={e => setUserCpf(maskCPF(e.currentTarget.value))}
              />
              <PrimaryInput label="Email" name="email" />
              <PrimaryInput label="Telefone" name="phone" />
              <PrimaryInput label="WhatsApp" name="whatsapp" />
              <PrimaryInput
                label="Percentual"
                name="gainPercentage"
                type="string"
              />
            </Styles.InputsWrapper>

            <Styles.FooterModal>
              <QuintenaryButton label="Cadastrar" loading={loadingButton} />
            </Styles.FooterModal>
          </Styles.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        title="Editar representante"
        visible={updateVisible}
        onClose={closeUpdateModal}
      >
        <Form ref={updateRef} onSubmit={validateAndUpdateUser}>
          <Styles.ModalContent>
            <Styles.InputsWrapper>
              <PrimaryInput label="Nome" name="name" />
              <PrimaryInput
                label="CPF"
                name="cpf"
                value={userCpf}
                onChange={e => setUserCpf(maskCPF(e.currentTarget.value))}
              />
              <PrimaryInput label="Email" name="email" />
              <PrimaryInput label="Telefone" name="phone" />
              <PrimaryInput label="WhatsApp" name="whatsapp" />
              <PrimaryInput
                label="Percentual"
                name="gainPercentage"
                type="string"
              />
              <SelectInput
                label="Status"
                name="isActive"
                options={statusOptions}
              />
            </Styles.InputsWrapper>

            <Styles.FooterModal>
              <QuintenaryButton label="Atualizar" loading={loadingButton} />
            </Styles.FooterModal>
          </Styles.ModalContent>
        </Form>
      </DefaultModal>

      <Toastify />
    </Layout>
  )
}
