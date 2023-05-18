import styled from 'styled-components'

export const Container = styled.main`
  padding: 0 0.5rem 1rem 0.5rem;
  overflow: scroll;
  height: 100%;
`
export const ContainLoader = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
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
export const Footer = styled.div`
  width: 100%;
  height: 20vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`
export const LoadMoreButton = styled.button`
  width: 300px;
  height: 50px;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #3a4d5c;
  color: #3a4d5c;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
`
export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-right: 1rem;
`
export const ContentMessageModal = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem 0;
  flex-direction: column;
`
export const FooterModal = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`
export const Message = styled.h4``
export const NoCashbacksMessage = styled.h4`
  color: #a6a6a6;
  font-weight: 500;
`
export const NoCashbacksMessageContent = styled.div`
  display: flex;
  width: 100%;
  height: 60vh;
  align-items: center;
  justify-content: center;
`
