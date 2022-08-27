import { validate } from "class-validator";
import { FindOptionsWhere, Not, Repository } from "typeorm";
import { ValidationErrors, ValidationResult } from "../core/validators";
import { Bus } from "./bus.entity";

export class BusValidation {

  public constructor(
    private readonly repository: Repository<Bus>
  ) {}

  /**
   * @description validates if address and/or name not allready exists
   */
  async busNotExists(address: Bus['address'], name: Bus['name'], exclude?: Bus['id']): Promise<ValidationResult> {
    const addressFilter: FindOptionsWhere<Bus> = { address: address };
    const nameFilter: FindOptionsWhere<Bus> = { name: name };
    if (exclude) {
      addressFilter['id'] = Not(exclude);
      nameFilter['id'] = Not(exclude);
    }

    const entities = await this.repository.findBy([addressFilter, nameFilter]);
    if (entities.length === 0) {
      return null;
    }

    const nameExists = entities.some((entity) => entity.name === name);
    const addressExists = entities.some((entity) => entity.address === address);
    const errors = {};

    if (nameExists) {
      errors['nameExists'] = `Bus with name ${name} allready exists`;
    }

    if (addressExists) {
      errors['addressExists'] = `Bus with address ${address} allready exists`;
    }

    return errors;
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
