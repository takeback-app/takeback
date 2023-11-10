import React from 'react'
import { IconType } from 'react-icons/lib'

import { Container } from './styles'
import Loader from './SecondaryLoader'

interface Props {
  label?: string
  // eslint-disable-next-line
  icon?: IconType
  color?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  loading?: boolean
  noFullWidth?: boolean
  onClick?: () => void
}

const QuartenaryButton: React.FC<React.PropsWithChildren<Props>> = props => (
  <Container
    color={props.color}
    onClick={props.onClick}
    type={props.type}
    disabled={props.loading}
    noFullWidth={props.noFullWidth}
  >
    {props.loading ? (
      <Loader color={props.color} />
    ) : (
      <>
        {props.icon && <props.icon />} {props.label}
      </>
    )}
  </Container>
)

export default QuartenaryButton
