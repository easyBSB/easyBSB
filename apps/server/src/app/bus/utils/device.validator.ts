import { validate } from "class-validator";
import { ValidationErrors, ValidationResult } from "../../core/validators";
import { Device } from "../model/device.entity";

/**
 * device validation helper
 */
export class DeviceValidator {

  /*
  public constructor(
    // @InjectRepository(Device) private readonly repository: Repository<Device>
  ) {}
  */

  /**
   * @description validate bus is valid by data
   */
  async isValid(device: Device): Promise<ValidationResult> {
    return validate(device).then((errors): ValidationResult => {
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
