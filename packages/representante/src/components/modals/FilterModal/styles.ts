import styled from 'styled-components'
import { MdOutlineClose } from 'react-icons/md'
import PALLET from '../../../styles/ColorPallet'

interface Props {
  visible?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 100%;
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`
export const Content = styled.div<Props>`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  max-width: 360px;
  height: 100%;
  padding: 0.5rem 0 0 0;
  background-color: #fff;
  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    max-width: 100%;
    height: 100%;
    border-radius: 0;
  }
`
export const Header = styled.div<Props>`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  margin-top: 15px;
  margin-bottom: 15px;
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
  height: 100%;
`
