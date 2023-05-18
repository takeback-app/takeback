import { create } from 'zustand'

type StoreVisitType = 'ALL' | 'NEVER' | 'FROM_THE_DATE_OF_PURCHASE'
type AudienceSex = 'MALE' | 'FEMALE' | 'ALL'

interface AudienceData {
  audienceSex: AudienceSex
  storeVisitType: StoreVisitType
  hasChildren?: boolean
  minAudienceAge?: number
  maxAudienceAge?: number
  audienceBalance?: number
  dateOfPurchase?: string
}

export interface StateProperties {
  audienceData: AudienceData
  audienceCount?: number
  isAudienceGenerated: boolean
}

interface State extends StateProperties {
  setValue: <K extends keyof StateProperties>(
    key: K,
    value: StateProperties[K]
  ) => void
  resetState: () => void
}

const initialState = {
  audienceData: {} as AudienceData,
  audienceCount: undefined,
  isAudienceGenerated: false
}

export const useCreateNotificationSolicitation = create<State>(set => ({
  ...initialState,
  setValue: (key, value) => set({ [key]: value }),
  resetState: () => set(initialState)
}))
