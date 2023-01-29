import { busRequestAnswerC, Category, Command, LanguageKeys, Type } from "@easy-bsb/parser";
import { Bus } from "@easy-bsb/server/lib/network";
import { Observable } from "rxjs";

export enum ConnectionMessageType {
  CONNECTED,
  DISCONNECTED,
  ERROR,
}

export interface ConnectionMessage {

  type: ConnectionMessageType;

  message: string;
}

export interface EasybsbCommandType extends Omit<Type, 'unit'> {
  unit: string
}

export interface EasybsbCommandEnum {
  [key: string]: string;
}

export interface EasybsbCommand extends Omit<Command, 'description' | 'type' | 'enum'> {
  description: string;
  type: EasybsbCommandType
  enum: EasybsbCommandEnum
}

export interface EasybsbCategory extends Omit<Category, 'name' | 'commands'> {
  name: string;
  commands: EasybsbCommand[];
}

export interface IConnection {

  readonly id: Bus['id'];

  /**
   * connect to a device
   */
  connect(): Promise<void>;

  /**
   * disconnect from a device
   */
  disconnect(): void;

  /**
   * sends a message
   */
  onMessage(): Observable<ConnectionMessage>;

  /**
   * get configuration
   */
  getConfiguration(lang: LanguageKeys): Record<string, EasybsbCategory> | undefined;

  /**
   * get param
   */
  getParam(param: number): Promise<busRequestAnswerC[]>;
}
