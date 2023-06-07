import styled from 'styled-components'

export const Container = styled.div`
  padding: 1rem 0 0 0;

  @media (max-width: 450px) {
    border-top: 1px solid #e0e5eb;
  }
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;

  border-bottom: 1px solid #e6e6e6;
`
export const ContentConfim = styled(Content)`
  border-bottom: none;
`
export const Title = styled.h5``
export const Label = styled.h6`
  font-weight: 400;
`
export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`
export const CheckboxLabel = styled.h6`
  font-weight: 500;
`
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
`
