import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface WidthProps {
  fullWidth?: boolean
}

export const Container = styled.button<WidthProps>`
  display: flex;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${PALLET.COLOR_06};
  cursor: pointer;
  color: #fff;
  font-size: 0.8rem;
  padding: 8px 24px 8px 24px;

  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  &:hover {
    background-color: #344654;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`
