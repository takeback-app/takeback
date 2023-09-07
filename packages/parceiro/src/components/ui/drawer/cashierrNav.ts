import {
  // BsCash,
  // BsCashCoin,
  BsFillPiggyBankFill
} from 'react-icons/bs'
import { FaShoppingBag } from 'react-icons/fa'
import { IoCart, IoCartOutline } from 'react-icons/io5'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'
import { Nav } from '../layout/SidebarContent'

// accessChecker habilita a checagem, se canAccessClientReport a sidebar só vai exibir essa opção caso a company tenha acesso aos relatórios do cliente

export const cashierNav: Nav[] = [
  {
    id: 1,
    label: 'Lançamento Manual',
    activeIcon: BsFillPiggyBankFill,
    inactiveIcon: BsFillPiggyBankFill,
    isActive: true,
    to: '/caixa'
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
    id: 2,
    label: 'Retirada de Produtos',
    activeIcon: FaShoppingBag,
    inactiveIcon: FaShoppingBag,
    isActive: false,
    to: '/retirada-ofertas'
  },
  {
    id: 3,
    label: 'Autorizar Cashback',
    activeIcon: IoCart,
    inactiveIcon: IoCartOutline,
    hasDotKey: 'cashbackRequest',
    isActive: false,
    to: '/solicitações/cashback'
  },
  {
    id: 4,
    label: 'Histórico',
    activeIcon: RiTimeFill,
    inactiveIcon: RiTimeLine,
    isActive: false,
    to: '/cashbacks/historico'
  }
]
