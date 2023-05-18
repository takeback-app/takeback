import React from 'react'

import { Loader } from '../ui/loader'

import * as Styles from './styles'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

interface ButtonPropsExtended extends ButtonProps {
  loading?: boolean
  widthMobile?: 'auto' | 'full'
}

export function ButtonBlue(props: ButtonProps) {
  return <Styles.ButtonBlue {...props} />
}

export function OutlinedButton(props: ButtonPropsExtended) {
  return props.loading ? (
    <Styles.OutlinedButton {...props}>
      <Loader color={props.color} />
    </Styles.OutlinedButton>
  ) : (
    <Styles.OutlinedButton {...props} />
  )
}
