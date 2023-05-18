import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface StoreState {
  isAccountUpdated?: boolean
  setAccountUpdate: (isAccountUpdated: boolean) => void
}

export const useStorage = create(
  persist<StoreState>(
    set => ({
      isAccountUpdated: undefined,
      setAccountUpdate: (isAccountUpdated: boolean) => set({ isAccountUpdated })
    }),
    {
      name: 'local-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
