import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  isActive?: boolean
}

export const Container = styled.div<Props>`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 10px;
`
export const Text = styled.h5<Props>`
  color: ${props => (props.isActive ? PALLET.COLOR_15 : '#FF2D00')};
`
