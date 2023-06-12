import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  color?: string
}

export const Container = styled.button`
  width: auto;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 0 1rem;
  background-color: #fff;
  transition: all 200ms;
  border: 1px solid rgba(186, 186, 186, 0.3);

  :hover {
    -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  }
`
export const IconWrapper = styled.div<Props>`
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  position: relative;
  background-color: ${props => props.color}50;
`
export const Label = styled.h6`
  font-family: 'Inter';
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 0.5rem;
  cursor: pointer;
  color: ${PALLET.COLOR_11};
  text-align: start;
`
