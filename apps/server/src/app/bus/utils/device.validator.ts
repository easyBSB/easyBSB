import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { FindOptionsWhere, Not, Repository } from "typeorm";
import { ValidationErrors, ValidationResult } from "../../core/validators";
import { Bus } from "../model/bus.entity";
import { Device } from "../model/device.entity";

/**
 * device validation helper
 */
export class DeviceValidator {

  public constructor(
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Bus) private readonly busRepository: Repository<Bus>
  ) { }

  /**
   * @description validate bus is valid by data
   */
  async isValid(device: Device, isUpdate = false): Promise<ValidationResult | null> {
    let validationResult: ValidationResult | null = null;

    /** validate device */
    const result = await validate(device);
    if (result.length > 0) {
      validationResult = result.reduce<ValidationErrors>((result, current) => {
        return { ...result, ...current.constraints }
      }, {});
    }

    if (validationResult === null) {
      validationResult = await this.busExists(device);
    }

    if (validationResult === null) {
      validationResult = await this.deviceNameNotInUse(device, isUpdate);
    }

    if (validationResult === null) {
      validationResult = await this.addressNotInUse(device, isUpdate);
    }

    return validationResult
  }

  /**
   * @description validate the bus exists, a devices needs a bus otherwise it
   * will not work
   */
  private async busExists(device: Device): Promise<ValidationResult | null> {
    const busExists = await this.busRepository.findOneBy({ id: device.bus_id });
    if (!busExists) {
      return {
        busNotExists: `Bus not found`
      }
    }
    return null;
  }

  /**
   * @description validate name for device is not in use globally
   */
  private async deviceNameNotInUse(device: Device, isUpdate = false): Promise<ValidationResult | null> {
    const findOptions: FindOptionsWhere<Device> = { 
      name: device.name
    };

    if (isUpdate) {
      findOptions['id'] = Not(device.id);
    }

    // mhm not sure we make another db operation for this 
    const deviceExists = await this.deviceRepository.findOneBy(findOptions);
    if (deviceExists) {
      return {
        nameAllreadyInUse: `Name for device alleready in use.`
      }
    }
    return null;
  }

  /**
   * @description validate a given device.address not exists allready on bus
   */
  private async addressNotInUse(device: Device, isUpdate = false): Promise<ValidationResult | null> {
    const findOptions: FindOptionsWhere<Device> = { 
      bus_id: device.bus_id,
      address: device.address
    };

    if (isUpdate) {
      findOptions['id'] = Not(device.id);
    }

    const deviceExists = await this.deviceRepository.findOneBy(findOptions);
    if (deviceExists) {
      return {
        addressAllreadyInUse: `Address for device alleready in use.`
      }
    }
    return null;
  }
}
