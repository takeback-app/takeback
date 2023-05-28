import {
  IoGrid,
  IoGridOutline,
  IoGift,
  IoGiftOutline,
  IoStorefront,
  IoStorefrontOutline,
  IoBagRemove,
  IoBagRemoveOutline,
  IoIdCardOutline,
  IoIdCard,
  IoPerson,
  IoPersonOutline
} from 'react-icons/io5'
import { IconType } from 'react-icons/lib'

import { RiTimeFill, RiTimeLine } from 'react-icons/ri'

export interface DrawerNavigationItem {
  id: number
  label: string
  activeIcon: IconType
  inactiveIcon: IconType
  isActive: boolean
  to: string
  isOpened?: boolean
  userBlocked: number
  pages?: DrawerNavigationItem[]
}

export const drawerNav: DrawerNavigationItem[] = [
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
    id: 2,
    label: 'Empresas',
    activeIcon: IoStorefront,
    inactiveIcon: IoStorefrontOutline,
    isActive: false,
    to: '/empresas',
    userBlocked: 0
  },
  {
    id: 3,
    label: 'Solicitar Repasse',
    activeIcon: IoBagRemove,
    inactiveIcon: IoBagRemoveOutline,
    isActive: false,
    to: '/repasse',
    userBlocked: 0
  },
  {
    id: 4,
    label: 'Sorteios',
    activeIcon: IoGift,
    inactiveIcon: IoGiftOutline,
    isActive: false,
    to: '/sorteios',
    userBlocked: 0
  },
  {
    id: 5,
    label: 'Histórico',
    activeIcon: RiTimeFill,
    inactiveIcon: RiTimeLine,
    isActive: false,
    to: '/historico',
    userBlocked: 0
  },
  {
    id: 6,
    label: 'Consultores',
    activeIcon: IoPerson,
    inactiveIcon: IoPersonOutline,
    isActive: false,
    to: '/consultores',
    userBlocked: 0
  }
]
