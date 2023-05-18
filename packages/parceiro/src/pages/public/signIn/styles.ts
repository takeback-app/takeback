import styled from 'styled-components'
import { Link as Lik } from 'react-router-dom'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;

  @media (max-width: 450px) {
    justify-content: flex-start;
    padding: 1rem 0;
  }
`
export const Card = styled.div`
  width: 30%;
  max-width: 400px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  text-align: center;
  padding: 2.5rem 2rem;
  border-radius: 0.5rem;

  -webkit-box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);

  @media (max-width: 450px) {
    width: 90%;
    min-width: 280px;
    padding: 2rem 1rem;
  }
`
export const LogoBox = styled.div`
  display: flex;
  justify-content: center;
`
export const Logo = styled.img`
  width: 60%;
  margin-bottom: 26px;
`
export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const Paragraph = styled.p`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['slate-300']};
  margin-top: 1rem;
`
export const Link = styled(Lik)`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['blue-500']};
`
export const ForgotPass = styled(Link)`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['blue-500']};
  margin-top: 0.7rem;
`
export const ContentAnimation = styled.div`
  position: absolute;
  left: 0;
  bottom: -55px;

  @media (max-width: 1070px) {
    display: none;
  }
`
export const Terms = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  margin: 0;
  bottom: 0.2rem;

  @media (max-width: 1070px) {
    position: relative;
  }

  @media (max-width: 340px) {
    flex-direction: column;
  }
`
export const Term = styled(Lik)`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['slate-300']};
  text-decoration: none;
`
export const SmallCircle = styled.div`
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  margin: 0 0.3rem;
  background-color: ${props => props.theme.colors['blue-600']};
`
export const Footer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 15px;
  flex-direction: column;
  margin-top: 0.6rem;
`
