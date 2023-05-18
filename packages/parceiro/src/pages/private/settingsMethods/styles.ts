import styled from 'styled-components'

export const Container = styled.main`
  padding: 0 0.5rem 2rem 0.5rem;
  overflow: scroll;
  height: 100%;
`

export const SubHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0;
`

export const Table = styled.table`
  font-family: 'inter';
  font-size: 0.7rem;
  border-radius: 4px;

  @media (max-width: 1024px) {
    font-size: 0.6rem;
  }
`

export const THead = styled.thead`
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  top: 0;
`

export const TBody = styled.tbody`
  overflow-x: hidden;
  border: none;
`

export const Tr = styled.tr`
  :nth-child(even) {
    background-color: #eff3f5;
  }
  :nth-child(odd) {
    background-color: #f8f8f8;
  }
`

export const Th = styled.th`
  font-weight: 700;
  color: ${props => props.theme.colors['slate-600']};
  border: none;
  text-transform: uppercase;
  line-height: 1rem;

  :first-child {
    padding-left: 0.5rem;
  }

  :last-child {
    right: 0;
  }

  @media (max-width: 1024px) {
    font-size: 1.2em;
    white-space: nowrap;
  }
`

export const Td = styled.td`
  font-weight: 400;
  color: ${props => props.theme.colors['slate-300']};
  border: none;
  text-transform: uppercase;
  line-height: 1rem;

  :first-child {
    padding-left: 0.5rem;
  }

  :last-child {
    right: 0;
  }

  @media (max-width: 1024px) {
    white-space: nowrap;
  }
`

export const ModalWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
`

export const Label = styled.label`
  font-family: 'Inter';
  color: ${props => props.theme.colors['gray-700']};
`

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`

export const ModalContent = styled.div`
  position: relative;
  background: #fff;
  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    width: 100%;
    height: 85vh;
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 30px;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 2rem;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 15px;
  margin-right: 1rem;
`
