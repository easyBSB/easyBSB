import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClassFromExist } from "class-transformer";
import { Repository } from "typeorm";
import { Bus } from "../model/bus.entity";
import { BusValidation } from "./bus.validators";
import { DeviceService } from "./device.service";

@Injectable()
export class BusService {

  private validationHelper: BusValidation;

  constructor(
    @InjectRepository(Bus) private readonly repository: Repository<Bus>,
    private readonly deviceService: DeviceService
  ) {
    this.validationHelper = new BusValidation(repository);
  }

  list(): Promise<Bus[] | null> {
    return this.repository.find();
  }

  async findById(id: Bus['id']): Promise<Bus | null> {
    return await this.repository.findOneBy({ id });
  }

  async delete(id: Bus['id']) {
    const bus: Bus = await this.findById(id);
    if (!bus) {
      throw new NotFoundException(`Bus with id: ${id} was not found`);
    }
    await this.repository.delete(id);
  }

  /**
   * @description insert new bus into database
   * @throws BadRequestExecption if validation failed
   */
  async insert(payload: Bus): Promise<Bus> {
    const validationResult = await this.validationHelper.isValid(payload);

    // should invert this one so we returns an validation message or NULL
    if (validationResult !== null) {
      throw new BadRequestException(validationResult);
    }

    // check bus address/name allready exists
    const result = await this.validationHelper.busNotExists(payload.address, payload.name);
    if (result !== null) {
      throw new BadRequestException(result);
    }

    try {
      const result = await this.repository.insert(payload);
      const lastInsertedId = result.identifiers.at(0).id;
      const created = await this.findById(lastInsertedId);

      /**
       * create new device with default settings
       */
      const device = this.deviceService.createPhantomDevice(created.id);
      await this.deviceService.insert(device);

      return created;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description update given bus by id
   */
  async update(id: Bus['id'], payload: Partial<Bus>): Promise<Bus> {
    const bus = await this.findById(id);
    if (!bus) {
      throw new BadRequestException('Bus not found');
    }

    const update = plainToClassFromExist(bus, payload);
    let validationResult = await this.validationHelper.isValid(update);
    if (validationResult !== null) {
      throw new BadRequestException(validationResult);
    }

    // validate name is not given
    validationResult = await this.validationHelper.busNotExists(update.address, update.name, id);
    if (validationResult !== null) {
      throw new BadRequestException(validationResult);
    }

    return this.repository.save(update);
  }
}
