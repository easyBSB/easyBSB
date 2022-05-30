import { Value, Command } from "../interfaces";

export class DayMonth implements Value<Date> {
  public value: Date | null = null;
  command: Command;

  constructor(data: number[] | string | Date | null, command: Command) {
    this.command = command;

    if (data instanceof Array) {
      const payload = data;
      if ((payload[0] & 0x01) != 0x01) {
        this.value = new Date(0, payload[2] - 1, payload[3]);
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
      year: undefined,
      month: "2-digit",
      day: "2-digit",
    };
    return this.value?.toLocaleString("de-DE", options) ?? "---";
  }
}
