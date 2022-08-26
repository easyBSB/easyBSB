export enum BusType {
  Serial = 'serial',
  TcpIP  = 'tcpip'
}

export interface Bus {
  id: number | string;
  address: number;
  name: string;
  type: 'serial' | 'tcpip';
  port: number;
}

export interface BusListItem {
  isPhantom: boolean;
  mode: 'read' | 'write';
  raw: Bus;
}
