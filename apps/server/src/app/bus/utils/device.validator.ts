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

    /** validate bus exists */
    if (validationResult === null) {
      validationResult = await this.busExists(device);
    }

    /** validate combination of address and bus_id not exists */
    if (validationResult === null) {
      validationResult = await this.deviceNotExists(device, isUpdate);
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
   * @description validate a given device not exists in combination with bus_id and address
   * an bus can not have 2 devices with same address
   * 
   * what if the bus adress changes, then it is an update but more like create
   */
  private async deviceNotExists(device: Device, isUpdate: boolean): Promise<ValidationResult | null> {

    const findOptions: FindOptionsWhere<Device> = {
      bus_id: device.bus_id,
      address: device.address,
    };

    /** 
     * for an update it is important we check the bus has been changed, if not we have to
     * exclude the existing device address, otherwise it could happen we find the device 
     * we want to update if address has not been changed.
     */
    if (isUpdate) {
      const existingDevice = await this.deviceRepository.findOneBy({ id: device.id });
      if (existingDevice.bus_id === device.bus_id ) {
        findOptions['address'] =  Not(existingDevice.address);
      }
    }

    const deviceExists = await this.deviceRepository.findOneBy(findOptions);
    if (deviceExists) {
      return {
        deviceWithAddressExists: `Device with given address on bus allready exists`
      }
    }
    return null;
  }
}
