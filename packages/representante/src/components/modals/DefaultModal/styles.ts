import styled from 'styled-components'
import { MdOutlineClose } from 'react-icons/md'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  visible?: boolean
  size?: string
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 100%;
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
`
export const Content = styled.div<Props>`
  width: ${props => {
    if (props.size === 'extrasmall') {
      return 30
    } else if (props.size === 'small') {
      return 40
    } else if (props.size === 'medium') {
      return 50
    } else if (props.size === 'large') {
      return 60
    } else if (props.size === 'xLarge') {
      return 80
    }
  }}%;
  border-radius: 10px;
  padding: 0.5rem 0.8rem 0 0.8rem;
  background-color: #fff;
  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`
export const Header = styled.div<Props>`
  width: 100%;
  height: ${props => (props.size !== 'xLarge' ? 10 : 4)}%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const Title = styled.h4`
  font-size: 1rem;
  font-weight: bold;
  color: ${PALLET.COLOR_06};

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`
export const CloseIcon = styled(MdOutlineClose)`
  font-size: 1.2rem;
  cursor: pointer;
  color: ${PALLET.COLOR_06};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`
export const Main = styled.div<Props>`
  width: 100%;
  height: ${props => (props.size !== 'xLarge' ? 90 : 96)}%;
  padding: 0 0.5rem;
`
export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`
export const Label = styled.label`
  font-family: 'Inter';
  font-size: 0.8rem;
  color: ${PALLET.COLOR_10};
`
export const Input = styled.input.attrs({
  type: 'string'
})`
  font-family: 'Inter';
  border: 1px solid ${PALLET.COLOR_09};
  border-radius: 5px;
  text-align: center;
  margin: 0 0.2rem 0 1rem;
  color: ${PALLET.COLOR_02};
`
