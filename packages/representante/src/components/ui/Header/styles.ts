import styled from 'styled-components'
import PALLET from '../../../styles/ColorPallet'
import { IoIosArrowBack } from 'react-icons/io'
import { IoMenu } from 'react-icons/io5'

export const Container = styled.header`
  height: 8vh;
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
  color: ${PALLET.COLOR_06};
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;

  @media (max-width: 450px) {
    font-size: 0.93rem;
  }
`
export const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`
export const MenuIcon = styled(IoMenu)`
  font-size: 1.4rem;
  margin-right: 0.5rem;
  color: ${PALLET.COLOR_06};
  cursor: pointer;
`
export const MenuBack = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${PALLET.COLOR_06};
  cursor: pointer;
  overflow: hidden;
`
export const ArrowBack = styled(IoIosArrowBack)`
  font-size: 1.4rem;
  margin-right: 0.5rem;
  color: ${PALLET.COLOR_06};
  cursor: pointer;
`
export const GoBackTitle = styled.h3`
  padding: 15px 5px;
  font-size: 1.1em;
  white-space: nowrap;
  color: ${PALLET.COLOR_06};
  font-weight: 600;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    padding: 0;
    display: inline-block;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`
export const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
`
