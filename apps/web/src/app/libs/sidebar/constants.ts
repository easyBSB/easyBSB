interface MenuEntry {
  label: string;
  icon: string;
  route?: string[];
  bottom?: boolean;
}

export const MenuEntries: MenuEntry[] = [
  {
    label: 'Dashboard',
    route: ['./'],
    icon: 'home'
  },
  {
    label: 'Devices',
    route: ['./settings', 'devices'],
    icon: 'devices'
  },
  {
    label: 'Users',
    route: ['./settings', 'users'],
    icon: 'people'
  },
];

export const MENU_MIN_WIDTH = '24px';
export const MENU_MAX_WIDTH = '160px';
