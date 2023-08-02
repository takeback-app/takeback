export interface Product {
  id: string
  name: string
  imageUrl: string
  companyId: string
  buyPrice: string
  sellPrice: string
  defaultPrice: string
  unit: string
  stock: number
  maxBuyPerConsumer: number
  dateLimit: string
  dateLimitWithdrawal: string
  createdAt: string
  alreadyBoughtQuantity?: number
  company: {
    fantasyName: string
  }
}

export interface Order {
  id: string
  value: string
  quantity: number
  product: Product
  validationCode: string
  withdrawalAt: string
}

export interface ResponseError {
  message: string
}
