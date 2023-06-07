import styled from 'styled-components'

interface WidthProps {
  noFullWidth?: boolean
}

export const Container = styled.button<WidthProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: 200ms background-color;
  gap: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  height: 91%;

  color: ${props => props.color};
  border: 1px solid ${props => props.color}10;
  background-color: ${props => props.color}40;

  &:hover {
    color: ${props => props.color};
    border: 1px solid ${props => props.color}20;
    background-color: ${props => props.color}50;
  }

  @media (max-width: 768px) {
    width: ${props => (props.noFullWidth ? 'auto' : '100%')};
    font-size: 1.1rem;
    padding: 0.75rem 0.8rem;
  }
`
