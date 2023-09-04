import { BsCash, BsCashCoin } from 'react-icons/bs'
import {
  IoGrid,
  IoGridOutline,
  IoSettings,
  IoSettingsOutline,
  IoCart,
  IoCartOutline,
  IoCash,
  IoCashOutline,
  IoLayersOutline,
  IoLayersSharp,
  IoBagRemove,
  IoBagRemoveOutline,
  IoStorefront,
  IoStorefrontOutline,
  IoIdCard,
  IoIdCardOutline,
  IoCard,
  IoCardOutline,
  // IoBagAdd,
  // IoBagAddOutline,
  IoTicket,
  IoTicketOutline,
  IoAlbumsOutline,
  IoPeopleOutline,
  IoArrowUndoCircleOutline,
  IoNotificationsOutline,
  IoNotifications,
  IoSend,
  IoSendOutline,
  IoGift,
  IoGiftOutline,
  IoImage,
  IoImageOutline,
  IoNewspaperOutline
} from 'react-icons/io5'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'
import { FaCashRegister, FaRegBookmark, FaShoppingBag } from 'react-icons/fa'

export const managerNav = [
  {
    id: 0,
    label: 'Painel',
    activeIcon: IoGrid,
    inactiveIcon: IoGridOutline,
    isActive: true,
    to: '/painel'
  },
  {
    id: 1,
    label: 'Lançamento Manual',
    activeIcon: IoCart,
    inactiveIcon: IoCartOutline,
    isActive: false,
    to: '/caixa'
  },
  // {
  //   id: 2,
  //   label: 'Receber pagamento',
  //   activeIcon: BsCashCoin,
  //   inactiveIcon: BsCash,
  //   hasDotKey: 'paymentRequest',
  //   isActive: false,
  //   to: '/solicitações/pagamento'
  // },
  {
    id: 3,
    label: 'Autorizar cashback',
    activeIcon: IoCart,
    inactiveIcon: IoCartOutline,
    hasDotKey: 'cashbackRequest',
    isActive: false,
    to: '/solicitações/cashback'
  },
  {
    id: 11,
    label: 'Reconhecer Cashback',
    activeIcon: FaRegBookmark,
    inactiveIcon: FaRegBookmark,
    isActive: false,
    to: '/reconhecer-cashback'
  },
  {
    id: 4,
    label: 'Sorteios',
    activeIcon: IoTicket,
    inactiveIcon: IoTicketOutline,
    isActive: false,
    to: '/sorteios'
  },
  {
    id: 5,
    label: 'Retirada de Produtos',
    activeIcon: FaShoppingBag,
    inactiveIcon: FaShoppingBag,
    isActive: false,
    to: '/retirada-ofertas'
  },
  {
    id: 10,
    label: 'Extrato',
    activeIcon: IoNewspaperOutline,
    inactiveIcon: IoNewspaperOutline,
    isActive: false,
    to: '/extrato'
  },
  {
    id: 6,
    label: 'Notificações',
    activeIcon: IoNotifications,
    inactiveIcon: IoNotificationsOutline,
    isActive: false,
    to: '/notificacoes',
    pages: [
      {
        id: 0,
        label: 'Customizadas',
        activeIcon: IoSend,
        inactiveIcon: IoSendOutline,
        isActive: false,
        to: '/notificacoes'
      },
      {
        id: 1,
        label: 'De Aniversário',
        activeIcon: IoGift,
        inactiveIcon: IoGiftOutline,
        isActive: false,
        to: '/notificacoes/aniversario'
      }
    ]
  },
  {
    id: 7,
    label: 'Cashbacks',
    activeIcon: IoCash,
    inactiveIcon: IoCashOutline,
    isActive: false,
    isOpened: false,
    to: '/cashbacks/pendentes',
    pages: [
      {
        id: 0,
        label: 'Pagar',
        activeIcon: IoBagRemove,
        inactiveIcon: IoBagRemoveOutline,
        isActive: false,
        to: '/cashbacks/pendentes'
      },
      {
        id: 1,
        label: 'Saque',
        activeIcon: BsCashCoin,
        inactiveIcon: BsCash,
        isActive: false,
        to: '/cashbacks/saque'
      },
      {
        id: 2,
        label: 'Pagamentos',
        activeIcon: IoLayersSharp,
        inactiveIcon: IoLayersOutline,
        isActive: false,
        to: '/cashbacks/pagamentos'
      },
      {
        id: 3,
        label: 'Histórico',
        activeIcon: RiTimeFill,
        inactiveIcon: RiTimeLine,
        isActive: false,
        to: '/cashbacks/historico'
      },
      {
        id: 5,
        label: 'Conferencia de Caixa',
        activeIcon: FaCashRegister,
        inactiveIcon: FaCashRegister,
        isActive: false,
        to: '/caixa/check'
      }
    ]
  },
  {
    id: 8,
    label: 'Relatórios',
    activeIcon: IoAlbumsOutline,
    inactiveIcon: IoAlbumsOutline,
    isActive: false,
    isOpened: false,
    to: '/relatorios',
    pages: [
      {
        id: 0,
        label: 'Clientes',
        activeIcon: IoPeopleOutline,
        inactiveIcon: IoPeopleOutline,
        isActive: false,
        to: '/relatorios/cliente',
        userBlocked: 0
      },
      {
        id: 1,
        label: 'Vendedores',
        activeIcon: IoStorefrontOutline,
        inactiveIcon: IoStorefrontOutline,
        isActive: false,
        to: '/relatorios/venda',
        userBlocked: 0
      },
      {
        id: 2,
        label: 'Cashback',
        activeIcon: IoArrowUndoCircleOutline,
        inactiveIcon: IoArrowUndoCircleOutline,
        isActive: false,
        to: '/relatorios/cashback',
        userBlocked: 0
      }
    ]
  },
  {
    id: 9,
    label: 'Configurações',
    activeIcon: IoSettings,
    inactiveIcon: IoSettingsOutline,
    isActive: false,
    isOpened: false,
    to: '/configuracoes',
    pages: [
      {
        id: 0,
        label: 'Empresa',
        activeIcon: IoStorefront,
        inactiveIcon: IoStorefrontOutline,
        isActive: false,
        to: '/configuracoes/empresa',
        userBlocked: 0
      },
      {
        id: 1,
        label: 'Troca de Logo',
        activeIcon: IoImage,
        inactiveIcon: IoImageOutline,
        isActive: false,
        to: '/configuracoes/trocar-logo',
        userBlocked: 0
      },
      {
        id: 2,
        label: 'Usuários',
        activeIcon: IoIdCard,
        inactiveIcon: IoIdCardOutline,
        isActive: false,
        to: '/configuracoes/usuarios',
        userBlocked: 0
      },
      {
        id: 3,
        label: 'Pagamentos',
        activeIcon: IoCard,
        inactiveIcon: IoCardOutline,
        isActive: false,
        to: '/configuracoes/pagamento',
        userBlocked: 0
      }
    ]
  }
]
