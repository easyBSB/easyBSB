import { Subjects } from "@app/core/permissions";

interface MenuEntry {
  label: string;
  icon: string;
  route?: string[];
  bottom?: boolean;
  subject?: Subjects;
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
    icon: 'devices',
    subject: Subjects.Devices
  },
  {
    label: 'EASYBSB_SIDEBAR_USERS',
    route: ['./settings', 'users'],
    icon: 'people',
    subject: Subjects.User
  },
];

export const MENU_MIN_WIDTH = '70px';
export const MENU_MAX_WIDTH = '230px';
