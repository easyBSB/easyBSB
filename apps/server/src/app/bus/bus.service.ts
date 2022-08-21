import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { Bus } from "./bus.entity";

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus) private readonly repository: Repository<Bus>
  ) {}

  list(): Promise<Bus[] | null> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Bus | null> {
    return await this.repository.findOneBy({ id });
  }

  async insert(payload: Bus): Promise<Bus> {
    const isValid = await this.validateParams(payload);

    if (!isValid) {
      throw new BadRequestException();
    }

    try {
      const result = await this.repository.insert(payload);
      const lastInsertedId = result.identifiers.at(0).id;
      return this.findById(lastInsertedId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async validateParams(bus: Bus): Promise<boolean> {
    return validate(bus).then((errors) => {
      return errors.length === 0
    });
  }
}
