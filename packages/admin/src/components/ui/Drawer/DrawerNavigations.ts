import {
  IoAlbumsOutline,
  IoArrowUndoCircleOutline,
  IoBagAdd,
  IoBagAddOutline,
  IoBagRemove,
  IoBagRemoveOutline,
  IoBusiness,
  IoBusinessOutline,
  IoCalendar,
  IoCalendarOutline,
  IoCard,
  IoCardOutline,
  IoGift,
  IoGiftOutline,
  IoGrid,
  IoGridOutline,
  IoIdCard,
  IoIdCardOutline,
  IoNotifications,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoPerson,
  IoPersonOutline,
  IoRefresh,
  IoRefreshOutline,
  IoRocket,
  IoRocketOutline,
  IoSend,
  IoSendOutline,
  IoSettings,
  IoSettingsOutline,
  IoStorefront,
  IoStorefrontOutline,
  IoWallet,
  IoWalletOutline
} from 'react-icons/io5'
import { RiTimeFill, RiTimeLine } from 'react-icons/ri'
import { AiFillShop, AiOutlineShop } from 'react-icons/ai'

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
      }
      // {
      //   id: 3,
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
    label: 'Ofertas',
    activeIcon: AiFillShop,
    inactiveIcon: AiOutlineShop,
    isActive: false,
    to: '/ofertas',
    userBlocked: 0
  },
  {
    id: 6,
    label: 'Notificações',
    activeIcon: IoNotifications,
    inactiveIcon: IoNotificationsOutline,
    isActive: false,
    to: '/notificacoes',
    userBlocked: 0
  },
  {
    id: 7,
    label: 'Verificação Constante',
    activeIcon: IoRefresh,
    inactiveIcon: IoRefreshOutline,
    isActive: false,
    userBlocked: 0,
    pages: [
      {
        id: 0,
        label: 'Sorteios',
        activeIcon: IoGift,
        inactiveIcon: IoGiftOutline,
        isActive: false,
        to: '/parceiros/sorteios',
        userBlocked: 0
      },
      {
        id: 1,
        label: 'Envio Notificações',
        activeIcon: IoSend,
        inactiveIcon: IoSendOutline,
        isActive: false,
        to: '/parceiros/notification-solicitations',
        userBlocked: 0
      },
      {
        id: 2,
        label: 'Saque',
        activeIcon: IoBagRemove,
        inactiveIcon: IoBagRemoveOutline,
        isActive: false,
        to: '/cashbacks/saque',
        userBlocked: 0
      },
      {
        id: 3,
        label: 'Receber',
        activeIcon: IoBagAdd,
        inactiveIcon: IoBagAddOutline,
        isActive: false,
        to: '/cashbacks/pagamentos',
        userBlocked: 0
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
      },
      {
        id: 3,
        label: 'Empresas',
        activeIcon: IoStorefrontOutline,
        inactiveIcon: IoStorefrontOutline,
        isActive: false,
        to: '/relatorios/empresas',
        userBlocked: 0
      },
      {
        id: 4,
        label: 'Financeiro',
        activeIcon: IoBagAdd,
        inactiveIcon: IoBagAddOutline,
        isActive: false,
        to: '/relatorios/financeiro',
        userBlocked: 0
      },
      {
        id: 5,
        label: 'Perfil do Cliente',
        activeIcon: IoBagAdd,
        inactiveIcon: IoBagAddOutline,
        isActive: false,
        to: '/relatorios/perfil-cliente',
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
