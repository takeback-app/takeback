export type ExtractTransactionTypes = {
  id: number
  value: number
  backAmount: number
  cashbackAmount: number
  cashbackPercent: number
  amountPayWithTakebackBalance: number
  amountPayWithOthersMethods: number
  fantasyName: string
  statusId: number
  statusDescription: string
  cancellationDescription: string
  createdAt: string
  isTransfer: boolean
  isReceived: boolean
  consumerReceivedName: string
  consumerSentName: string
}
