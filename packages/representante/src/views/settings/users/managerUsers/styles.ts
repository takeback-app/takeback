import styled from 'styled-components'

export const Container = styled.main`
  height: 95vh;
  padding: 0.5rem;
  overflow: scroll;
  overflow-x: hidden;
  background-color: transparent;
  padding-bottom: 40px;
`
export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const StatusButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`
export const DataTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 8vh;
  margin-top: 15px;
`
export const DataContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;

  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
`
export const DataContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 15px;
  padding: 1rem;

  @media (max-width: 1024px) {
    display: flex;
  }
`
export const PermissionContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  background-color: #fff;
`
export const PermissionContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 1rem;
`
export const TitleContent = styled.div``
export const ForgotPassContent = styled(DataContentGrid)``
export const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  padding: 1rem;
  margin-right: 0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`
export const WrapperButton = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  width: 100%;
  padding: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`
export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 0;
  padding: 0 1rem;
`
export const ButtonWrapper = styled.div`
  display: flex;
  width: 20%;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 1024px) {
    display: none;
  }
`
