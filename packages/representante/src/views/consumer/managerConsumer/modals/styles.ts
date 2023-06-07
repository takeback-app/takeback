import styled from 'styled-components'

export const Container = styled.div`
  padding: 1rem 0 0 0;
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

export const ModalContent = styled.div`
  position: relative;
  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    width: 100%;
    height: 85vh;
  }
`

export const FooterModal = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 2rem;
  }
`
export const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
`
