import styled from 'styled-components'

interface Props {
  error?: boolean | string
  isTextArea?: boolean
}

export const Container = styled.div<Props>`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 5px;
  padding: 2rem 0;
  border: none;
  border-radius: 5px;
  font-size: 0.5rem;
  transition: 200ms all;
  color: ${props => (props.error ? '#ff8080' : '#707070')};
`
export const Input = styled.input<Props>`
  width: 100%;
  height: 2.5rem;
  top: 40px;
  padding-left: 0.4rem;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  font-size: 0.8rem;
  color: ${props => (props.error ? '#ff8080' : '#707070')};
  background-color: ${props => (props.error ? '#ffe6e6' : '#FFFFFF')};
  transition: 200ms all;

  :hover {
    border: 1px solid #bfbfbf;
  }

  :focus {
    border: 1px solid #bfbfbf;
  }

  :focus + label,
  :not(:placeholder-shown) + label {
    margin-top: -10px;
    padding-left: 1px;
    font-size: 0.7rem;
    font-weight: 600;
    color: '#2E4765';
  }
`
export const TextArea = styled.textarea<Props>`
  width: 100%;
  height: 5rem;
  top: 40px;
  resize: none;
  font-size: 0.8rem;
  padding-left: 0.4rem;
  outline: none;
  line-height: 1.1rem;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  color: ${props => (props.error ? '#ff8080' : '#707070')};
  background-color: ${props => (props.error ? '#ffe6e6' : '#FFFFFF')};
  transition: 200ms all;

  -webkit-box-shadow: 1px 1px 5px 0px rgba(217, 217, 217, 1);
  -moz-box-shadow: 1px 1px 5px 0px rgba(217, 217, 217, 1);
  box-shadow: 1px 1px 5px 0px rgba(217, 217, 217, 1);

  :hover {
    border: 1px solid #bfbfbf;
  }

  :focus {
    border: 1px solid #bfbfbf;
  }

  :focus + label,
  :not(:placeholder-shown) + label {
    margin-top: -32px;
    padding-left: 1px;
    font-size: 0.7rem;
    font-weight: 600;
    color: '#2E4765';
  }
`
export const Label = styled.label<Props>`
  pointer-events: none;
  position: absolute;
  padding-left: 0.8rem;
  font-family: 'Inter';
  font-size: 0.8rem;
  top: 0;
  left: 0;
  margin-top: ${props => (props.isTextArea ? '0' : '23px')};
  transition: all 0.3s ease-out;
`
