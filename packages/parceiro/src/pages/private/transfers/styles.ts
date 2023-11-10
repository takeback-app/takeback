import styled from 'styled-components'

export const Title = styled.h5``

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

export const ContentConfimModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`

export const ContainerModal = styled.div`
  padding: 1rem 0 0 0;

  @media (max-width: 450px) {
    border-top: 1px solid #e0e5eb;
  }
`
