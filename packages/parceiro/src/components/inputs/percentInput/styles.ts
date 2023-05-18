import styled from 'styled-components'

interface Props {
  marginLeft?: string
}

export const Container = styled.div<Props>`
  position: relative;
  margin-left: ${props => props.marginLeft};

  @media (max-width: 450px) {
    margin-left: 0;
  }
`
export const Input = styled.input<Props>`
  width: 3rem;
  font-family: 'Inter';
  border: 1px solid ${props => props.theme.colors['gray-300']};
  border-radius: 5px;
  text-align: center;
  margin: 0 0.2rem 0 1rem;
  color: ${props => props.theme.colors['blue-600']};
`
export const Label = styled.label`
  font-family: 'Inter';
  font-size: 0.8rem;
  color: ${props => props.theme.colors['gray-700']};
`
