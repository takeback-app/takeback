import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

export const Container = styled.main`
  padding: 0 0.5rem;
  overflow: scroll;
  height: 100%;
`
export const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0.8rem 0;
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
  color: ${PALLET.COLOR_06};
  border: none;
  text-transform: uppercase;

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
  color: ${PALLET.COLOR_01};
  border: none;
  text-transform: uppercase;

  :first-child {
    padding-left: 0.5rem;
  }

  :last-child {
    right: 0;
  }

  @media (max-width: 1024px) {
    font-size: 0.8rem;
    white-space: nowrap;
  }
`
export const ButtonEdit = styled.button`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${PALLET.COLOR_02};
  background-color: transparent;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`

export const Footer = styled.div`
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 0;
  align-items: flex-end;
  padding: 10px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`
export const LoadMoreButton = styled.button`
  width: 250px;
  height: 40px;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #3a4d5c;
  color: #3a4d5c;
  font-size: 0.8rem;
  text-transform: uppercase;
  cursor: pointer;
`
export const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px;
  padding: 1rem 0;
  position: relative;
  border-radius: 5px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    display: flex;
    flex-direction: column;
  }
`

export const TotalLabel = styled.h4`
  font-size: 1rem;
  color: #3a4d5c;
  font-weight: 500;
`

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
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
