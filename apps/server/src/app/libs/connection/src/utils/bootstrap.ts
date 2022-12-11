import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as definition from "@easybsb/bsbdef";
import { BSBDefinition, Category, Definition } from "@eaysbsb/parser";
import { BusService, DeviceService } from "@lib/network";
import { ConnectionMonitor } from "./connection-monitor";

@Injectable()
export class ConnectionBootstrap implements OnApplicationBootstrap {

  constructor(
    private readonly busService: BusService,
    private readonly deviceService: DeviceService,
    private readonly connectionMonitor: ConnectionMonitor
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    for (const bus of await this.busService.list()) {
      for (const device of await this.deviceService.list(bus.id)) {
        const def = new Definition(this.sanitizeDefinition(definition as unknown as BSBDefinition));
        const connection = this.connectionMonitor.addConnection(bus, device, def);

        // connect directly
        await connection.connect();
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
