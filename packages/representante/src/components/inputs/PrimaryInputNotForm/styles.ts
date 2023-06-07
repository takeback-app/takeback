import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  error?: boolean | string
  disabled?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  position: relative;
  padding-top: 1rem;
  margin-top: 0.6rem;
`
export const Input = styled.input<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: 1.7rem;
  font-size: 0.8rem;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -webkit-appearance: none;
  border-radius: 0;
  background-color: transparent;
  border-bottom: 1px solid
    ${props => (props.error ? '#ff6666' : PALLET.COLOR_01)};
  color: ${props => (props.error ? '#ff6666' : '#2d3439')};
  color: ${props => props.disabled && PALLET.COLOR_09};
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;

  :focus + label,
  :not(:placeholder-shown) + label {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    height: 2rem;
  }
`
export const Label = styled.label<Props>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 23px;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${props => (props.error ? '#ff6666' : PALLET.COLOR_01)};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`
