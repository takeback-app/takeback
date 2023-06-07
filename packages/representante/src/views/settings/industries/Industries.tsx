import React, { useState, useRef, useEffect, useContext } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { IoAddCircleOutline, IoCreateOutline } from 'react-icons/io5'

import { API } from '../../../services/API'
import { CAppData } from '../../../contexts/CAppData'
import { TIndustry } from '../../../types/TIndustry'

import Layout from '../../../components/ui/Layout'
import PrimaryInput from '../../../components/inputs/PrimaryInput'
import QuartenaryButton from '../../../components/buttons/QuartenaryButton'
import QuintenaryButton from '../../../components/buttons/QuintenaryButton'
import DefaultModal from '../../../components/modals/DefaultModal'
import PrimaryLoader from '../../../components/loaders/primaryLoader'
import Toastify, {
  notifyError,
  notifySuccess
} from '../../../components/ui/Toastify'

import PALLET from '../../../styles/ColorPallet'
import * as S from './styles'

interface DataProps {
  description: string
  industryFee: number
}

const Industries: React.FC<React.PropsWithChildren<unknown>> = () => {
  const registerRef = useRef<FormHandles>(null)
  const updateRef = useRef<FormHandles>(null)

  const { industries, setIndustries } = useContext(CAppData)

  const [loadingButton, setloadingButton] = useState(false)
  const [industryId, setIndustryId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [registerVisible, setRegisterVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)

  const handleFill = (item: TIndustry) => {
    updateRef.current?.setData({
      description: item.description,
      industryFee: item.industryFee * 100
    })

    setIndustryId(item.id)
    setUpdateVisible(true)
  }

  async function validateRegister(data: DataProps) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().required('Informe o ramo de atividade'),
        industryFee: Yup.number().required('Informe a taxa')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setloadingButton(true)

      API.post('/manager/industry', data)
        .then(response => {
          notifySuccess(response.data.message)
          setIndustries(response.data.industries)
        })
        .catch(error => {
          notifyError(error.response.data.message)
        })
        .finally(() => {
          setloadingButton(false)
          setRegisterVisible(false)
        })

      registerRef.current?.setErrors({})
      registerRef.current?.reset()
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

  async function validateUpdate(data: DataProps) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string().required('Informe o ramo de atividade'),
        industryFee: Yup.number().required('Informe a taxa')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      setloadingButton(true)

      API.put(`/manager/industry/${industryId}`, {
        description: data.description,
        industryFee: data.industryFee
      })
        .then(response => {
          notifySuccess(response.data.message)
          setIndustries(response.data.industries)
        })
        .catch(error => {
          notifyError(error.response.data.message)
        })
        .finally(() => {
          setloadingButton(false)
          setUpdateVisible(false)
        })

      updateRef.current?.setErrors({})
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

  const findIndustries = () => {
    setLoading(true)
    API.get('/manager/industry/find')
      .then(response => {
        setIndustries(response.data)
      })
      .catch(error => {
        notifyError(error.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    findIndustries()
    // eslint-disable-next-line
  }, [])

  return (
    <Layout title="Ramos de atividade">
      {loading ? (
        <PrimaryLoader label="Carregando ramos de atividades..." />
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
                <S.Th>Id</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Valor da Taxa</S.Th>
                <S.Th>&nbsp;</S.Th>
              </S.Tr>
            </S.THead>
            <S.TBody>
              {industries.map(item => (
                <S.Tr key={item.id}>
                  <S.Td>{item.id}</S.Td>
                  <S.Td>{item.description}</S.Td>
                  <S.Td>
                    {Intl.NumberFormat('pt-BR', {
                      style: 'percent',
                      minimumFractionDigits: 1
                    }).format(item.industryFee)}
                  </S.Td>
                  <S.Td>
                    <IoCreateOutline
                      size={20}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFill(item)}
                    />
                  </S.Td>
                </S.Tr>
              ))}
            </S.TBody>
          </S.Table>
        </S.Container>
      )}

      <DefaultModal
        visible={registerVisible}
        size="small"
        title="Cadastrar"
        onClose={() => setRegisterVisible(false)}
      >
        <Form ref={registerRef} onSubmit={validateRegister}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Ramo de Atividade" name="description" />
              <PrimaryInput
                label="Taxa por transação"
                name="industryFee"
                type="string"
              />
            </S.InputsWrapper>

            <S.Footer>
              <QuintenaryButton label="Cadastrar" loading={loadingButton} />
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <DefaultModal
        visible={updateVisible}
        size="small"
        title="Atualizar"
        onClose={() => setUpdateVisible(false)}
      >
        <Form ref={updateRef} onSubmit={validateUpdate}>
          <S.ModalContent>
            <S.InputsWrapper>
              <PrimaryInput label="Ramo de Atividade" name="description" />
              <PrimaryInput
                label="Taxa por transação"
                name="industryFee"
                type="string"
              />
            </S.InputsWrapper>

            <S.Footer>
              <QuintenaryButton label="Atualizar" loading={loadingButton} />
            </S.Footer>
          </S.ModalContent>
        </Form>
      </DefaultModal>

      <Toastify />
    </Layout>
  )
}

export default Industries
