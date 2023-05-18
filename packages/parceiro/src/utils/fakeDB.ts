import * as Icon from '@material-ui/icons'

export const fakeData = [
  { nome: 'Takeback', total: 30 },
  { nome: 'Dinheiro', total: 23 },
  { nome: 'Cartão de crédito', total: 24 },
  { nome: 'Cartão de débito', total: 21 },
  { nome: 'PIX', total: 3 }
]

export const fakeData2 = [
  {
    id: '0',
    name: 'Wesley Leandro',
    office: 'Caixa',
    status: 'Ativo',
    value: 50
  },
  {
    id: '1',
    name: 'Leandro Souza',
    office: 'Caixa',
    status: 'Ativo',
    value: 64
  },
  {
    id: '2',
    name: 'Janyelle Nayara',
    office: 'Caixa',
    status: 'Bloqueado',
    value: 49
  },
  {
    id: '3',
    name: 'Tiago Nigro',
    office: 'Caixa',
    status: 'Bloqueado',
    value: 30
  },
  { id: '4', name: 'Tales Gomes', office: 'Caixa', status: 'Ativo', value: 50 }
]

export const cashbacks = [
  {
    id: '0',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '1',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '3',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '4',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '5',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '6',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '7',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '8',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '9',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  },
  {
    id: '10',
    date: '25/10/2021',
    status: 'Restam 9 dias para pagar',
    payment: 'Cartão de crédito',
    consumer: 'Leandro Pereira de Souza',
    salesman: 'Jaqueline',
    cashback: 0.02,
    value: 200,
    amount: 4
  }
]

export const paymentMethods = [
  {
    id: '0',
    description: 'Dinheiro',
    percent: 0.08,
    active: true,
    icon: Icon.AttachMoney
  },
  {
    id: '1',
    description: 'Cartão de Crédito',
    percent: 0.02,
    active: true,
    icon: Icon.CreditCard
  },
  {
    id: '3',
    description: 'Cartão de Débito',
    percent: 0.03,
    active: true,
    icon: Icon.CreditCard
  },
  {
    id: '4',
    description: 'Boleto',
    percent: 0.02,
    active: false,
    icon: Icon.Description
  },
  {
    id: '5',
    description: 'Transferência',
    percent: 0.04,
    active: false,
    icon: Icon.SwapHoriz
  },
  {
    id: '6',
    description: 'PIX',
    percent: 0.06,
    active: true,
    icon: Icon.AttachMoney
  },
  {
    id: '7',
    description: 'Takeback',
    percent: 0,
    active: true,
    icon: Icon.AttachMoney
  }
]
