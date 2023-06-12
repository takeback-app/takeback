import React from 'react'
import Lottie from 'react-lottie'

import checkAnimation from '../../../assets/check-animation.json'
import * as S from './styles'

interface Props {
  isOpen: boolean
  labelModal: string
  closeModal: () => void
}

const ConfirmationAnimatedModal: React.FC<React.PropsWithChildren<Props>> = ({
  isOpen,
  labelModal,
  closeModal
}) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: checkAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <S.ModalStyles
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{ overlay: { backgroundColor: 'transparent' } }}
    >
      <S.CloseIcon onClick={closeModal} />
      <S.Animation>
        <Lottie
          options={defaultOptions}
          height={200}
          width={200}
          isClickToPauseDisabled
        />
      </S.Animation>
      <S.Message>{labelModal}</S.Message>
    </S.ModalStyles>
  )
}

export default ConfirmationAnimatedModal
