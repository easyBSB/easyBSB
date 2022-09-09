import { InjectionToken } from "@angular/core";
import { Bus, Device } from "../api";

/**
 * @description memory store to store all bus systems and related devices.
 */
export interface NetworkStore {
  addBus(bus: Bus): void;
  getBus(id: Bus['id']): Bus | undefined;
  removeBus(bus: Bus): void;
  setDevices(bus: Bus, devices: Device[]): void;
  getDevices(bus: Bus): Device[] | undefined;
  removeDevice(bus: Bus, device: Device): void;
}

export class NetworkMemoryStore implements NetworkStore {

  private networkStore: Map<Bus['id'], Bus> = new Map();  
  private busStore: WeakMap<Bus, Device[] | undefined> = new WeakMap(); 

  /**
   * @description add new bus
   */
  public addBus(bus: Bus): void {
    let devices: Device[] | undefined = void 0;

    if (this.networkStore.has(bus.id) && this.busStore.has(bus)) {
      return;
    }
    
    /**
     * bus gets updated, since we are stateless it is not the same
     * object anymore. So we have to remove the bus before
     */
    if (this.networkStore.has(bus.id) && !this.busStore.has(bus)) {
      const removal = this.networkStore.get(bus.id) as Bus;
      devices = this.busStore.get(removal);
      this.removeBus(removal);
    }

    /**
     * add new bus and devices
     */
    this.networkStore.set(bus.id, bus);
    this.busStore.set(bus, devices);
  }

  public getBus(id: Bus['id']): Bus | undefined {
    return this.networkStore.get(id);
  }

  /**
   * @description remove bus
   */
  public removeBus(bus: Bus): void {
    if (this.networkStore.has(bus.id)) {
      const removal = this.networkStore.get(bus.id) as Bus;

      this.networkStore.delete(bus.id);
      this.busStore.delete(removal);
    }
  }

  /**
   * @description attach devices to an bus, create bus
   * if not exists
   */
  public setDevices(bus: Bus, devices: Device[]): void {
    if (!this.networkStore.has(bus.id)) {
      this.addBus(bus);
    }
    this.busStore.set(bus, devices);
  }

  /**
   * @description get devices from bus
   */
  public getDevices(bus: Bus): Device[] | undefined {
    if (this.busStore.has(bus)) {
      return this.busStore.get(bus);
    }
    return void 0;
  }

  /**
   * @description remove device from existing bus
   */
  public removeDevice(bus: Bus, device: Device): void {
    const devices = this.getDevices(bus);
    if (!devices) {
      throw Error('could not remove device from store');
    }

    const result = devices.filter((item) => item !== device)
    this.setDevices(bus, result);
  }
}

export const NetworkStore = new InjectionToken<NetworkStore>(`network storage`);