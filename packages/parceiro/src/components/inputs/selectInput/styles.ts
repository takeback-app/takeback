import styled from 'styled-components'

interface Props {
  isLabel?: boolean
}

export const Container = styled.div`
  width: 100%;
  position: relative;
`
export const Select = styled.select<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: ${props => (props.isLabel ? '1.7rem' : '2.3rem')};
  border-radius: 0;
  border-bottom: 1px solid ${props => props.theme.colors['slate-300']};
  background-color: transparent;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${props =>
    props.disabled
      ? props.theme.colors['gray-300']
      : props.theme.colors['slate-600']};

  @media (max-width: 450px) {
    font-size: 1rem;
  }
`
export const Option = styled.option`
  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
export const Label = styled.label`
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${props => props.theme.colors['slate-300']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
