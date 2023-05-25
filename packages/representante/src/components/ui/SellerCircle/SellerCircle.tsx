import React from 'react'

import { getInitials } from '../../../utils/GetInitials'

import {
  Container,
  Content,
  Initials,
  InfoWrapper,
  Label,
  Name,
  LabelWrapper
} from './styles'

interface Props {
  name?: string
  email?: string
  userType?: string
}

const SellerCircle: React.FC<React.PropsWithChildren<Props>> = ({ name, email, userType }) => {
  return (
    <Container>
      <Content>
        <Initials>{getInitials(name || '')}</Initials>
      </Content>

      <InfoWrapper>
        <Name>{name}</Name>
        <LabelWrapper>
          <Label>{email}</Label>
          <Label>{userType}</Label>
        </LabelWrapper>
      </InfoWrapper>
    </Container>
  )
}

export default SellerCircle
