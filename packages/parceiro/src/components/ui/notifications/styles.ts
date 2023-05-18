import Modal from 'react-modal'
import styled from 'styled-components'
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5'

export const ModalWrapper = styled(Modal)`
  position: absolute;
  width: auto;
  min-width: 250px;
  display: flex;
  z-index: 999;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 2.5rem;
  right: 20px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  padding: 1rem 0.5rem;
  z-index: 99;
  background-color: #fff;
  -webkit-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 15px -10px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    top: 3.3rem;
  }
`
export const IconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const NotificationIcon = styled(IoNotificationsOutline)`
  font-size: 1.4rem;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors['slate-600']};
  cursor: pointer;
`
export const NotificationIconFill = styled(IoNotifications)`
  font-size: 1.4rem;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors['slate-600']};
  cursor: pointer;
`
