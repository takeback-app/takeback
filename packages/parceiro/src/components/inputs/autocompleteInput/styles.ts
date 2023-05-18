import styled from 'styled-components'

interface Props {
  error?: boolean | string
  marginLeft?: string
  disabled?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  padding-top: 1rem;
  margin-top: 0.6rem;
  margin-left: ${props => props.marginLeft};

  @media (max-width: 450px) {
    margin-left: 0;
  }
`

export const InputContainer = styled.div<Props>`
  position: relative;
`

export const Autocomplete = styled.input<Props>`
  border: 0;
  outline: none;
  width: 100%;
  height: 1.7rem;
  font-size: 0.8rem;
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
      : props.disabled
      ? props.theme.colors['slate-300']
      : props.theme.colors['slate-600']};
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;

  &:focus {
    border-bottom: 1px solid
      ${props =>
        props.disabled
          ? props.theme.colors['slate-300']
          : props.theme.colors['slate-600']};
  }

  @media (max-width: 450px) {
    font-size: 1rem;
    height: 2rem;
  }
`

export const Label = styled.label<Props>`
  pointer-events: none;
  top: 0;
  left: 0;
  margin-top: 23px;
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${props =>
    props.error
      ? props.theme.colors['red-400']
      : props.theme.colors['slate-300']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`

export const OptionsContainer = styled.div<Props>`
  background-color: ${props => props.theme.colors['white-100']};
  padding: 0.5rem 0.2rem;

  width: 100%;
  left: 0;

  top: calc(100% + 0.25rem);
  position: absolute !important;

  border-radius: 0.3rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  max-height: 10rem;
  overflow-y: auto;
`

export const Option = styled.div<Props>`
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  overflow: hidden;

  :hover {
    background-color: ${props => props.color ?? '#BEE3F8'};
  }
`
