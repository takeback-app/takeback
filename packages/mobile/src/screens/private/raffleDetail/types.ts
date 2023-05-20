export interface Raffle {
  id: string
  title: string
  imageUrl: string
  ticketValue: string
  drawDate: string
  isOpenToOtherCompanies: boolean
  pickUpLocation: string
  companyId: string
  statusId: number
  createdAt: string
  updatedAt: string
  status: Status
  items: Item[]
  company: Company
  _count: Count
}

export interface Status {
  description: string
}

export interface Item {
  id: string
  order: number
  description: string
  imageUrl: string
  raffleId: string
  winnerTicketId?: string
  winnerTicket?: WinnerTicket
  raffleItemDelivery?: RaffleItemDelivery
}

export interface RaffleItemDelivery {
  id: string
  useCode: string
  deliveredAt?: string
}

export interface WinnerTicket {
  number: number
  consumer: Consumer
  transaction: {
    company: {
      fantasyName: string
    }
  }
}

export interface Consumer {
  fullName: string
  cpf: string
}

export interface Company {
  fantasyName: string
  companyAddress: CompanyAddress
}

export interface CompanyAddress {
  city: City
}

export interface City {
  name: string
}

export interface Count {
  tickets: number
}
