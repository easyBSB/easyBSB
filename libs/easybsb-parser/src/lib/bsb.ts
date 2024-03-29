import { Command, Device, Payload } from "./interfaces";
import { lastValueFrom, map, Observable, Subject } from "rxjs";
import * as net from "net";
import * as stream from "stream";

import {AbstractTask, Queue} from "@easy-bsb/queue";

import { Helper } from "./Helper";
import * as Payloads from "./Payloads/";
import { Definition } from "./Definition";

// /* telegram addresses */
// #define ADDR_HEIZ  0x00
// #define ADDR_EM1   0x03
// #define ADDR_EM2   0x04
// #define ADDR_RGT1  0x06
// #define ADDR_RGT2  0x07
// #define ADDR_CNTR  0x08
// #define ADDR_DISP  0x0A
// #define ADDR_SRVC  0x0B
// #define ADDR_OZW   0x31
// #define ADDR_FE    0x32
// #define ADDR_RC    0x36
// #define ADDR_LAN   0x42
// #define ADDR_ALL   0x7F

export enum MSG_TYPE {
  /** request info telegram */
  QINF = 0x01,
  /** send info telegram */
  INF = 0x02,
  /** set parameter */
  SET = 0x03,
  /** acknowledge set parameter */
  ACK = 0x04,
  /** do not acknowledge set parameter */
  NACK = 0x05,
  /** query parameter */
  QUR = 0x06,
  /** answer query */
  ANS = 0x07,
  /** error */
  ERR = 0x08,
  /** query  reset value */
  QRV = 0x0f,
  /** answer reset value */
  ARV = 0x10,
  /** query reset value failed (1 byte payload of unknown meaning) */
  QRE = 0x11,
  /** internal query type 1 (still undecoded) */
  IQ1 = 0x12,
  /** internal answer type 1 (still undecoded) */
  IA1 = 0x13,
  /** internal query type 2 (still undecoded) */
  IQ2 = 0x14,
  /** internal answer type 2 (still undecoded) */
  IA2 = 0x15,
}

export interface RAWMessage {
  src: number;
  dst: number;
  typ: MSG_TYPE;
  cmd: number[];
  payload: number[];
  crc: number[];

  data: number[];
}

export interface busRequestAnswerNC {
  command: Command | null | undefined;
  value: Payload;
  msg: RAWMessage;
}

export interface busRequestAnswerC extends busRequestAnswerNC {
  command: Command;
}

interface DuplexToClose extends stream.Duplex {
  toClose?: boolean;
}

export type busRequestAnswer = null | busRequestAnswerC;

class BsbMessageTask extends AbstractTask<busRequestAnswer | undefined> {
  constructor(
    private readonly client: DuplexToClose | null,
    private readonly busCommand: Command,
    private readonly message: Uint8Array
  ) {
    super(5000)
  }

  get command(): Command {
    return this.busCommand
  }

  execute(): void {
    this.client?.write(this.message)
  }

  public finish(response: busRequestAnswer): void {
    super.complete(response)
  }
}

export class BSB {

  private queue: Queue<BsbMessageTask>;

  //#region Variables & Properties
  public Log$: Observable<busRequestAnswerNC>;
  private log$: Subject<busRequestAnswerNC>;

  public definition: Definition;
  private client: DuplexToClose | null = null;

  private buffer: number[] = [];

  public device: Device;

  private src: number;

  lastReceivedData: Date = new Date(0);
  private lastFetchDevice = 0;

  //#endregion

  //#region constructor
  constructor(definition: Definition, device: Device, src = 0xc2) {
    this.definition = definition;
    this.device = device;
    this.src = src;

    this.log$ = new Subject();
    this.Log$ = this.log$.asObservable();

    this.queue = new Queue();
    this.queue.parallelCount = 1;

    /** should we keep this one ? */
    setInterval(() => this.checkSendQueue(), 10);
  }
  //#endregion

  //#region connect
  public connect(stream: stream.Duplex): Promise<void>;
  public connect(ip: string, port: number): Promise<void>;
  public connect(param1: string | stream.Duplex, param2?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.client?.off("data", (data) => this.newData(data));
        if (this.client?.toClose) this.client.destroy();
        // eslint-disable-next-line no-empty
      } catch { }

