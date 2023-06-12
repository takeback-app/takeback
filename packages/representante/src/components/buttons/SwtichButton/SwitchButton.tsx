import React from 'react'
import Switch from 'react-switch'

import * as S from './styles'

interface Props {
  value?: boolean
  disabled?: boolean
  onChange: () => void
}

const SwitchButton: React.FC<React.PropsWithChildren<Props>> = ({
  value = false,
  disabled,
  onChange
}) => {
  return (
    <S.Container>
      <Switch
        onChange={onChange}
        checked={value}
        onColor="#339966"
        offColor="#ff4d4d"
        disabled={disabled}
      />
      <S.Text isActive={value}>{value ? 'Ativo' : 'Inativo'}</S.Text>
    </S.Container>
  )
}

export default SwitchButton
