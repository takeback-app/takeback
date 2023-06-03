import styled from 'styled-components'
import { MdOutlineClose } from 'react-icons/md'
import Modal from 'react-modal'
import PALLET from '../../../styles/ColorPallet'

export const ModalStyles = styled(Modal)`
  width: 30%;
  height: 40vh;
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 250px;
  left: 580px;
  border-radius: 10px;
  color: ${PALLET.COLOR_01};
  background-color: ${PALLET.BACKGROUND};
  cursor: pointer;
  -webkit-box-shadow: 5px 5px 15px -15px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 5px 5px 15px -15px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 1000px) {
    width: 70%;
    top: 225px;
    left: 50px;
  }
`
export const Message = styled.h5`
  position: absolute;
  bottom: 15px;
  text-align: center;
`

export const Animation = styled.div`
  display: flex;
  position: absolute;

  @media (max-width: 1120px) {
    display: flex;
  }
`
export const CloseIcon = styled(MdOutlineClose)`
  display: flex;
  position: absolute;
  top: 5px;
  right: 5px;
`
