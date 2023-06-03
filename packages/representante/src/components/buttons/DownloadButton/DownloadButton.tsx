import React from 'react'
import { IconType } from 'react-icons'

import * as S from './styles'

interface Props {
  href?: string
  label?: string
  icon?: IconType
  title?: string
  color?: string
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
}

const DownloadButton: React.FC<React.PropsWithChildren<Props>> = props => {
  return props.disabled ? (
    <S.Container
      title={props.title}
      color={props.color}
      disabled={props.disabled}
    >
      <>
        {props.icon && <props.icon size="1.2rem" />}
        {props.label}
      </>
    </S.Container>
  ) : (
    <S.Container
      href={props.href}
      target="_blank"
      rel="noreferrer"
      download
      title={props.title}
      color={props.color}
      onClick={props.onClick}
    >
      <>
        {props.icon && <props.icon size="1.2rem" />}
        {props.label}
      </>
    </S.Container>
  )
}

export default DownloadButton
