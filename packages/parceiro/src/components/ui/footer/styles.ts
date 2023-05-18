import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.footer`
  height: 8vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  background-color: ${props => props.theme.colors['white-100']};
`
export const HelpLink = styled(Link)`
  font-family: 'Inter';
  font-size: 0.7rem;
  font-weight: bold;
  text-decoration: none;
  color: ${props => props.theme.colors['blue-600']};
`
export const DesenCoder = styled.a`
  font-family: 'Inter';
  font-size: 0.7rem;
  font-weight: bold;
  text-decoration: none;
  color: ${props => props.theme.colors['slate-600']};
`
