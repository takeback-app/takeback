import React from 'react'

import { Container } from './styles'

interface Props {
  label: string
  // eslint-disable-next-line
  Icon: any
  color?: string
  onClick?: () => void
}

const SecondaryButton: React.FC<React.PropsWithChildren<Props>> = ({ label, Icon, color, onClick }) => {
  return (
    <Container onClick={onClick} color={color}>
      <Icon />
      {label}
    </Container>
  )
}

export default SecondaryButton
