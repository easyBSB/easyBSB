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
    label: 'Users',
    route: ['./settings', 'users'],
    icon: 'people'
  },
  {
    label: 'Devices',
    route: ['./settings', 'devices'],
    icon: 'devices'
  }
];

export const MENU_MIN_WIDTH = '24px';
export const MENU_MAX_WIDTH = '160px';
