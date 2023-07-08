export type TPlan = {
  id: number
  description: string
  value: number
  takebackBonus: number
  numberOfMonthlyRaffles: number
  numberOfMonthlyNotificationSolicitations: number
  canSendBirthdayNotification: boolean
  canAccessClientReport: boolean
  canUseIntegration: boolean
  newUserBonus: number
  createdAt: string
  updatedAt: string
}
