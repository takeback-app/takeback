import * as Icon from '@material-ui/icons'

import { FaShoppingCart } from 'react-icons/fa'
import { GiRemedy } from 'react-icons/gi'

export const fakeData = [
  { nome: 'Qua', total: 30 },
  { nome: 'Qui', total: 23 },
  { nome: 'Sex', total: 24 },
  { nome: 'Sab', total: 21 },
  { nome: 'Dom', total: 3 },
  { nome: 'Seg', total: 21.9 },
  { nome: 'Ter', total: 18 }
]

export const userType = [
  {
    id: 1,
    description: 'Administrativo'
  },
  {
    id: 2,
    description: 'Colaborador'
  }
]

export const fakeData2 = [
  {
    id: '0',
    name: 'Wesley Leandro',
    office: 'Caixa',
    permission: 'Administrador',
    status: 'Ativo',
    street: 'Rua João Antunes da Silva ',
    houseNumber: 9,
    district: 'Pedra Azul',
    city: 'Porteirinha - MG',
    email: 'leandro@desencoder.com.br',
    value: 50
  },
  {
    id: '1',
    name: 'Leandro Souza',
    office: 'Caixa',
    permission: 'Administrador',
    status: 'Ativo',
    street: 'Rua João Antunes da Silva ',
    houseNumber: 973,
    district: 'Pedra Azul',
    city: 'Porteirinha - MG',
    email: 'leandro@desencoder.com.br',
    value: 64
  },
  {
    id: '2',
    name: 'Janyelle Nayara',
    office: 'Caixa',
    permission: 'Administrador',
    status: 'Bloqueado',
    street: 'Rua João Antunes da Silva ',
    houseNumber: 973,
    district: 'Pedra Azul',
    city: 'Porteirinha - MG',
    email: 'leandro@desencoder.com.br',
    value: 49
  },
  {
    id: '3',
    name: 'Tiago Nigro',
    office: 'Caixa',
    permission: 'Administrador',
    status: 'Bloqueado',
    street: 'Rua João Antunes da Silva ',
    houseNumber: 973,
    district: 'Pedra Azul',
    city: 'Porteirinha - MG',
    email: 'leandro@desencoder.com.br',
    value: 30
  },
  {
    id: '4',
    name: 'Tales Gomes',
    office: 'Caixa',
    permission: 'Administrador',
    status: 'Ativo',
    street: 'Rua João Antunes da Silva ',
    houseNumber: 973,
    district: 'Pedra Azul',
    city: 'Porteirinha - MG',
    email: 'leandro@desencoder.com.br',
    value: 50
  }
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

export const industry = [
  {
    id: 0,
    icon: FaShoppingCart,
    title: 'Supermercado',
    descriptionTitle: 'Taxa padrão: ',
    description: '1% à cada transação',
    fee: 1
  },
  {
    id: 1,
    icon: GiRemedy,
    title: 'Farmácia',
    descriptionTitle: 'Taxa padrão: ',
    description: '2% à cada transação',
    fee: 2
  }
]

export const customers = [
  {
    id: '0',
    customerName: 'Janyelle',
    cpf: '111.111.111-11',
    street: 'Teste',
    phone: '38 99161-8130',
    houseNumber: 123,
    district: 'Vila Guará',
    city: 'Porteirinha',
    registerDate: '01-01-2022',
    cashBackBalance: 300.15
  },
  {
    id: '1',
    customerName: 'Wesley Leandro',
    cpf: '123.456.789-99',
    phone: '38 99999-8130',
    street: 'Vista Alegre',
    houseNumber: 12,
    district: 'Vila Guará',
    city: 'Porteirinha',
    registerDate: '01-01-2022',
    cashBackBalance: 400.1
  },
  {
    id: '2',
    customerName: 'Leandro Sousa',
    cpf: '321.654.987-65',
    phone: '38 99161-9999',
    street: 'Vista Alegre',
    houseNumber: 12,
    district: 'Pedra Azul',
    city: 'Porteirinha',
    registerDate: '01-01-2022',
    cashBackBalance: 200.6
  },
  {
    id: '3',
    customerName: 'Izaque Dione',
    cpf: '999.999.999.-99',
    phone: '38 99999-9999',
    street: 'Vista Alegre',
    houseNumber: 12,
    district: 'Ouro Branco',
    city: 'Porteirinha',
    registerDate: '01-01-2022',
    cashBackBalance: 150.4
  }
]

export const companies = [
  {
    id: '0',
    registerDate: '13/02/2021',
    fantasyName: 'Supermercado Teste',
    cnpj: '63.824.253/0001-95',
    feePerTransation: '1%',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '1',
    registerDate: '24/07/2021',
    fantasyName: 'Farmácia Teste',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    cnpj: '63.824.311/0001-43',
    feePerTransation: '1,5%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '2',
    registerDate: '20/12/2021',
    fantasyName: 'Posto Teste',
    cnpj: '63.132.311/0001-21',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,2%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '3',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '4',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '5',
    registerDate: '15/03/2022',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '6',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '7',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '8',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '9',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '10',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '11',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    statusCompany: 'Ativo'
  },
  {
    id: '12',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '13',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '14',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  },
  {
    id: '15',
    registerDate: '15/03/2022',
    fantasyName: 'Lanchonete Teste',
    cnpj: '76.824.311/0001-64',
    feePersonalized: 'Taxa personalizada',
    closureDate: '30',
    feePerTransation: '1,3%',
    plan: 'Plano teste',
    statusCompany: 'Ativo'
  }
]
