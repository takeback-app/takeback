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
export const Content = styled.div`
  width: 80%;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  flex-direction: column;
  text-align: justify;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid #ccc;

  -webkit-box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
`
export const Title = styled.h3`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['blue-600']};
  font-size: 1.5rem;
  text-align: center;

  @media (max-width: 450px) {
    font-size: 1.8rem;
  }
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
  text-decoration: none;
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
