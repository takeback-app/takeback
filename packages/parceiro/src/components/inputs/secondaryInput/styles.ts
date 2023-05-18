import styled from 'styled-components'

interface Props {
  error?: boolean | string
  marginLeft?: string
  disabled?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  position: relative;
  padding-top: 1rem;
  margin-top: 0.6rem;
  margin-left: ${props => props.marginLeft};

  @media (max-width: 450px) {
    margin-left: 0;
  }
`
export const Input = styled.input<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: 2rem;
  font-size: 0.8rem;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -webkit-appearance: none;
  border-radius: 4px;
  border: 1px solid
    ${props =>
      props.error
        ? props.theme.colors['red-400']
        : props.disabled
        ? props.theme.colors['gray-300']
        : '#cccccc'};
  color: ${props =>
    props.error
      ? props.theme.colors['red-400']
      : props.disabled
      ? props.theme.colors['gray-300']
      : props.theme.colors['slate-600']};
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;

  :focus + label,
  :not(:placeholder-shown) + label {
    margin-top: -5px;
    left: 0;
  }

  @media (max-width: 450px) {
    font-size: 1rem;
    height: 2rem;
  }
`
export const Label = styled.label<Props>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 10px;
  margin-top: 23px;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${props =>
    props.error
      ? props.theme.colors['red-400']
      : props.theme.colors['slate-600']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
