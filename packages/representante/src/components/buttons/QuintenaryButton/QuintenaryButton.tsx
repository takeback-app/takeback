import React from 'react'

import Loader from '../../loaders/secondaryLoader'

import { Container } from './styles'

interface Props {
  label: string
  onClick?: () => void
  loading?: boolean
  fullWidth?: boolean
}

const QuintenaryButton: React.FC<React.PropsWithChildren<Props>> = ({
  label,
  onClick,
  loading,
  fullWidth
}) => {
  return (
    <Container type="submit" onClick={onClick} fullWidth={fullWidth}>
      {loading ? <Loader /> : label}
    </Container>
  )
}

export default QuintenaryButton
