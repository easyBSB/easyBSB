import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as definition from "@easybsb/bsbdef";
import { BSB, Definition } from "@easybsb/parser";
import { BusService } from "./bus.service";
import { DeviceService } from "./device.service";
import { BsbStorage } from "./bsb-store";
import { BSBDefinition, Category } from "../../../../../../libs/easybsb-parser/src/lib/interfaces";

@Injectable()
export class ConnectionBootstrap implements OnApplicationBootstrap {

  constructor(
    private readonly busService: BusService,
    private readonly deviceService: DeviceService,
    private readonly bsbStorage: BsbStorage
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    for (const bus of await this.busService.list()) {
      // fetch all devices from bus and loop
      for (const device of await this.deviceService.list(bus.id)) {

        const def = new Definition(this.sanitizeDefinition(definition as unknown as BSBDefinition));
        const bsb = new BSB(def, {
          family: device.vendor,
          var: device.vendor_device
        }, bus.address);

        // not wait for connect
        bsb.connect(bus.ip_serial, bus.port)
          .then(() => {
            this.bsbStorage.register(bus.id, bsb);
          })
          .catch((error) => {
            console.error(error);
          })
          // bsb.Log$.subscribe((message) => console.dir(message));
      }
    }
  }

  /**
   * sanitize definition
   */
  private sanitizeDefinition(definition: BSBDefinition): BSBDefinition {

    const { version, compiletime, categories } = definition;
    const sanitized: BSBDefinition = {
      categories: {},
      compiletime,
      version,
    }

    for (const [index, category] of Object.entries(categories)) {
      const clonedCategory: Category = JSON.parse(JSON.stringify(category));
      const usedParams = new Set<number>();
      clonedCategory.commands = clonedCategory.commands.filter((command) => {
        if (!usedParams.has(command.parameter)) {
          usedParams.add(command.parameter);
          return true;
        }
        return false;
      });
      sanitized.categories[index] = clonedCategory;
    }

    return sanitized;
  }
}
