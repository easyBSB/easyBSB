import { Subjects } from "@app/core/permissions";

interface MenuEntry {
  label: string;
  icon: string;
  name: string;
  route?: string[];
  bottom?: boolean;
  subject?: Subjects;
}

export const MenuEntries: MenuEntry[] = [
  {
    label: 'EASYBSB_SIDEBAR_DASHBOARD',
    route: ['./'],
    name: 'home',
    icon: 'home'
  },
  {
    label: 'EASYBSB_SIDEBAR_DEVICES',
    route: ['./settings', 'devices'],
    icon: 'devices',
    name: 'devices',
    subject: Subjects.Devices
  },
  {
    label: 'EASYBSB_SIDEBAR_USERS',
    route: ['./settings', 'users'],
    icon: 'people',
    name: 'users',
    subject: Subjects.User
  },
];

export const MENU_MIN_WIDTH = '70px';
export const MENU_MAX_WIDTH = '230px';
