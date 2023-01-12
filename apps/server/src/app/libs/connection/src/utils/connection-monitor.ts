import { Injectable } from "@nestjs/common";
import { IConnection } from "../api";

@Injectable()
export class ConnectionStorage {

  private connections = new Map<IConnection['id'], IConnection>();

  get(id: IConnection['id']): IConnection | undefined {
    return this.connections.get(id);
  }

  getConnections(): IConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * only add not connect directly so we can be lazy on this one
   */
  register(connection: IConnection): void {
    this.connections.set(connection.id, connection);
  }

  /**
   * remove an existing connection and disconnect
   */
  remove(id: IConnection['id']): void {
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
