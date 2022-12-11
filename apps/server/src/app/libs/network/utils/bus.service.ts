import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { Repository } from "typeorm";
import { Bus } from "../model/bus.entity";
import { Device } from "../model/device.entity";
import { BusValidation } from "./bus.validators";
import { DeviceService } from "./device.service";

@Injectable()
export class BusService {

  private validationHelper: BusValidation;

  constructor(
    @InjectRepository(Bus) private readonly busRepository: Repository<Bus>,
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    private readonly deviceService: DeviceService
  ) {
    this.validationHelper = new BusValidation(busRepository);
  }

  list(): Promise<Bus[] | null> {
    return this.busRepository.find();
  }

  async findById(id: Bus['id']): Promise<Bus | null> {
    return await this.busRepository.findOneBy({ id });
  }

  async delete(id: Bus['id']) {
    const bus: Bus = await this.findById(id);
    if (!bus) {
      throw new NotFoundException(`Bus with id: ${id} was not found`);
    }

    // remove all devices which exists on bus
    const devices = await this.deviceService.find({ where: { bus_id: bus.id } });
    if (devices.length > 0) {
      const toRemove = devices.reduce<Device['id'][]>((result, device) => 
        result.concat(device.id)
      , [])
      await this.deviceService.delete(toRemove);
    }

    await this.busRepository.delete(id);
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
    const result = await this.validationHelper.busNotExists(payload);
    if (result !== null) {
      throw new BadRequestException(result);
    }

    try {
      const result = await this.busRepository.insert(payload);
      const lastInsertedId = result.identifiers.at(0).id;
      const created = await this.findById(lastInsertedId);

      /**
       * create new device with default settings
       */
      const device = await this.createFirstBusDevice(created);
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
    validationResult = await this.validationHelper.busNotExists(update, id);
    if (validationResult !== null) {
      throw new BadRequestException(validationResult);
    }

    return this.busRepository.save(update);
  }

  /**
   * @description create a device if bus has been created, it is important
   * the name must be unique global, so we have to check device exists allready.
   * 
   * If we found one we add an index until we find a free name.
   */
  private async createFirstBusDevice(bus: Bus): Promise<Device> {
    const queryBuilder = this.deviceRepository.createQueryBuilder('device');
    const query =  queryBuilder.where("device.name like :name", { name:`${bus.name}%` });
    const [devices, count] = await query.getManyAndCount();

    let name = bus.name
    let index = 1;

    if (count > 0) {
      let nameExists = false;
      do {
        nameExists = devices.some((device) => device.name === name);
        name = nameExists ? bus.name + ` (${index++})` : name; 
      } while (nameExists);
    }

    const deviceData: Omit<Device, 'id'> = {
      name,
      address: 0x00,
      bus_id: bus.id,
      vendor: 0,
      vendor_device: 0
    }
    return plainToClass(Device, deviceData);
  }
}
