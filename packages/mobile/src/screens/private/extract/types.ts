export interface TransactionData {
  id: number
  companyName: string
  status: string
  cashbackAmount: number
  backAmount: number
  amountPayWithTakebackBalance: number
}

export interface TransferData {
  id: number
  consumerName: string
  isReceived: boolean
  amount: number
}

export interface BalanceExpirationData {
  id: string
  amount: number
}

export enum BonusType {
  SELL = 'SELL',
  NEW_USER = 'NEW_USER'
}

export interface BonusData {
  id: string
  amount: number
  type: BonusType
}

export enum SolicitationStatus {
  WAITING = 'WAITING',
  CANCELED = 'CANCELED',
  APPROVED = 'APPROVED'
}

export enum SolicitationType {
  CASHBACK = 'CASHBACK',
  PAYMENT = 'PAYMENT'
}

export interface SolicitationData {
  id: string
  amount: number
  companyName: string
  type: SolicitationType
  status: SolicitationStatus
  text?: string
}

type ExtractItemType =
  | { type: 'TRANSACTION'; data: TransactionData }
  | { type: 'TRANSFER'; data: TransferData }
  | { type: 'BALANCE_EXPIRATION'; data: BalanceExpirationData }
  | { type: 'BONUS'; data: BonusData }
  | { type: 'SOLICITATION'; data: SolicitationData }

export enum ExtractType {
  TRANSACTION = 'TRANSACTION',
  TRANSFER = 'TRANSFER',
  BALANCE_EXPIRATION = 'BALANCE_EXPIRATION',
  BONUS = 'BONUS',
  SOLICITATION = 'SOLICITATION'
}

export type ExtractItem = ExtractItemType & {
  id: string
  referenceDate: string
}
