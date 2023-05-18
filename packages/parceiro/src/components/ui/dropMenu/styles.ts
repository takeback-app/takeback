import styled from 'styled-components'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import Modal from 'react-modal'

export const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
  background-color: transparent;

  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    padding: 0;
    background-color: ${props => props.theme.colors['white-300']};
  }
`
export const Label = styled.label`
  color: ${props => props.theme.colors['slate-600']};
  font-family: 'Inter';
  font-weight: bold;
  cursor: pointer;
  text-transform: capitalize;

  @media (max-width: 1024px) {
    display: none;
  }
`
export const Label2 = styled(Label)`
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
`
export const ArrowUp = styled(IoIosArrowUp)`
  color: ${props => props.theme.colors['slate-600']};
  margin-left: 0.2rem;

  @media (max-width: 1024px) {
    display: none;
  }
`
export const ArrowDown = styled(IoIosArrowDown)`
  color: ${props => props.theme.colors['slate-600']};
  margin-left: 0.2rem;

  @media (max-width: 1024px) {
    display: none;
  }
`
export const MenuWrapper = styled(Modal)`
  position: absolute;
  width: 20vw;
  min-width: 250px;
  display: flex;
  z-index: 999;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 2.5rem;
  right: 20px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  padding: 1rem 0.5rem;
  z-index: 99;
  background-color: #fff;
  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    top: 3.3rem;
  }
`
export const ModalWrapper = styled.div`
  display: flex;
  margin-top: 50%;
`
export const ProfileCircle = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  align-items: center;
  padding: 0;
  margin-bottom: 0.5rem;
  background-color: ${props => props.theme.colors['white-300']};
`
export const Initials = styled.h3`
  color: ${props => props.theme.colors['slate-600']};
  font-family: 'Inter';
  font-weight: bold;
`
export const FullName = styled.h3`
  font-size: 1rem;
  color: ${props => props.theme.colors['slate-600']};
  text-transform: capitalize;
`
export const Email = styled.h6`
  font-size: 0.7rem;
  font-weight: 400;
  color: ${props => props.theme.colors['gray-600']};
`
export const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors['gray-300']};
  transition: 200ms all;
  margin-top: 1rem;
  padding: 0.2rem 1rem;
  font-family: 'Inter';
  color: ${props => props.theme.colors['gray-600']};
  background-color: transparent;
  cursor: pointer;

  :hover {
    background-color: ${props => props.theme.colors['white-300']};
  }
`
export const OptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-top: 1px solid #eff3f5;
  border-bottom: 1px solid #eff3f5;
`
export const OptionsLabel = styled.label`
  text-align: center;
  font-family: 'Inter';
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`
export const Footer = styled.div`
  width: 100%;
  display: flex;
`
export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`
export const ModalContent = styled.div`
  position: relative;
  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 85vh;
  }
`
export const ModalFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 2rem;
    gap: 15px;
  }
`
export const LogoutButton = styled.button`
  height: 40px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  color: ${props => props.theme.colors['blue-500']};
  background: transparent;
  padding: 0 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  border: 0;

  transition: 0.2s;

  &:not(:disabled):hover {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
