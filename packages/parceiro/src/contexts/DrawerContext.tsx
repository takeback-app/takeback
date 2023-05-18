import React, {
  useState,
  createContext,
  SetStateAction,
  ReactNode
} from 'react'

interface IDrawer {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

export const DrawerContext = createContext<IDrawer>({} as IDrawer)

interface DrawerProviderProps {
  children: ReactNode
}

export default function DrawerProvider({ children }: DrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}
