import { Value, Command } from "../interfaces";

export class HourMinute implements Value<Date> {
  public value: Date | null = null;
  command: Command;

  constructor(data: number[] | string | Date | null, command: Command) {
    this.command = command;
    if (data instanceof Array) {
      const payload = data;
      if ((payload[0] & 0x01) != 0x01) {
        this.value = new Date(0, 0, 0, payload[1], payload[2]);
      } else this.value = null;
    } else if (data instanceof Date) {
      this.value = data;
    } else if (typeof data == "string") {
      this.value = new Date(data);
    }
  }

  public toPayload() {
    return [];
  }

  public toString() {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: undefined,
    };
    return this.value?.toLocaleTimeString("de-DE", options) ?? "---";
  }
}
