import styled from 'styled-components'

export const Container = styled.main`
  padding: 1rem;
  overflow: scroll;
  height: 100%;
`
export const Description = styled.p`
  color: ${props => props.theme.colors['gray-600']};
  font-size: 0.9rem;
  font-family: 'Inter';
  line-height: 1rem;
  margin-top: 0.5rem;
`
export const Toggle = styled.button`
  margin-top: 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors['gray-600']};
  font-size: 0.9rem;
  padding: 8px 15px;
  color: #333;
`
