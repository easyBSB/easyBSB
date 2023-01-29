import { BSB, busRequestAnswerC, Command, Definition, LanguageKeys, TranslateItem } from "@easy-bsb/parser";
import { Bus, Device } from "@easy-bsb/server/lib/network";
import { Observable, Subject } from "rxjs";
import { ConnectionMessage, ConnectionMessageType, EasybsbCategory, EasybsbCommand, EasybsbCommandEnum, EasybsbCommandType, IConnection } from "../api";

export class Connection implements IConnection {

  public readonly id: Bus['id'];

  private readonly message$ = new Subject<ConnectionMessage>();

  private isConnected = false;

  private bsb?: BSB;

  constructor(
    private readonly bus: Bus,
    private readonly device: Device,
    private readonly bsbDefinition: Definition
  ) {
    this.id = bus.id;
  }

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

  getConfiguration(lang: LanguageKeys): Record<string, EasybsbCategory> {
    const i18nKey = lang;
    const categories = this.bsb.definition.config.categories;
    const result: Record<string, EasybsbCategory> = {};

    for (const [key, category] of Object.entries(categories)) {
      const commands: EasybsbCommand[] = [];
      const name = this.translateItem(category.name, i18nKey);

      for (const command of category.commands) {
        const commandType: EasybsbCommandType = { ...command.type, unit: this.translateItem(command.type.unit, i18nKey)};
        const commandEnum: EasybsbCommandEnum = this.translateCommandEnum(command, i18nKey);
        const commandDescription = this.translateItem(command.description, i18nKey);
        commands.push({ 
          ...command,
          description: commandDescription,
          enum: commandEnum,
          type: commandType
        });
      }
      result[key] = { ...category, name, commands };
    }

    return result;
  }

  getParam(param: number): Promise<busRequestAnswerC[]> {
    return this.bsb.get(param);
  }

  private sendMessage(type: ConnectionMessageType, message: string) {
    this.message$.next({
      message,
      type
    })
  }

  /**
   * @description translate command enum values
   */
  private translateCommandEnum(command: Command, i18nKey: LanguageKeys): EasybsbCommandEnum | undefined {
    if (!command.enum) {
      return;
    }

    const result: EasybsbCommandEnum = {};
    for (const [key, value] of Object.entries(command.enum)) {
      result[key] = this.translateItem(value, i18nKey);
    }
    return result;
  }

  /**
   * @description translate item by given language key otherwise return TEXT_KEY
   */
  private translateItem(data: TranslateItem, lang: LanguageKeys): string | undefined {
    if (!data) {
      return;
    }

    if (data[lang] && data[lang].trim() !== '') {
      return data[lang];
    }
    return data['KEY'];
  }
}
