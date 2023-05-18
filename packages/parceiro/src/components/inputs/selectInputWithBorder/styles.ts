import styled from 'styled-components'

interface Props {
  error?: boolean | string
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  top: -7px;
  border: none;
  border-radius: 5px;
  font-size: 0.5rem;
  transition: 200ms all;
  color: ${props =>
    props.error
      ? props.theme.colors['red-400']
      : props.theme.colors['slate-600']};
`
export const Select = styled.select<Props>`
  width: 100%;
  height: 2.5rem;

  font-size: 0.85rem;
  outline: none;
  padding-left: 0.4rem;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props =>
    props.disabled
      ? props.theme.colors['gray-700']
      : props.theme.colors['gray-600']};

  :hover {
    border: 1px solid #bfbfbf;
  }
`
export const Option = styled.option`
  font-size: 0.85rem;
`
export const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Inter';
  color: ${props => props.theme.colors['gray-600']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
