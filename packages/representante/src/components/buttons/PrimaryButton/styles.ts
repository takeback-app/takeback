import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  color1?: string
  color2?: string
  textColor?: string
  transform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana'
  border?: string
}

export const Container = styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: ${props => props.border};
  border-radius: 8px;
  padding: 12px 16px 12px 16px;
  background-color: ${PALLET.COLOR_06};
  background: ${props => `linear-gradient(
    180deg,
    ${props.color1} 0%,
    ${props.color2} 100%
    )`};
  transition: 200ms all;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: ${props => props.transform};
  color: ${props => props.textColor};
  cursor: pointer;

  :hover {
    opacity: 0.9;

    -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  }
`
