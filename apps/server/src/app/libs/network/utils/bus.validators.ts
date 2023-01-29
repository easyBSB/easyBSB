import { validate } from "class-validator";
import { FindOptionsWhere, Not, Repository } from "typeorm";

import type { ValidationResult, ValidationErrors } from "../../../core/validators";
import type { Bus } from "../model/bus.entity";

export class BusValidation {

  public constructor(
    private readonly repository: Repository<Bus>
  ) {}

  /**
   * @description validates if address and/or name not allready exists
   */
  async busNotExists(entity: Bus, exclude?: Bus['id']): Promise<ValidationResult> {

    /** combination of ip_serial, port and type has to been unique */
    const filter: FindOptionsWhere<Bus> = {
      ip_serial: entity.ip_serial,
      port: entity.port,
      type: entity.type
    };

    if (exclude) {
      filter['id'] = Not(exclude);
    }

    const entities = await this.repository.findBy([filter]);
    if (entities.length === 0) {
      return null;
    }

    return {
      exists: `Bus allready exists.`
    };
  }

  /**
   * @description validate bus is valid by data
   */
  async isValid(bus: Bus): Promise<ValidationResult> {
    return validate(bus).then((errors): ValidationResult => {
      if (errors.length === 0) {
        return null;
      }

      return errors.reduce<ValidationErrors>((result, current) => {
        return {
          ...result,
          ...current.constraints
        }
      }, {});
    });
  }
}
