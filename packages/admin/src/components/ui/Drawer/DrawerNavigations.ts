import {
  IoPerson,
  IoPersonOutline,
  IoGrid,
  IoGridOutline,
  IoSettings,
  IoSettingsOutline,
  IoStorefront,
  IoStorefrontOutline,
  IoReader,
  IoReaderOutline,
  IoCalendarOutline,
  IoCalendar,
  IoCardOutline,
  IoCard,
  IoIdCard,
  IoIdCardOutline,
  IoBusiness,
  IoBusinessOutline,
  IoWallet,
  IoWalletOutline,
  // IoBagRemoveOutline,
  // IoBagRemove,
  IoBagAddOutline,
  IoBagAdd,
  IoRocketOutline,
  IoRocket,
  IoBagRemove,
  IoBagRemoveOutline,
  IoGift,
  IoGiftOutline,
  IoSend,
  IoSendOutline,
  IoImage,
  IoImageOutline
} from 'react-icons/io5'
import {
  RiCustomerService2Line,
  RiCustomerService2Fill,
  RiTimeFill,
  RiTimeLine
} from 'react-icons/ri'

export const drawerNav = [
  {
    id: 0,
    label: 'Dashboard',
    activeIcon: IoGrid,
    inactiveIcon: IoGridOutline,
    isActive: true,
    to: '/dashboard',
    userBlocked: 0
  },

  {
    id: 1,
    label: 'Usuários',
    activeIcon: IoPerson,
    inactiveIcon: IoPersonOutline,
    isActive: false,
    to: '/clientes',
    userBlocked: 0
  },
  {
    id: 2,
    label: 'Parceiros',
    activeIcon: IoRocket,
    inactiveIcon: IoRocketOutline,
    isActive: false,
    isOpened: false,
    to: '/parceiros',
    userBlocked: 0,
    pages: [
      {
        id: 0,
        label: 'Empresas',
        activeIcon: IoStorefront,
        inactiveIcon: IoStorefrontOutline,
        isActive: false,
        to: '/parceiros/empresa',
        userBlocked: 0
      },
      {
        id: 1,
        label: 'Mensalidades',
        activeIcon: IoCalendar,
        inactiveIcon: IoCalendarOutline,
        isActive: false,
        to: '/parceiros/mensalidades',
        userBlocked: 0
      },
      {
        id: 2,
        label: 'Representantes',
        activeIcon: IoIdCard,
        inactiveIcon: IoIdCardOutline,
        isActive: false,
        to: '/parceiros/representantes',
        userBlocked: 0
      },
      {
        id: 3,
        label: 'Sorteios',
        activeIcon: IoGift,
        inactiveIcon: IoGiftOutline,
        isActive: false,
        to: '/parceiros/sorteios',
        userBlocked: 0
      },
      {
        id: 4,
        label: 'Envio Notificações',
        activeIcon: IoSend,
        inactiveIcon: IoSendOutline,
        isActive: false,
        to: '/parceiros/notification-solicitations',
        userBlocked: 0
      }
      // {
      //   id: 5,
      //   label: 'Troca de Logo',
      //   activeIcon: IoImage,
      //   inactiveIcon: IoImageOutline,
      //   isActive: false,
      //   to: '/parceiros/troca-logo',
      //   userBlocked: 0
      // }
    ]
  },
  {
    id: 3,
    label: 'Cashbacks',
    activeIcon: IoCard,
    inactiveIcon: IoCardOutline,
    isActive: false,
    isOpened: false,
    to: '/cashbacks',
    userBlocked: 0,
    pages: [
      {
        id: 0,
        label: 'Saque',
        activeIcon: IoBagRemove,
        inactiveIcon: IoBagRemoveOutline,
        isActive: false,
        to: '/cashbacks/saque',
        userBlocked: 0
      },
      {
        id: 1,
        label: 'Receber',
        activeIcon: IoBagAdd,
        inactiveIcon: IoBagAddOutline,
        isActive: false,
        to: '/cashbacks/pagamentos',
        userBlocked: 0
      },
      {
        id: 2,
        label: 'Histórico',
        activeIcon: RiTimeFill,
        inactiveIcon: RiTimeLine,
        isActive: false,
        to: '/cashbacks/historico',
        userBlocked: 0
      }
    ]
  },
  {
    id: 4,
    label: 'Gratificações',
    activeIcon: IoGift,
    inactiveIcon: IoGiftOutline,
    isActive: false,
    to: '/bonus',
    userBlocked: 0
  },
  {
    id: 5,
    label: 'Relatórios',
    activeIcon: IoReader,
    inactiveIcon: IoReaderOutline,
    isActive: false,
    to: '/relatorios',
    userBlocked: 0
  },
  {
    id: 6,
    label: 'Configurações',
    activeIcon: IoSettings,
    inactiveIcon: IoSettingsOutline,
    isActive: false,
    isOpened: false,
    to: '/configuracoes',
    userBlocked: 0,
    pages: [
      {
        id: 0,
        label: 'Usuários',
        activeIcon: IoIdCard,
        inactiveIcon: IoIdCardOutline,
        isActive: false,
        to: '/configuracoes/usuarios',
        userBlocked: 0
      },
      {
        id: 1,
        label: 'Pagamentos',
        activeIcon: IoCard,
        inactiveIcon: IoCardOutline,
        isActive: false,
        to: '/configuracoes/metodos-de-pagamento',
        userBlocked: 0
      },
      {
        id: 2,
        label: 'Segmentos',
        activeIcon: IoBusiness,
        inactiveIcon: IoBusinessOutline,
        isActive: false,
        to: '/configuracoes/ramos-de-atividade',
        userBlocked: 0
      },
      {
        id: 3,
        label: 'Planos',
        activeIcon: IoWallet,
        inactiveIcon: IoWalletOutline,
        isActive: false,
        to: '/configuracoes/planos-e-mensalidade',
        userBlocked: 0
      }
    ]
  }
]
