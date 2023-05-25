import styled from 'styled-components'

export const Container = styled.main`
  height: 90vh;
  padding: 0.5rem;
  overflow: scroll;
  overflow-x: hidden;
  background-color: transparent;
  padding-bottom: 40px;
`

export const ModalContainer = styled.div`
  padding: 1rem 0 0 0;

  @media (max-width: 450px) {
    border-top: 1px solid #e0e5eb;
  }
`
export const SubHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  background-color: transparent;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 450px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`
export const Content = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  margin-top: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(186, 186, 186, 0.3);
`
export const TableContainer = styled.div`
  width: 100%;
  padding-top: 0.5rem;
`

export const InfoTitle = styled.h4``
export const InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    display: flex;
    flex-direction: column;
  }
`
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
`
export const Title = styled.h5``
export const ContentConfim = styled(Content)`
  display: flex;
  flex-direction: column;
  border: none;
  margin: 0;
  gap: 10px;
`
export const Label = styled.h6`
  font-weight: 400;
`
export const CardFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 1.5rem;
  height: 14%;
`
