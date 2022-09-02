import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClassFromExist } from "class-transformer";
import { Repository } from "typeorm";
import { Device } from "./device.entity";

@Injectable()
export class DeviceService {

  constructor(
    @InjectRepository(Device) private readonly repository: Repository<Device>
  ) {}

  list(): Promise<Device[] | null> {
    return this.repository.find();
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
    /**
     * @todo validate payload before we save
     */
    try {
      const result = await this.repository.insert(payload);
      const lastInsertedId = result.identifiers.at(0).id;
      return this.findById(lastInsertedId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description update given bus by id
   */
  async update(id: Device['id'], payload: Partial<Device>): Promise<Device> {
    const device = await this.findById(id);
    if (!device) {
      throw new BadRequestException('Bus not found');
    }
    const update = plainToClassFromExist(device, payload);
    return this.repository.save(update);
  }
}
