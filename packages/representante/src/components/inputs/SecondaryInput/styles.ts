import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  error?: boolean | string
  disabled?: boolean
}

export const Input = styled.input<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: 2rem;
  font-size: 0.8rem;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -webkit-appearance: none;
  border-radius: 4px;
  border: 1px solid
    ${props =>
      props.error ? '#ff6666' : props.disabled ? PALLET.COLOR_09 : '#cccccc'};
  color: ${props =>
    props.error
      ? '#ff6666'
      : props.disabled
      ? PALLET.COLOR_09
      : PALLET.COLOR_16};
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;

  @media (max-width: 450px) {
    font-size: 0.9rem;
    height: 2rem;
  }
`
