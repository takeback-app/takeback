import styled from 'styled-components'

interface Props {
  error?: boolean | string
  marginLeft?: string
  disabled?: boolean
}

export const Container = styled.div<Props>`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  padding-top: 1rem;
  margin-top: 0.6rem;
  margin-left: ${props => props.marginLeft};
  border-bottom: 1px solid
    ${props =>
      props.error
        ? '#ff6666'
        : props.disabled
        ? props.theme.colors['gray-300']
        : props.theme.colors['slate-600']};
  gap: 5px;
  justify-content: flex-end;
  @media (max-width: 450px) {
    margin-left: 0;
  }
`
export const LabelCurrency = styled.label`
  display: flex;
  width: 4%;
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  margin-right: 0.2rem;

  @media (max-width: 450px) {
    font-size: 1rem;
  }
`
export const Input = styled.input<Props>`
  border: 0;
  outline: none;
  width: ${props => props.width || 96}%;
  height: 1.7rem;
  font-size: 0.8rem;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -webkit-appearance: none;
  border-radius: 0;
  background-color: transparent;

  color: ${props =>
    props.error
      ? '#ff6666'
      : props.disabled
      ? props.theme.colors['gray-300']
      : props.theme.colors['slate-600']};
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;

  :focus + label,
  :not(:placeholder-shown) + label {
    margin-top: 0;
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
  margin-top: 23px;
  transition: all 0.3s ease-out;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${props =>
    props.error ? '#ff6666' : props.theme.colors['slate-300']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
