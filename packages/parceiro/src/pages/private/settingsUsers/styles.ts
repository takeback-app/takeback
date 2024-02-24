import styled from 'styled-components'

export const Container = styled.main`
  padding: 0 0.5rem 1rem 0.5rem;
  overflow: scroll;
  height: 100%;
`
export const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`

export const InfoWrapper = styled.div``
export const ButtonEdit = styled.button`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${props => props.theme.colors['blue-600']};
  background-color: transparent;
`
export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`
export const Label = styled.label`
  font-weight: 500;
  font-size: 0.7rem;
  font-family: 'Inter', sans-serif;
  color: ${props => props.theme.colors['slate-300']};

  @media (max-width: 450px) {
    font-size: 0.9rem;
  }
`
export const Button = styled.button`
  height: 40px;
  border-radius: 5px;
  padding: 0 2rem;
  background-color: ${props => props.theme.colors['blue-600']};
  color: #fff;
  font-family: 'Inter';
  position: absolute;
  bottom: 1rem;
  right: 1rem;
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
export const ModalContent = styled.div`
  position: relative;
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
