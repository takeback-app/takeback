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
import { Nav } from '../layout/SidebarContent'

// accessChecker habilita a checagem, se canAccessClientReport a sidebar só vai exibir essa opção caso a company tenha acesso aos relatórios do cliente

export enum AccessControlEnum {
  BIRTHDAY_NOTIFICATION = 'BIRTHDAY_NOTIFICATION',
  CLIENT_REPORT = 'CLIENT_REPORT',
  INTEGRATION = 'INTEGRATION',
  // Se a empresa tiver algum tipo de integração e QRCode
  NOT_INTEGRATION_AND_QRCODE = 'NOT_INTEGRATION_AND_QRCODE',
  QR_CODE = 'QR_CODE',
  // Se a empresa tiver alguma oferta cadastrada e em andamento (com a data de retirada dentro do prazo).
  STORE_PRODUCTS = 'STORE_PRODUCTS'
}

export type AccessControlTypes = Array<keyof typeof AccessControlEnum>

export const managerNav: Nav[] = [
  {
    id: 0,
    label: 'Painel',
    activeIcon: IoGrid,
    inactiveIcon: IoGridOutline,
    isActive: true,
    to: '/painel',
    accessChecker: []
  },
  {
    id: 1,
    label: 'Lançamento Manual',
    activeIcon: IoCart,
    inactiveIcon: IoCartOutline,
    isActive: false,
    to: '/caixa',
    accessChecker: []
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
    to: '/solicitações/cashback',
    accessChecker: [AccessControlEnum.NOT_INTEGRATION_AND_QRCODE]
  },
  {
    id: 11,
    label: 'Receber Cashback',
    activeIcon: FaRegBookmark,
    inactiveIcon: FaRegBookmark,
    isActive: false,
    to: '/receber-cashback',
    accessChecker: []
  },
  {
    id: 4,
    label: 'Sorteios',
    activeIcon: IoTicket,
    inactiveIcon: IoTicketOutline,
    isActive: false,
    to: '/sorteios',
    accessChecker: []
  },
  {
    id: 5,
    label: 'Retirada de Produtos',
    activeIcon: FaShoppingBag,
    inactiveIcon: FaShoppingBag,
    isActive: false,
    to: '/retirada-ofertas',
    accessChecker: [AccessControlEnum.STORE_PRODUCTS]
  },
  {
    id: 10,
    label: 'Extrato',
    activeIcon: IoNewspaperOutline,
    inactiveIcon: IoNewspaperOutline,
    isActive: false,
    to: '/extrato',
    accessChecker: []
  },
  {
    id: 6,
    label: 'Notificações',
    activeIcon: IoNotifications,
    inactiveIcon: IoNotificationsOutline,
    isActive: false,
    to: '/notificacoes',
    accessChecker: [],
    pages: [
      {
        id: 0,
        label: 'Customizadas',
        activeIcon: IoSend,
        inactiveIcon: IoSendOutline,
        isActive: false,
        to: '/notificacoes',
        accessChecker: []
      },
      {
        id: 1,
        label: 'De Aniversário',
        activeIcon: IoGift,
        inactiveIcon: IoGiftOutline,
        isActive: false,
        to: '/notificacoes/aniversario',
        accessChecker: []
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
        to: '/cashbacks/pendentes',
        accessChecker: []
      },
      {
        id: 1,
        label: 'Saque',
        activeIcon: BsCashCoin,
        inactiveIcon: BsCash,
        isActive: false,
        to: '/cashbacks/saque',
        accessChecker: []
      },
      {
        id: 2,
        label: 'Pagamentos',
        activeIcon: IoLayersSharp,
        inactiveIcon: IoLayersOutline,
        isActive: false,
        to: '/cashbacks/pagamentos',
        accessChecker: []
      },
      {
        id: 3,
        label: 'Histórico',
        activeIcon: RiTimeFill,
        inactiveIcon: RiTimeLine,
        isActive: false,
        to: '/cashbacks/historico',
        accessChecker: []
      },
      {
        id: 5,
        label: 'Conferencia de Caixa',
        activeIcon: FaCashRegister,
        inactiveIcon: FaCashRegister,
        isActive: false,
        to: '/caixa/check',
        accessChecker: []
      }
    ],
    accessChecker: []
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
        userBlocked: 0,
        accessChecker: []
      },
      {
        id: 1,
        label: 'Vendedores',
        activeIcon: IoStorefrontOutline,
        inactiveIcon: IoStorefrontOutline,
        isActive: false,
        to: '/relatorios/venda',
        userBlocked: 0,
        accessChecker: []
      },
      {
        id: 2,
        label: 'Cashback',
        activeIcon: IoArrowUndoCircleOutline,
        inactiveIcon: IoArrowUndoCircleOutline,
        isActive: false,
        to: '/relatorios/cashback',
        userBlocked: 0,
        accessChecker: []
      },
      {
        id: 3,
        label: 'Perfil do Cliente',
        activeIcon: IoNewspaperOutline,
        inactiveIcon: IoNewspaperOutline,
        isActive: false,
        to: '/cliente/perfil',
        accessChecker: [AccessControlEnum.CLIENT_REPORT]
      }
    ],
    accessChecker: []
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
        userBlocked: 0,
        accessChecker: []
      },
      {
        id: 1,
        label: 'Troca de Logo',
        activeIcon: IoImage,
        inactiveIcon: IoImageOutline,
        isActive: false,
        to: '/configuracoes/trocar-logo',
        userBlocked: 0,
        accessChecker: []
      },
      {
        id: 2,
        label: 'Usuários',
        activeIcon: IoIdCard,
        inactiveIcon: IoIdCardOutline,
        isActive: false,
        to: '/configuracoes/usuarios',
        userBlocked: 0,
        accessChecker: []
      },
      {
        id: 3,
        label: 'Pagamentos',
        activeIcon: IoCard,
        inactiveIcon: IoCardOutline,
        isActive: false,
        to: '/configuracoes/pagamento',
        userBlocked: 0,
        accessChecker: []
      }
    ],
    accessChecker: []
  }
]
