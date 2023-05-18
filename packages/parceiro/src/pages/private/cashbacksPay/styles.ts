import styled from 'styled-components'

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
export const ContainLoader = styled(Container)`
  justify-content: center;
  align-items: center;
`
export const PixWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
`
export const PaymentInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  gap: 15px;
`
export const PaymentInfoDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 1rem;
`
export const PixKey = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${props => props.theme.colors['gray-700']};
  background: transparent;
`
export const Content = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 160px;

  @media (max-width: 450px) {
    overflow-x: scroll;
  }
`
export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  gap: 20px;

  @media (max-width: 450px) {
    flex-direction: column;
    gap: 10px;
  }
`
export const HeaderItemsWrapp = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 450px) {
    width: 100%;
    flex-direction: column;
  }
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

  @media (max-width: 450px) {
    flex-direction: column;
    gap: 15px;
  }
`
export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 450px) {
    width: 100%;
  }
`
export const TotalValue = styled.h6`
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
export const ContentModal = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem 0;

  @media (max-width: 450px) {
    flex-direction: column;
  }
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
export const InfoMessage = styled.h6`
  font-weight: 400;
`
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
export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 15px;
  margin-right: 1rem;
`
