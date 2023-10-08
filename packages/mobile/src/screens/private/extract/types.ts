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
  CONSULTANT = 'CONSULTANT',
  REFERRAL = 'REFERRAL',
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

export enum QRCodeType {
  WAITING = 'WAITING',
  NOT_VALIDATED = 'NOT_VALIDATED'
}

export interface SolicitationData {
  id: string
  amount: number
  companyName: string
  type: SolicitationType
  status: SolicitationStatus
  text?: string
}

export interface StoreOrderData {
  id: string
  value: number
  quantity: number
  companyName: string
  productName: string
}

export interface QRCodeData {
  id: string
  description: string
  companyName: string
  type: 'WAITING' | 'NOT_VALIDATED'
}

export interface DepositData {
  id: string
  value: number
}

type ExtractItemType =
  | { type: 'TRANSACTION'; data: TransactionData }
  | { type: 'TRANSFER'; data: TransferData }
  | { type: 'BALANCE_EXPIRATION'; data: BalanceExpirationData }
  | { type: 'BONUS'; data: BonusData }
  | { type: 'SOLICITATION'; data: SolicitationData }
  | { type: 'STORE_ORDER'; data: StoreOrderData }
  | { type: 'QRCODE'; data: QRCodeData }
  | { type: 'DEPOSIT'; data: DepositData }

export enum ExtractType {
  TRANSACTION = 'TRANSACTION',
  TRANSFER = 'TRANSFER',
  BALANCE_EXPIRATION = 'BALANCE_EXPIRATION',
  BONUS = 'BONUS',
  SOLICITATION = 'SOLICITATION',
  QRCODE = 'QRCODE',
  STORE_ORDER = 'STORE_ORDER',
  DEPOSIT = 'DEPOSIT'
}

export type ExtractItem = ExtractItemType & {
  id: string
  referenceDate: string
}
