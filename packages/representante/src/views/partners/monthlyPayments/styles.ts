import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface FooterBarProps {
  visibility?: boolean
}

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0.5rem;
  position: relative;
  overflow-x: scroll;
`
export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 160px;
  margin-top: 0.5rem;
`
export const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
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
  color: ${PALLET.COLOR_01};
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
    font-size: 0.8rem;
    white-space: nowrap;
  }
`
export const Checkbox = styled.input.attrs({
  type: 'checkbox'
})`
  margin-left: 1rem;
  cursor: pointer;
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
export const FooterBar = styled.div<FooterBarProps>`
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
export const TotalMonthlies = styled.h6`
  @media (max-width: 768px) {
    display: none;
  }
`
export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`
export const Divider = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0.2rem 0 0.2rem 0;
`
export const InputsWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 0.5rem 0.8rem;

  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`
export const InputDateWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 15px;
`
export const InputTitle = styled.h5`
  font-size: 0.8rem;
  color: #3a4d5c;
  font-weight: 500;
  font-family: 'Inter';
  width: 100%;
  padding: 0;
  margin: 0;
`
export const FooterFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 0;
  }
`
export const ModalContainer = styled.div`
  padding: 0 0.5rem;
  height: 100%;
  width: 100%;
`
export const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  margin-top: 0.5rem;
`
export const ModalFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 15px;
  padding: 1rem 0;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 2rem;
  }
`
export const Label = styled.h6`
  font-weight: 400;
`
