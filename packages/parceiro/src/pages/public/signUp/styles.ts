import styled from 'styled-components'
import { Link as Lik } from 'react-router-dom'

export const Container = styled.div`
  width: 100%;
  max-width: 2200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  padding: 5rem;

  @media (max-width: 560px) {
    padding: 1rem 0;
  }

  @media (max-width: 450px) {
    justify-content: flex-start;
  }
`
export const Card = styled.div`
  width: 45%;
  max-width: 600px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  text-align: center;
  align-self: flex-end;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;

  -webkit-box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -11px rgba(0, 0, 0, 0.75);

  @media (max-width: 1070px) {
    width: 90%;
    align-self: center;
    min-width: 280px;
  }

  @media (max-width: 450px) {
    width: 90%;
    height: 75vh;
    min-height: 75vh;
    min-width: 280px;
    margin-bottom: 15px;
    overflow: scroll;
  }
`
export const Title = styled.h3`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['blue-600']};
  font-size: 1.2rem;
  padding-top: 18px;

  @media (max-width: 450px) {
    font-size: 1.4rem;
  }
`
export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
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
  text-align: start;
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
export const InputOtherDirectionWrapper = styled.div`
  display: flex;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`
