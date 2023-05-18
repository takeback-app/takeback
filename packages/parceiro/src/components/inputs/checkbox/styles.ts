import styled from 'styled-components'

export const Container = styled.div`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: start;
  padding: 0.3rem 0;
`
export const Input = styled.input`
  cursor: pointer;
`
export const Label = styled.label`
  font-family: 'Inter';
  font-size: 0.6rem;
  font-weight: 600;
  color: ${props => props.theme.colors['slate-300']};
  margin-left: 5px;
`
