import styled from 'styled-components'
import { MdOutlineClose } from 'react-icons/md'

interface Props {
  visible?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 100%;
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
`
export const Content = styled.div`
  width: 40%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 0.8rem;
  background-color: #fff;
  position: relative;

  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 1070px) {
    width: 60%;
    height: 30%;
  }

  @media (max-width: 450px) {
    width: 90%;
    height: 20%;
  }
`
export const Main = styled.div`
  text-align: center;
  padding: 1rem 1rem 1.5rem 1rem;
`
export const Message = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: ${props => props.theme.colors['gray-700']};

  @media (max-width: 450px) {
    font-size: 0.8rem;
  }
`
export const CloseIcon = styled(MdOutlineClose)`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors['slate-600']};
  position: absolute;
  top: 10px;
  right: 10px;
`
