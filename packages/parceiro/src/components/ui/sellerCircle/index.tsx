import React from 'react'

import { getInitials } from '../../../utils/GetInitials'
import { currencyFormat } from '../../../utils/currencyFormat'

import {
  Container,
  Content,
  Value,
  Initials,
  InfoWrapper,
  Label,
  Name
} from './styles'

interface Props {
  name: string
  value?: number
  office?: string
  status?: string
}

export const SellerCircle: React.FC<Props> = ({
  value,
  name,
  office,
  status
}) => {
  return (
    <Container directionRow={!!office}>
      <Content>
        <Initials>{getInitials(name)}</Initials>
      </Content>
      {office ? (
        <InfoWrapper>
          <Name>{name}</Name>
          <Label>
            {office}/{status}
          </Label>
        </InfoWrapper>
      ) : (
        <Value>{value && currencyFormat(value)}</Value>
      )}
    </Container>
  )
}
