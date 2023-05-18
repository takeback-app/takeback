import styled from 'styled-components'
import { MdOutlineClose } from 'react-icons/md'

interface Props {
  size?: string
  isOpen?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 100vh;
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  overflow-y: hidden;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
`
export const Content = styled.div<Props>`
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  background-color: #fff;
  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 2rem 0.5rem;
  }
`
export const Header = styled.div<Props>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const Title = styled.h4`
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => props.theme.colors['slate-600']};
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`
export const CloseIcon = styled(MdOutlineClose)`
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props => props.theme.colors['slate-600']};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`
export const Main = styled.div<Props>`
  width: 100%;
  padding: 0 1rem;
`
export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`
export const Label = styled.label`
  font-family: 'Inter';
  font-size: 0.8rem;
  color: ${props => props.theme.colors['gray-700']};
`
export const Input = styled.input.attrs({
  type: 'string'
})`
  font-family: 'Inter';
  border: 1px solid ${props => props.theme.colors['gray-300']};
  border-radius: 5px;
  text-align: center;
  margin: 0 0.2rem 0 1rem;
  color: ${props => props.theme.colors['blue-600']};
`
