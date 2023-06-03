import React from 'react'

import useSWR from 'swr'

import * as S from './styles'
import Layout from '../../components/ui/Layout/Layout'
import { RepresentativeUsers } from '../../types/TRepresentativeUsers'
import { CreateRepresentativeUserModalButton } from './components/CreateRepresentativeUserModalButton'
import { EditRepresentativeUserModalButton } from './components/EditRepresentativeUserModalButton'
import { ConfirmDeleteModalButton } from './components/ConfirmDeleteModalButton'

const roleText = {
  ADMIN: 'Administrador',
  CONSULTANT: 'Consultor'
}

export function Users() {
  const { data: representativeUsers } = useSWR<RepresentativeUsers[]>(
    '/representative/consultants'
  )

  return (
    <Layout title="Consultores">
      <S.Container>
        <S.SubHeader>
          <CreateRepresentativeUserModalButton />
        </S.SubHeader>
        <S.Table>
          <S.THead>
            <S.Tr>
              <S.Th>Nome</S.Th>
              <S.Th>CPF</S.Th>
              <S.Th>Perfil</S.Th>
              <S.Th>&nbsp;</S.Th>
            </S.Tr>
          </S.THead>
          <S.TBody>
            {representativeUsers?.map((item, index) => (
              <S.Tr key={index}>
                <S.Td>{item.name}</S.Td>
                <S.Td>{item.cpf}</S.Td>
                <S.Td>{roleText[item.role]}</S.Td>
                <S.Td>
                  <S.ButtonWrapper>
                    <EditRepresentativeUserModalButton user={item} />

                    <ConfirmDeleteModalButton userId={item.id} />
                  </S.ButtonWrapper>
                </S.Td>
              </S.Tr>
            ))}
          </S.TBody>
        </S.Table>
      </S.Container>
    </Layout>
  )
}
