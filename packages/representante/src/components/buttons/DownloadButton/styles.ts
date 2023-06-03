import styled from 'styled-components'

interface Props {
  disabled?: boolean
}

export const Container = styled.a<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  text-decoration: none;
  font-family: poppins;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  color: ${props => (props.disabled ? '#797979' : props.color)};
  border: 1px solid ${props => (props.disabled ? '#797979' : props.color)}10;
  background-color: ${props => (props.disabled ? '#797979' : props.color)}40;

  &:hover {
    color: ${props => (props.disabled ? '#797979' : props.color)};
    border: 1px solid ${props => (props.disabled ? '#797979' : props.color)}20;
    background-color: ${props => (props.disabled ? '#797979' : props.color)}50;
  }
`
