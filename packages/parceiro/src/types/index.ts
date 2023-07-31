export interface Paginated<T> {
  data: T[]
  meta: {
    lastPage: number
    total: number
  }
}

export interface StoreOrder {
  id: string
  consumerId: string
  storeProductId: string
  quantity: number
  value: string
  validationCode: string
  withdrawalAt: string | null
  createdAt: string
  product: Product
  consumer: Consumer
}

export interface Product {
  name: string
  buyPrice: string
}

export interface Consumer {
  fullName: string
}
