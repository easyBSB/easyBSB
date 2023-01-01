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
  getDevices(bus: Bus): Device[] | undefined;
  updateDevice(device: Device): void;
  removeDevice(device: Device): void;
  setDevices(bus: Bus, devices: Device[]): void;
}

export class NetworkMemoryStore implements NetworkStore {

  private networkStore: Map<Bus['id'], Bus> = new Map();  
  private busStore: WeakMap<Bus, Device[] | undefined> = new WeakMap(); 

  addBus(bus: Bus, devices: Device[] | undefined = void 0): void {
    if (this.networkStore.has(bus.id) && this.busStore.has(bus)) {
      return;
    }
    this.networkStore.set(bus.id, bus);
    this.busStore.set(bus, devices);
  }

  getBus(id: Bus['id']): Bus | undefined {
    return this.networkStore.get(id);
  }

  getBusList(): Bus[] | undefined {
    const items = Array.from(this.networkStore.values());

    if (items.length > 0) {
      return Array.from(this.networkStore.values());
    }

    return void 0
  }

  removeBus(bus: Bus): void {
    if (this.networkStore.has(bus.id)) {
      const removal = this.networkStore.get(bus.id) as Bus;

      this.networkStore.delete(bus.id);
      this.busStore.delete(removal);
    }
  }

  addDevice(device: Device): void {
    const bus = this.getBus(device.bus_id);
    if (!bus) {
      throw `No bus for device found`;
    }
    const devices = [...this.getDevices(bus) ?? [], device];
    this.setDevices(bus, devices);
  }

  setDevices(bus: Bus, devices: Device[]): void {
    if (!this.networkStore.has(bus.id)) {
      this.addBus(bus);
    }
    this.busStore.set(bus, devices);
  }

  getDevices(bus: Bus): Device[] | undefined {
    if (this.busStore.has(bus)) {
      return this.busStore.get(bus);
    }
    return void 0;
  }

  removeDevice(device: Device): void {
    const bus = this.getBus(device.bus_id);
    const devices = bus ? this.getDevices(bus) : void 0;

    if (!bus || !devices) {
      throw Error('could not remove device from store');
    }

    const result = devices.filter((item) => item !== device)
    this.setDevices(bus, result);
  }

  updateBus(bus: Bus) {
    const source = this.getBus(bus.id);

    if (source) {
      const devices = this.busStore.get(source);
      this.removeBus(source);
      this.addBus(bus, devices);
    }
  }

  updateDevice(device: Device): void {
    const source = this.getBus(device.bus_id);
    let devices: Device[] | undefined;

    if (source) {
      devices = this.busStore.get(source)?.map((entity) => {
        return entity.id === device.id ? device : entity
      });

      this.setDevices(source, devices ?? [device]);
    }
  }
}

export const NetworkStore = new InjectionToken<NetworkStore>(`network storage`);