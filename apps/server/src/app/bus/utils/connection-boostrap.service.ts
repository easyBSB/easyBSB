import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { BSB } from "../../../../../../libs/easybsb-parser/src/lib/bsb";
import { Definition } from "../../../../../../libs/easybsb-parser/src/lib/Definition";
import { BSBDefinition } from "../../../../../../libs/easybsb-parser/src/lib/interfaces";
import * as definition from "@easybsb/bsbdef";
import { BusService } from "./bus.service";
import { DeviceService } from "./device.service";
import { BsbStorage } from "./bsb-store";

@Injectable()
export class ConnectionBootstrap implements OnApplicationBootstrap {

  constructor(
    private readonly busService: BusService,
    private readonly deviceService: DeviceService,
    private readonly bsbStorage: BsbStorage
  ) {}

  async onApplicationBootstrap() {
    for (const bus of await this.busService.list()) {
      // fetch all devices from bus and loop
      for (const device of await this.deviceService.list(bus.id)) {
        const def = new Definition(definition as unknown as BSBDefinition);
        const bsb = new BSB(def, {
           family: device.vendor,
           var: device.vendor_device
          }, bus.address);

        bsb.connect(bus.ip_serial, bus.port);
        bsb.Log$.subscribe((message) => console.dir(message));
        this.bsbStorage.register(bus.id, bsb);
      }
    }
  }
}
