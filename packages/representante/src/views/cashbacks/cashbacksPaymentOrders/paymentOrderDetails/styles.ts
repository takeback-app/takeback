import styled from 'styled-components'
import PALLET from '../../../../styles/ColorPallet'

interface FooterProps {
  visibility?: boolean
}

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0.5rem;
  overflow: scroll;
  position: relative;
`
export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.5rem 0.2rem;
  border-radius: 4px;
  gap: 2rem 1rem;
  background-color: #fff;
  margin-bottom: 20px;
  margin-top: 0.5rem;

  @media (max-width: 450px) {
    grid-template-columns: repeat(2, 1fr);
  }
`
export const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 160px;

  @media (max-width: 450px) {
    overflow-x: scroll;
  }
`
export const Table = styled.table`
  font-family: 'Inter';
  font-size: 0.7rem;
  border-radius: 8px;
`
export const THead = styled.thead`
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  top: 0;
  background-color: #fff;
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
    background: #fff;
  }
`
export const Th = styled.th`
  line-height: 0.9rem;
  color: ${PALLET.COLOR_06};
  border: none;

  :first-child {
    padding-left: 0.5rem;
  }

  :last-child {
    right: 0;
  }
`
export const Td = styled.td`
  line-height: 0.9rem;
  color: ${PALLET.COLOR_01};
  border: none;

  :first-child {
    padding-left: 0.5rem;
  }

  :last-child {
    right: 0;
  }
`
export const Footer = styled.div<FooterProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 0.5rem;
  visibility: ${props => (props.visibility ? 'visible' : 'hidden')};

  background-color: #f3f3f3;

  -webkit-box-shadow: 0px -2px 15px -10px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px -2px 15px -10px rgba(0, 0, 0, 1);
  box-shadow: 0px -2px 15px -10px rgba(0, 0, 0, 1);
`
export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`
export const TotalValue = styled.h6``
export const ContentTransactionsLoader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
`
export const ContainerModal = styled.div`
  padding: 1rem 0 0 0;

  @media (max-width: 450px) {
    border-top: 1px solid #e0e5eb;
  }
`
export const ContentModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;

  border-bottom: 1px solid #e6e6e6;
`
export const ContentConfimModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
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
export const FooterModal = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  gap: 10px;
`
export const ModalConfirmMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 0 0;
`
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
  margin-bottom: 10px;
`
