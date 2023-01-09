import { Definition } from "@easybsb/parser";
import { Bus, Device } from "@lib/network";
import { Injectable } from "@nestjs/common";
import { IConnection } from "../api";
import { Connection } from "../classes/connection";

@Injectable()
export class ConnectionMonitor {

  private connections = new Map<string, IConnection>();

  public getConnections(): IConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * only add not connect directly so we can be lazy on this one
   */
  addConnection(bus: Bus, device: Device, definition: Definition): IConnection {
    const connection = new Connection(bus, device, definition);
    this.connections.set(connection.id, connection);
    return connection;
  }

  /**
   * remove an existing connection and disconnect
   */
  removeConnection(id: Connection['id']): void {
    if (this.connections.has(id)) {
      this.connections.get(id).disconnect();
      this.connections.delete(id);
    }
  }

  /**
   * open a connection to a bus
   */
  async connectAll() {
    for (const connection of this.connections.values()) {
      await connection.connect();
    }
  }
}
