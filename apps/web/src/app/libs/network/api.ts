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

export interface Device {
  address: number;
  bus_id: Bus['id'];
  id: number | string;
  vendor?: number;
  vendor_device?: number;
};
