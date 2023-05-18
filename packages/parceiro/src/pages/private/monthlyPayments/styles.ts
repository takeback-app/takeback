import styled from 'styled-components'

export const Container = styled.main`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    height: 92vh;
    overflow: scroll;
  }
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

export const WrapperPeriodFree = styled.div`
  display: flex;
  width: 100%;
  height: 65vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
`
export const LabelPeriodFree = styled.h3`
  font-weight: 600;
  color: ${props => props.theme.colors['slate-600']};
`
export const SubLabelPeriodFree = styled.h5`
  font-weight: 400;
  color: ${props => props.theme.colors['slate-600']};
`
export const ContainLoader = styled(Container)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
export const PayButton = styled.button``
