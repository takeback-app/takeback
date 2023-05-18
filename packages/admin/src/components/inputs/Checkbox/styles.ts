import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

export const Container = styled.div`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: start;
  padding: 0.3rem 0;
`
export const Input = styled.input`
  cursor: pointer;
`
export const Label = styled.label`
  font-family: 'Inter';
  font-size: 0.7rem;
  font-weight: 600;
  color: ${PALLET.COLOR_01};
  margin-left: 5px;
`
