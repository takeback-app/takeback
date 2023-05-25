import styled from 'styled-components'
import { Link } from 'react-router-dom'

import PALLET from '../../../styles/ColorPallet'

interface ContainerProps {
  isOpen: boolean
}

interface NavProps {
  isActive?: boolean
}

interface NavVariantProps {
  isOpened?: boolean
}

export const Container = styled.aside<ContainerProps>`
  width: ${props => (props.isOpen ? '260px' : '65px')};
  height: 100%;
  transition: cubic-bezier(0.165, 0.84, 0.44, 1) 200ms;
  background-color: ${PALLET.COLOR_19};
  position: relative;

  @media (max-width: 1024px) {
    display: ${props => (props.isOpen ? 'block' : 'none')};
    position: absolute;
    z-index: 99;
  }
`
export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 8vh;
`
export const Logo = styled.img`
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  padding: 1.1rem;
`
export const Content = styled.div`
  width: 100%;
  padding-left: 0.3rem;
  padding-bottom: 1rem;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`
export const NavWrapper = styled.button<NavProps>`
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  padding: 0.9rem;
  border-radius: 8px 0 0 8px;
  text-decoration: none;
  background-color: ${props =>
    props.isActive ? PALLET.BACKGROUND : PALLET.COLOR_19};
  transition: 100ms all;

  :hover {
    background-color: ${props =>
      props.isActive ? PALLET.BACKGROUND : '#ffffff20'};
  }
`
export const NavWrapperVariant = styled(NavWrapper)<NavVariantProps>`
  padding: 0.9rem 0.9rem 0.9rem
    ${props => (props.isOpened ? '2.4rem' : '0.9rem')};
  transition: cubic-bezier(0.165, 0.84, 0.44, 1) 200ms;
  background-color: ${props =>
    props.isActive ? PALLET.BACKGROUND : PALLET.COLOR_19};
`
export const NavWrapperMultiPages = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  background-color: ${PALLET.COLOR_19};
`
export const Label = styled(Link)<NavProps>`
  font-family: 'Inter';
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 0.6rem;
  text-decoration: none;
  color: ${props => (props.isActive ? PALLET.COLOR_19 : PALLET.BACKGROUND)};
`
export const LabelMultiPages = styled.h5`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter';
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 0.6rem;
  text-decoration: none;
  color: ${PALLET.BACKGROUND};
`
export const VersionWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
  padding: 0.8rem;
`
export const VersionLabel = styled.h6`
  color: #fff;
  text-transform: lowercase;
  font-weight: 300;
  text-align: center;
`
