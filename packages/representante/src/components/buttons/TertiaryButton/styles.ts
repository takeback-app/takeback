import styled from 'styled-components'

interface Props {
  color?: string
}

export const Container = styled.button<Props>`
  display: flex;
  padding: 0.5rem 1rem;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 5px;
  background-color: transparent;
  gap: 5px;
  color: ${props => props.color};

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`
