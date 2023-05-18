import styled from 'styled-components'

interface Props {
  error?: boolean | string
}

export const Container = styled.div<Props>`
  width: 100%;
  display: flex;
  position: relative;
  padding-top: 1rem;
  margin-top: 0.6rem;
`
export const Input = styled.input<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: 1.875rem;
  font-size: 0.9rem;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -webkit-appearance: none;
  border-radius: 0;
  background-color: transparent;
  border-bottom: 1px solid
    ${props =>
      props.error
        ? props.theme.colors['red-400']
        : props.theme.colors['slate-300']};
  color: ${props =>
    props.error
      ? props.theme.colors['red-400']
      : props.theme.colors['slate-600']};
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;

  :focus + label,
  :not(:placeholder-shown) + label {
    margin-top: 0;
  }
`
export const Label = styled.label<Props>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 23px;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  font-weight: 500;
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  color: ${props =>
    props.error
      ? props.theme.colors['red-400']
      : props.theme.colors['slate-300']};
`
export const VisiblePassWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`
