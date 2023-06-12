import React, { useState, createContext, SetStateAction } from 'react'

interface IDrawer {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

export const DrawerContext = createContext<IDrawer>({
  isOpen: true,
  setIsOpen: () => null
})

const DrawerProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

export default DrawerProvider
