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

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 160px;

  @media (max-width: 450px) {
    overflow-x: scroll;
  }
`
export const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0.8rem 0;
`
export const HeaderItemsWrapp = styled.div`
  display: flex;
  gap: 10px;
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
export const Checkbox = styled.input.attrs({
  type: 'checkbox'
})`
  margin-left: 1rem;
  cursor: pointer;
`
export const NoContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`
export const TotalValue = styled.h6``
export const ContentModal = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem 0;
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
export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

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
export const FormWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem 0;
  position: relative;
  border-radius: 5px;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
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
    flex-direction: column;
    width: 100%;
    height: 85vh;
  }
`

export const ModalFooter = styled.div`
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
    gap: 15px;
  }
`
