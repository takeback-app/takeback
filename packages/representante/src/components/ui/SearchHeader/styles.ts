import styled from 'styled-components'
import { IoIosSearch, IoIosClose } from 'react-icons/io'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  open?: boolean
}

export const Container = styled.div<Props>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: ${props => (props.open ? 'absolute' : 'relative')};
  width: 100%;
  height: 100%;
  padding: 0 ${props => (props.open ? '1rem' : '0')};
  background-color: #fff;
  z-index: 2;
  top: 0;
  left: 0;
`
export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  font-family: 'Inter';
  font-size: 1rem;
  font-weight: 400;
  padding: 0 10px;
  color: ${PALLET.COLOR_16};
  transition: 200ms all;
`
export const SearchIcon = styled(IoIosSearch)`
  font-size: 1.2rem;
  cursor: pointer;
  color: ${PALLET.COLOR_10};
`
export const CloseIcon = styled(IoIosClose)`
  font-size: 1.4rem;
  cursor: pointer;
  color: ${PALLET.COLOR_10};
`
