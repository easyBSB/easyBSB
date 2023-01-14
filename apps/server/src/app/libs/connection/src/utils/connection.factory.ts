import { BSBDefinition, Category, Definition } from "@easybsb/parser";
import * as definition from "@easybsb/bsbdef";
import { Injectable } from "@nestjs/common";
import { Bus, Device } from "@lib/network";

import { IConnection } from "../api";
import { Connection } from "../classes/connection";

@Injectable()
export class ConnectionFactory {

  create(bus: Bus, device: Device): IConnection {
    const def = new Definition(this.sanitizeDefinition(definition as unknown as BSBDefinition));
    const connection = new Connection(bus, device, def);
    return connection;
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
