export enum BusType {
  Serial = 'serial',
  TcpIP  = 'tcpip'
}

export interface Bus {
  address: number;
  id: number | string;
  ip_serial: string;
  name: string;
  port: number;
  type: 'serial' | 'tcpip';
}

export interface Device {
  address: number;
  bus_id: Bus['id'];
  id: number | string;
  name: string;
  vendor?: number;
  vendor_device?: number;
};
