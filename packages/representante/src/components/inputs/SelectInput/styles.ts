import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  disabled?: boolean
}

export const Container = styled.div`
  width: 100%;
  position: relative;
  padding-top: 0.25rem;
`
export const Select = styled.select<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: 1.5rem;
  font-size: 0.8rem;
  transition: all 0.2s ease-out;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  border-radius: 0;
  border-bottom: 1px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.disabled && PALLET.COLOR_11};
  font-family: 'Inter', sans-serif;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`
export const Option = styled.option`
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`
export const Label = styled.label`
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${PALLET.COLOR_01};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`
