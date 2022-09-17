import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClassFromExist } from "class-transformer";
import { Repository } from "typeorm";
import { Bus } from "../model/bus.entity";
import { Device } from "../model/device.entity";
import { DeviceValidator } from "./device.validator";

@Injectable()
export class DeviceService {

  constructor(
    @InjectRepository(Device) private readonly repository: Repository<Device>,
    private readonly validationHelper: DeviceValidator
  ) {}

  list(bus: Bus['id']): Promise<Device[] | null> {
    return this.repository.find({
      where: [{
        bus_id: bus
      }]
    });
  }

  async findById(id: Device['id']): Promise<Device | null> {
    return await this.repository.findOneBy({ id });
  }

  async delete(id: Device['id']) {
    const device: Device = await this.findById(id);
    if (!device) {
      throw new NotFoundException(`Device with id: ${id} was not found`);
    }
    await this.repository.delete(id);
  }

  /**
   * @description insert new bus into database
   * @throws BadRequestExecption if validation failed
   */
  async insert(payload: Device): Promise<Device> {
    const validationResult = await this.validationHelper.isValid(payload);

    if (validationResult !== null) {
      throw new BadRequestException(validationResult);
    }

    try {
      const result = await this.repository.insert(payload);
      const lastInsertedId = result.identifiers.at(0).id;
      return this.findById(lastInsertedId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description update given device by id
   */
  async update(id: Device['id'], payload: Partial<Device>): Promise<Device> {
    const device = await this.findById(id);
    if (!device) {
      throw new BadRequestException('Device not found');
    }

    const update = plainToClassFromExist(device, payload);
    const validationResult = await this.validationHelper.isValid(update, true);
    if (validationResult !== null) {
      throw new BadRequestException(validationResult);
    }

    return this.repository.save(update);
  }
}
