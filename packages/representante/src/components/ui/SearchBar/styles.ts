import styled from 'styled-components'

export const Wrapper = styled.form`
  padding: 0;
  margin: 0;
  @media (max-width: 1024px) {
    width: 100%;
  }
`
export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 5px;
  gap: 5px;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  background: #fff;
  transition: 200ms all;

  :hover {
    border: 1px solid #bfbfbf;
  }

  @media (max-width: 1024px) {
    width: 100%;
    padding: 5px;
  }
`
export const Input = styled.input`
  border: none;
  background: transparent;
  font-size: 0.8rem;
  flex: 1;

  ::placeholder {
    color: #797979;
  }
`
export const Info = styled.h6`
  font-size: 0.6rem;
  font-weight: 300;
  color: #797979;
  margin-top: 2px;
  margin-left: 2px;
`