      if (param1 instanceof stream.Duplex) {
        this.client = param1;
      } else {
        const socket = new net.Socket();
        /** 
         * event handlers we need only once, and remove if connection failed,
         * do not use anonymous function if we want to remove them.
         */
        let lastError: Error;
        const socketError = (error: Error) => lastError = error;
        const socketClose = () => reject(lastError);

        socket.once('error', socketError);
        socket.once('close', socketClose);

        socket.connect(param2 ?? 0, param1, () => {
          socket.removeListener('error', socketError);
          socket.removeListener('close', socketClose);
          resolve();
        });

        this.client = socket;
        this.client.toClose = true;
      }

      this.client.on("data", (data) => this.newData(data));
    })
  }
  //#endregion

  private checkSendQueue() {

    // if no device family or variant is set try to fetch
    if (
      (this.device.family == 0 || this.device.var == 0) &&
      Date.now() - this.lastFetchDevice > 2000
    ) {
      if (this.device.family == 0) {
        this.get(6225);
      }
      if (this.device.var == 0) {
        this.get(6226);
      }
      this.lastFetchDevice = Date.now();
    }
  }

  private calcCRC(data: number[]): [number, number] {
    function crc16(crc16: number, item: number): number {
      crc16 = crc16 ^ (item << 8);

      for (let i = 0; i < 8; i++) {
        if (crc16 & 0x8000) {
          crc16 = (crc16 << 1) ^ 0x1021;
        } else {
          crc16 <<= 1;
        }
      }
      return crc16 & 0xffff;
    }

    let crc = 0;

    for (let i = 0; i < data.length; i++) {
      crc = crc16(crc, data[i]);
    }

    return [(crc >> 8) & 0xff, (crc >> 0) & 0xff];
  }

  private parseMessage(msg: RAWMessage) {
    if (
      msg.typ == MSG_TYPE.QUR ||
      msg.typ == MSG_TYPE.QRV ||
      msg.typ == MSG_TYPE.SET ||
      msg.typ == MSG_TYPE.INF
    ) {
      const swap = msg.cmd[0];
      msg.cmd[0] = msg.cmd[1];
      msg.cmd[1] = swap;
    }

    const cmd = "0x" + Helper.toHexString(msg.cmd);
    const command = this.definition.findCMD(cmd, this.device);

    let value: string | object | null = null;

    if (
      msg.typ == MSG_TYPE.QUR ||
      msg.typ == MSG_TYPE.QRV ||
      msg.typ == MSG_TYPE.INF ||
      msg.typ == MSG_TYPE.SET
    ) {
      value = Helper.toHexString(msg.payload) as string;
      if (value.length > 0) value = "Payload: 0x" + value;
    }

    if (command) {
      if (
        msg.typ == MSG_TYPE.ANS ||
        msg.typ == MSG_TYPE.ARV ||
        msg.typ == MSG_TYPE.INF
      ) {
        value = Payloads.from(msg.payload, command);

        if (value instanceof Payloads.Number && value.value) {
          if (value.value && command.parameter == 6225)
            this.device.family = value.value;

          if (value.value && command.parameter == 6226)
            this.device.var = value.value;
        }
      }

      if (
        msg.typ == MSG_TYPE.ERR ||
        msg.typ == MSG_TYPE.QRE ||
        msg.typ == MSG_TYPE.NACK
      ) {
        value = new Payloads.Error(msg.payload);
      }

      // for INF Messages, see the reRead from the bus as successfully receive
      if (
        msg.typ != MSG_TYPE.QUR &&
        msg.typ != MSG_TYPE.QRV &&
        msg.typ != MSG_TYPE.SET
      ) {

        for (const task of this.queue.ActiveTasks) {
          if (task.command.command === command.command) {
            task.finish({
              msg: msg,
              command: command,
              value: value as Payload,
            })
          }
        }
      }
    }

    this.log$.next({
      msg: msg,
      command: command,
      value: value as Payload,
    });
  }

  private parseBuffer() {
    let pos = 0;

    while (pos < this.buffer.length) {
      // BSB
      if (pos < this.buffer.length - 4 && this.buffer[pos] == 0xdc) {
        const len = this.buffer[pos + 3];

        if (pos < this.buffer.length - len + 1) {
          const newmessage = this.buffer.slice(pos, pos + len);

          const crc = Helper.toHexString(
            newmessage.slice(newmessage.length - 2)
          );
          const crcCalculated = Helper.toHexString(
            this.calcCRC(newmessage.slice(0, newmessage.length - 2))
          );

          if (crc == crcCalculated) {
            const msg: RAWMessage = {
              data: newmessage,
              src: newmessage[1] & 0x7f,
              dst: newmessage[2],
              typ: newmessage[4],
              cmd: newmessage.slice(5, 9),
              crc: newmessage.slice(newmessage.length - 2),
              payload: newmessage.slice(9, newmessage.length - 2),
            };
            this.parseMessage(msg);

            // todo if pos <> 0, send message with
            // unprocessed data

            this.buffer = this.buffer.slice(pos + len);

            pos = -1;
          } else {
            // wrong CRC ??
          }
        }
      }
      pos++;
    }
  }

  private newData(data: number[]) {
    this.lastReceivedData = new Date();
    for (let i = 0; i < data.length; i++) {
      this.buffer.push(~data[i] & 0xff);
    }
    this.parseBuffer();
  }

  public sentCommand(
    param: number,
    type: MSG_TYPE,
    value?: unknown,
    dst = 0x00
  ): Promise<busRequestAnswer> {
    const command = this.definition.findParam(param, this.device);

    if (command) {
      let readonly = (command.flags?.indexOf("READONLY") ?? -1) != -1;

      if (this.device.family == 255 && this.device.var == 255) readonly = true;

      const cmd: number[] = Array.prototype.slice.call(
        Buffer.from(command.command.replace(/0x/g, ""), "hex"),
        0
      );

      let len = 11;
      let payload: number[] = [];

      if (value && type == MSG_TYPE.SET) {
        if (readonly) {
          // ToDo: ERROR write not possible for readonly
          return new Promise((done) => {
            done(null);
          });
        }
        payload = Payloads.from(value as string, command).toPayload();

        len += payload.length;
      }

      if (
        type == MSG_TYPE.QUR ||
        type == MSG_TYPE.SET ||
        type == MSG_TYPE.INF ||
        type == MSG_TYPE.QRV
      ) {
        const swap = cmd[0];
        cmd[0] = cmd[1];
        cmd[1] = swap;
      }

      let data = [0xdc, this.src | 0x80, dst, len, type, ...cmd, ...payload];
      data = [...data, ...this.calcCRC(data)];

      for (let i = 0; i < data.length; i++) data[i] = ~data[i] & 0xff;

      const task = new BsbMessageTask(this.client, command, Uint8Array.from(data));
      this.queue.registerAndStart(task)
      /** 
       * @todo return task directly so we can cancel it
       */
      return lastValueFrom(task.destroyed.pipe(
        map(() => task.result as busRequestAnswer)
      ))
    }

    return new Promise((done) => {
      done(null);
    });
  }

  public async set(param: number, value: unknown, dst = 0x00) {
    return await this.sentCommand(param, MSG_TYPE.SET, value, dst);
  }

  public async getResetValue(
    param: number | number[],
    dst = 0x00
  ): Promise<busRequestAnswer[]> {
    if (!Array.isArray(param)) {
      param = [param];
    }

    const queue = [];
    for (const item of param) {
      queue.push(this.sentCommand(item, MSG_TYPE.QRV, undefined, dst));
    }
    return await Promise.all(queue);
  }

  public async get(
    param: number | number[],
    dst = 0x00
  ): Promise<busRequestAnswer[]> {
    if (!Array.isArray(param)) {
      param = [param];
    }

    const queue = [];
    for (const item of param) {
      queue.push(this.sentCommand(item, MSG_TYPE.QUR, undefined, dst));
    }
    return await Promise.all(queue);
  }
}
