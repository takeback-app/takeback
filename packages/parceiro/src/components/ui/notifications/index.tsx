import React from 'react'

import * as Styles from './styles'

export default function Notification(): JSX.Element {
  const notificationRef = React.useRef(null)
  const [isOpened, setIsOpened] = React.useState(false)

  const toggleVisibility = () => setIsOpened(!isOpened)

  return (
    <>
      <Styles.IconsWrapper>
        <Styles.NotificationIcon onClick={toggleVisibility} />
        <Styles.NotificationIconFill onClick={toggleVisibility} />
      </Styles.IconsWrapper>

      <Styles.ModalWrapper
        ref={notificationRef}
        isOpen={isOpened}
        onRequestClose={() => setIsOpened(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.40)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <span>notificações</span>
      </Styles.ModalWrapper>
    </>
  )
}
