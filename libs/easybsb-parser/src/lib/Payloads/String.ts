import { Value, Command } from "../interfaces";

export class String implements Value<string> {
  public value: string | null = null;
  command: Command;

  constructor(data: number[] | string | null | number, command: Command) {
    this.command = command;
    if (data instanceof Array) {
      const payload = data;
      if (payload.length == 0 || payload[0] == 0x00) {
        this.value = null;
      } else
        this.value =
          Buffer.from(data).toString("ascii").split("\0").shift() ?? null;
    } else if (typeof data == "string") {
      this.value = data;
    }
  }

  public toPayload() {
    return [];
  }

  public toString() {
    return this.value ?? "---";
  }
}
