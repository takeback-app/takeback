import { BsCash, BsCashCoin, BsFillPiggyBankFill } from 'react-icons/bs'
import {
  IoBagAdd,
  IoBagAddOutline,
  IoCart,
  IoCartOutline
} from 'react-icons/io5'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'

export const cashierNav = [
  {
    id: 1,
    label: 'Lançamento Manual',
    activeIcon: BsFillPiggyBankFill,
    inactiveIcon: BsFillPiggyBankFill,
    isActive: true,
    to: '/caixa'
  },
  {
    id: 2,
    label: 'Solicitações',
    activeIcon: IoBagAdd,
    inactiveIcon: IoBagAddOutline,
    isActive: false,
    hasDot: true,
    to: '/solicitações',
    pages: [
      {
        id: 0,
        label: 'Pagamento',
        activeIcon: BsCashCoin,
        inactiveIcon: BsCash,
        isActive: false,
        to: '/solicitações/pagamento'
      },
      {
        id: 1,
        label: 'Cashback',
        activeIcon: IoCart,
        inactiveIcon: IoCartOutline,
        isActive: false,
        to: '/solicitações/cashback'
      }
    ]
  },
  {
    id: 3,
    label: 'Histórico',
    activeIcon: RiTimeFill,
    inactiveIcon: RiTimeLine,
    isActive: false,
    to: '/cashbacks/historico'
  }
]
