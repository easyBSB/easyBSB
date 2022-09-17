import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
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
  async isValid(device: Device): Promise<ValidationResult | null> {
    let validationResult: ValidationResult | null = null;

    /** validate device */
    const result = await validate(device);
    if (result.length > 0) {
      validationResult = result.reduce<ValidationErrors>((result, current) => {
        return { ...result, ...current.constraints }
      }, {});
    }

    /** validate bus exists */
    if (validationResult === null) {
      validationResult = await this.busExists(device);
    }

    /** validate combination of address and bus_id not exists */
    if (validationResult === null) {
      validationResult = await this.deviceNotExists(device);
    }

    return validationResult
  }

  /**
   * @description validate the bus exists, a devices needs a bus otherwise it
   * will not work
   */
  async busExists(device: Device): Promise<ValidationResult | null> {
    const busExists = await this.busRepository.findOneBy({ id: device.bus_id });
    if (!busExists) {
      return {
        busNotExists: `Bus not found`
      }
    }
    return null;
  }

  /**
   * @description validate a given device not exists in combination with bus_id and address
   * an bus can not have 2 devices with same address
   */
  async deviceNotExists(device: Device): Promise<ValidationResult | null> {
    const deviceExists = await this.deviceRepository.findOneBy({ 
      bus_id: device.bus_id,
      address: device.address 
    });
    if (deviceExists) {
      return {
        deviceWithAddressExists: `Device with given address on bus allready exists`
      }
    }
    return null;
  }
}
