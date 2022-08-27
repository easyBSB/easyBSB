import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Bus } from "./bus.entity";
import { BusValidation } from "./bus.validators";

@Injectable()
export class BusService {

  private validationHelper: BusValidation;

  constructor(
    @InjectRepository(Bus) private readonly repository: Repository<Bus>
  ) {
    this.validationHelper = new BusValidation(repository);
  }

  list(): Promise<Bus[] | null> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Bus | null> {
    return await this.repository.findOneBy({ id });
  }

  /**
   * @description insert new bus into database
   * @throws BadRequestExecption if validation failed
   */
  async insert(payload: Bus): Promise<Bus> {
    const validationResult = await this.validationHelper.valid(payload);

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
      return this.findById(lastInsertedId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
