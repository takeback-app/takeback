import React from 'react'
import Loader from '../../loaders/secondaryLoader'

import { Container } from './styles'

interface Props {
  label: string
  loading?: boolean
  color1?: string
  color2?: string
  textColor?: string
  transform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana'
  border?: string
  onClick?: () => void
}

const PrimaryButton: React.FC<React.PropsWithChildren<Props>> = ({
  label,
  loading,
  onClick,
  color1 = '#3A4D5C',
  color2 = '#3A4D5C',
  textColor = '#fff',
  transform = 'none',
  border = 'none'
}) => {
  return (
    <Container
      onClick={onClick}
      disabled={loading}
      color1={color1}
      color2={color2}
      border={border}
      textColor={textColor}
      transform={transform}
    >
      {loading ? <Loader color={textColor} /> : label}
    </Container>
  )
}

export default PrimaryButton
