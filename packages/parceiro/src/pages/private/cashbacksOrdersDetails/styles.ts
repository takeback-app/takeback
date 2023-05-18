import styled from 'styled-components'

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
  color: ${props => props.theme.colors['slate-600']};
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
  color: ${props => props.theme.colors['slate-300']};
  border: none;

  :first-child {
    padding-left: 0.5rem;
  }

  :last-child {
    right: 0;
  }
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
