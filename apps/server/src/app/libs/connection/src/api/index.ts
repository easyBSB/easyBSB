import { busRequestAnswerC, LanguageKeys } from "@easybsb/parser";
import { EasybsbCategory } from "@lib/network";
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

export interface IConnection {

  readonly id: string;

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
