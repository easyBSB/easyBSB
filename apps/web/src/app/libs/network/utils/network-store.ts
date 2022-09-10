import { InjectionToken } from "@angular/core";
import { Bus, Device } from "../api";

/**
 * @description memory store to store all bus systems and related devices.
 */
export interface NetworkStore {
  addBus(bus: Bus): void;
  getBus(id: Bus['id']): Bus | undefined;
  getBusList(): Bus[] | undefined;
  updateBus(bus: Bus): void;
  removeBus(bus: Bus): void;
  addDevice(device: Device): void;
  setDevices(bus: Bus, devices: Device[]): void;
  getDevices(bus: Bus): Device[] | undefined;
  removeDevice(device: Device): void;
}

export class NetworkMemoryStore implements NetworkStore {

  private networkStore: Map<Bus['id'], Bus> = new Map();  
  private busStore: WeakMap<Bus, Device[] | undefined> = new WeakMap(); 

  public addBus(bus: Bus, devices: Device[] | undefined = void 0): void {
    if (this.networkStore.has(bus.id) && this.busStore.has(bus)) {
      return;
    }
    this.networkStore.set(bus.id, bus);
    this.busStore.set(bus, devices);
  }

  public getBus(id: Bus['id']): Bus | undefined {
    return this.networkStore.get(id);
  }

  public getBusList(): Bus[] | undefined {
    const items = Array.from(this.networkStore.values());

    if (items.length > 0) {
      return Array.from(this.networkStore.values());
    }

    return void 0
  }

  public removeBus(bus: Bus): void {
    if (this.networkStore.has(bus.id)) {
      const removal = this.networkStore.get(bus.id) as Bus;

      this.networkStore.delete(bus.id);
      this.busStore.delete(removal);
    }
  }

  public updateBus(bus: Bus) {
    const source = this.getBus(bus.id);
    let devices: Device[] | undefined;

    if (source) {
      devices = this.busStore.get(source);
      this.removeBus(source);
      this.addBus(bus, devices);
    }
  }

  public addDevice(device: Device): void {
    const bus = this.getBus(device.bus_id);
    if (!bus) {
      throw `No bus for device found`;
    }
    const devices = [...this.getDevices(bus) ?? [], device];
    this.setDevices(bus, devices);
  }

  public setDevices(bus: Bus, devices: Device[]): void {
    if (!this.networkStore.has(bus.id)) {
      this.addBus(bus);
    }
    this.busStore.set(bus, devices);
  }

  public getDevices(bus: Bus): Device[] | undefined {
    if (this.busStore.has(bus)) {
      return this.busStore.get(bus);
    }
    return void 0;
  }

  public removeDevice(device: Device): void {
    const bus = this.getBus(device.bus_id);
    const devices = bus ? this.getDevices(bus) : void 0;

    if (!bus || !devices) {
      throw Error('could not remove device from store');
    }

    const result = devices.filter((item) => item !== device)
    this.setDevices(bus, result);
  }
}

export const NetworkStore = new InjectionToken<NetworkStore>(`network storage`);