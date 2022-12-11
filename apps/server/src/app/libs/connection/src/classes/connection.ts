import { Id } from "@core/decorators";
import { BSB, Definition } from "@easybsb/parser";
import { Bus, Device } from "@lib/network";
import { Observable, Subject } from "rxjs";
import { ConnectionMessage, ConnectionMessageType, IConnection } from "../api";

export class Connection implements IConnection {

  @Id(`connection`)
  public readonly id!: string;

  private readonly message$ = new Subject<ConnectionMessage>();

  private isConnected = false;

  private bsb?: BSB;

  constructor(
    private readonly bus: Bus,
    private readonly device: Device,
    private readonly bsbDefinition: Definition
  ) {}

  async connect(): Promise<void> {
    if (!this.isConnected) {
      this.bsb = new BSB(this.bsbDefinition, {
        family: this.device.vendor,
        var: this.device.vendor_device
      }, this.device.address);

      try {
        await this.bsb.connect(this.bus.ip_serial, this.bus.port);
        this.sendMessage(ConnectionMessageType.CONNECTED, `connected`);
        this.isConnected = true;
      } catch (error) {
        console.log(this.id);
        console.log(error);
        this.sendMessage(ConnectionMessageType.ERROR, error);
      }
    }
  }

  disconnect(): void {
    if (this.isConnected) {
      this.sendMessage(ConnectionMessageType.DISCONNECTED, `disconnected`);
    }
  }

  onMessage(): Observable<ConnectionMessage> {
    return this.message$.asObservable();
  }

  private sendMessage(type: ConnectionMessageType, message: string) {
    this.message$.next({
      message,
      type
    })
  }
}
