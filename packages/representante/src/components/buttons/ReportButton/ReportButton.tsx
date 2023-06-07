import React from 'react'
import { SvgIconProps } from '@material-ui/core'

import { Container, IconWrapper, Label } from './styles'

interface Props {
  label: string
  icon: React.ComponentType<React.PropsWithChildren<SvgIconProps>>
  color: string
  onClick: () => void
}

const ReportButton: React.FC<React.PropsWithChildren<Props>> = ({
  color,
  icon: Icon,
  label,
  onClick
}) => {
  return (
    <Container onClick={onClick}>
      <IconWrapper color={color}>
        <Icon style={{ cursor: 'pointer', color: color, fontSize: '1.3rem' }} />
      </IconWrapper>
      <Label>{label}</Label>
    </Container>
  )
}

export default ReportButton
