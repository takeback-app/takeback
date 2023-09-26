import {
  // BsCash,
  // BsCashCoin,
  BsFillPiggyBankFill
} from 'react-icons/bs'
import { FaRegBookmark, FaShoppingBag } from 'react-icons/fa'
import { IoCart, IoCartOutline } from 'react-icons/io5'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'
import { Nav } from '../layout/SidebarContent'
import { AccessControlEnum } from './managerNav'

// accessChecker habilita a checagem, se canAccessClientReport a sidebar só vai exibir essa opção caso a company tenha acesso aos relatórios do cliente

export const cashierNav: Nav[] = [
  {
    id: 1,
    label: 'Lançamento Manual',
    activeIcon: BsFillPiggyBankFill,
    inactiveIcon: BsFillPiggyBankFill,
    isActive: true,
    to: '/caixa',
    accessChecker: []
  },
  {
    id: 5,
    label: 'Receber Cashback',
    activeIcon: FaRegBookmark,
    inactiveIcon: FaRegBookmark,
    isActive: false,
    to: '/receber-cashback',
    accessChecker: []
  },
  // {
  //   id: 2,
  //   label: 'Receber Pagamento',
  //   activeIcon: BsCashCoin,
  //   inactiveIcon: BsCash,
  //   hasDotKey: 'paymentRequest',
  //   isActive: false,
  //   to: '/solicitações/pagamento'
  // },
  {
    id: 3,
    label: 'Autorizar Cashback',
    activeIcon: IoCart,
    inactiveIcon: IoCartOutline,
    hasDotKey: 'cashbackRequest',
    isActive: false,
    to: '/solicitações/cashback',
    accessChecker: [AccessControlEnum.NOT_INTEGRATION_AND_QRCODE]
  },
  {
    id: 2,
    label: 'Retirada de Produtos',
    activeIcon: FaShoppingBag,
    inactiveIcon: FaShoppingBag,
    isActive: false,
    to: '/retirada-ofertas',
    accessChecker: [AccessControlEnum.STORE_PRODUCTS]
  },
  {
    id: 4,
    label: 'Histórico',
    activeIcon: RiTimeFill,
    inactiveIcon: RiTimeLine,
    isActive: false,
    to: '/cashbacks/historico',
    accessChecker: []
  }
]
