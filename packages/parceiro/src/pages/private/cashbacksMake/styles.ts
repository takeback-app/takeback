import styled from 'styled-components'
import Modal from 'react-modal'
import { IoAlertCircleOutline } from 'react-icons/io5'

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0.5rem;
  overflow: scroll;
  position: relative;
`
export const Card = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 0.8rem 0 0 0;
  background-color: #fff;
  margin-bottom: 20px;

  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
`
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #7070703e;
  padding: 0 1rem 0.5rem 1rem;
`
export const LabelCurrency = styled.label`
  display: flex;
  width: 25px;
  font-family: inter;
  font-size: 6;
  font-weight: 500;
`
export const RemoveButton = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: transparent;
  color: #ff6666;
  transition: 200ms all;

  :hover {
    color: red;
  }
`
export const CardMain = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: flex-end;
  padding: 0 1rem;

  @media (max-width: ${props => props.theme.breakpoints.lg}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.md}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}px) {
    display: flex;
    flex-direction: column;
  }

  ${CardHeader}:hover & {
    background-color: red;
  }
`
export const CardTitle = styled.h5`
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => props.theme.colors['gray-900']};
`

export const CardSubTitle = styled.h5`
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors['gray-900']};
`

export const TitleMobileWrapper = styled.div`
  display: none;

  @media (max-width: ${props => props.theme.breakpoints.sm}px) {
    width: 100%;
    display: flex;
    padding-right: 15px;
    padding-bottom: 15px;
    justify-content: flex-end;
  }
`
export const CardTitleToMobile = styled.h5`
  display: none;
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => (props.color ? props.color : '#333')};

  @media (max-width: ${props => props.theme.breakpoints.sm}px) {
    display: flex;
  }
`
export const CardTitleToWeb = styled.h5`
  display: flex;
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => (props.color ? props.color : '#333')};

  @media (max-width: ${props => props.theme.breakpoints.sm}px) {
    display: none;
  }
`
export const CardFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: ${props => props.theme.breakpoints.md}px) {
    width: 100%;
    justify-content: flex-end;
    padding-top: 1rem;
  }
`
export const ModalWrapper = styled(Modal)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`
export const ModalContent = styled.div`
  width: 30%;
  height: 30%;
  border-radius: 5px;
  padding: 0.8rem;
  background-color: #fff;

  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 1070px) {
    width: 90%;
  }
`
export const ModalHeader = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const OtherMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
export const CloseButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors['blue-700']};
  font-size: 1rem;
  font-weight: bold;
`
export const ProcessingText = styled.h6`
  font-size: 1rem;
  color: ${props => props.theme.colors['gray-700']};
`
export const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-weight: 700;
  color: #fff;
  gap: 1rem;
`
export const SubMessage = styled.h5`
  margin: 1rem;
  color: #fff;
  font-weight: 400;
  font-size: 9;
`
export const AlertIcon = styled(IoAlertCircleOutline)`
  font-size: 90px;
  color: #fff;
`
export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`
export const ContentModal = styled.div`
  position: relative;
  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    width: 100%;
    height: 85vh;
  }
`
export const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    bottom: 2rem;
  }
`
export const FooterTwoButton = styled.div`
  display: flex;
  margin-top: 30px;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
    bottom: 2rem;
    left: 0;
    padding: 1rem;
  }
`
export const Space = styled.div`
  height: 5vh;
`
