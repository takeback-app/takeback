import styled from 'styled-components'
import { IoMenu } from 'react-icons/io5'
import { IoIosArrowBack } from 'react-icons/io'

export const Container = styled.header`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;

  -webkit-box-shadow: 0px 2px 15px -9px rgba(153, 153, 153, 1);
  -moz-box-shadow: 0px 2px 15px -9px rgba(153, 153, 153, 1);
  box-shadow: 0px 2px 15px -9px rgba(153, 153, 153, 1);

  @media (max-width: 768px) {
    padding: 0 1rem;

    -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  }
`
export const Title = styled.h4`
  font-size: 1rem;
  color: ${props => props.theme.colors['slate-600']};
`
export const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`
export const MenuIcon = styled(IoMenu)`
  font-size: 1.4rem;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors['slate-600']};
  cursor: pointer;
`
export const MenuBack = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${props => props.theme.colors['slate-600']};
  cursor: pointer;
  overflow: hidden;
`
export const ArrowBack = styled(IoIosArrowBack)`
  font-size: 1.4rem;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors['slate-600']};
  cursor: pointer;
`
export const RightItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
