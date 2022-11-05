interface MenuEntry {
  label: string;
  icon: string;
  route?: string[];
  bottom?: boolean;
}

export const MenuEntries: MenuEntry[] = [
  {
    label: 'EASYBSB_SIDEBAR_DASHBOARD',
    route: ['./'],
    icon: 'home'
  },
  {
    label: 'EASYBSB_SIDEBAR_DEVICES',
    route: ['./settings', 'devices'],
    icon: 'devices'
  },
  {
    label: 'EASYBSB_SIDEBAR_USERS',
    route: ['./settings', 'users'],
    icon: 'people'
  },
];

export const MENU_MIN_WIDTH = '70px';
export const MENU_MAX_WIDTH = '230px';
