import { BSBDefinition, CmdMap, Command, Device } from "./interfaces";

export class Definition {
  public config: BSBDefinition;

  private mapCmds: CmdMap = {};
  private mapParams: CmdMap = {};

  constructor(config: BSBDefinition) {
    this.config = config;

    for (const catKEY in this.config.categories) {
      const cat = this.config.categories[catKEY];
      for (const item of cat.commands) {
        // const map = this.mapCmds[item.command];
        if (!this.mapCmds[item.command]) this.mapCmds[item.command] = [];

        this.mapCmds[item.command].push(item);

        if (!this.mapParams[item.parameter])
          this.mapParams[item.parameter] = [];

        this.mapParams[item.parameter].push(item);
      }
    }
  }

  private find(
    place: "Cmd" | "Param",
    key: string,
    dev_family: number,
    dev_variant: number
  ): Command | null {
    let item: Command[];

    // todo take care of NO_CMD flag

    if (place == "Cmd") {
      item = this.mapCmds[key];
    } else {
      item = this.mapParams[key];
    }
    if (item)
      for (const entry of item) {
        for (const device of entry.device) {
          if (device.family == dev_family && device.var == dev_variant)
            return entry;
        }
      }
    return null;
  }

  private findCMDorParam(
    place: "Cmd" | "Param",
    key: string,
    device: Device
  ): Command | null {
    let result: Command | null = null;

    // search for exact match of family and variant
    result = this.find(place, key, device.family, device.var);
    if (result) return result;

    // search for exact match of family
    result = this.find(place, key, device.family, 255);
    if (result) return result;

    // search for exact 255,255
    result = this.find(place, key, 255, 255);
    if (result) return result;

    return null;
  }

  public findCMD(cmd: string, device: Device): Command | null {
    return this.findCMDorParam("Cmd", cmd, device);
  }

  public findParam(param: number, device: Device): Command | null {
    return this.findCMDorParam("Param", param.toString(), device);
  }
}
