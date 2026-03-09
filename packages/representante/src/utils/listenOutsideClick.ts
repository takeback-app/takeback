import { Dispatch, SetStateAction } from 'react'

export const listenForOutsideClicks = (
  listening: boolean,
  setListening: Dispatch<SetStateAction<boolean>>,
  menuRef: { current: any },
  setIsOpen: Dispatch<SetStateAction<boolean>>
): any => {
  return () => {
    if (listening) return
    if (!menuRef.current) return
    setListening(true)
    ;[`click`, `touchstart`].forEach(() => {
      document.addEventListener(`click`, evt => {
        const cur = menuRef.current
        const node = evt.target
        if (cur?.contains(node)) return
        setIsOpen(false)
      })
    })
  }
}
