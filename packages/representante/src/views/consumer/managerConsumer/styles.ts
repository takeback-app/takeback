import styled from 'styled-components'

export const Container = styled.main`
  height: 90vh;
  padding: 0.5rem;
  overflow: scroll;
  overflow-x: hidden;
  background-color: transparent;
  padding-bottom: 40px;
`
export const SubHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
`
export const Content = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  margin-top: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(186, 186, 186, 0.3);
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
