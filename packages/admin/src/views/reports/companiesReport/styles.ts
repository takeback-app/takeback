import { IconType } from 'react-icons'
import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'

interface checkboxProps {
  isVisible?: boolean
}

interface ButtonProps {
  icon?: IconType
}

export const Container = styled.div`
  padding: 0 0.5rem;
  height: 100%;
  overflow: scroll;
`

export const SubHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0.8rem 0;
`

export const DividerWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  margin: 0.2rem 0 0.2rem 0;
`

export const TitleWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem 0.8rem;
  align-items: flex-start;
  justify-content: flex-start;
`

export const DownloadContainer = styled.div`
  display: flex;
  justify-content: flex-end;
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

export const ModalContent = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
  }
`

export const FooterModal = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  padding: 0 0 0 0.5rem;

  @media (max-width: 768px) {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 0;
  }
`
export const InputsWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 0 0.8rem;

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

export const ColumnWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const Column = styled.div`
  flex: 2;
`
export const Sort = styled.div`
  flex: 1;
  text-align: right;
  justify-content: center;
  padding: 0 0.5rem;
`

export const SelectWrapper = styled.div`
  display: inline-block;
  padding: 0 1rem 0.8rem;
  width: 100%;

  font-size: 3rem;
`
