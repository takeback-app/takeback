import styled from 'styled-components'
import { Link as Lik } from 'react-router-dom'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 450px) {
    padding: 1rem 0;
  }
`
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  min-width: 350px;
  background-color: #fff;
  text-align: center;
  padding: 1rem;
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
export const Title = styled.h3`
  font-family: 'Inter';
  font-weight: bold;
  color: ${props => props.theme.colors['blue-600']};
  font-size: 1.4rem;
  position: relative;
  text-transform: uppercase;

  @media (max-width: 450px) {
    font-size: 1.6rem;
  }
`
export const SubTitle = styled.h4`
  text-align: center;
  margin-top: 15px;
  font-family: 'Inter';
  font-weight: bold;
`
export const Paragraph = styled.p`
  font-family: 'Inter';
  line-height: 1rem;
  text-align: center;
  margin-top: 20px;
`
export const Link = styled(Lik)`
  font-family: 'Inter';
  font-size: 1rem;
  font-weight: bold;
  color: ${props => props.theme.colors['blue-500']};
  position: absolute;
  top: 5%;
  left: 10%;
  display: flex;
  align-items: center;
  text-decoration: none;

  @media (max-width: 450px) {
    top: 3%;
    left: 5%;
  }
`
export const Footer = styled.div`
  margin-top: 0.6rem;
`
