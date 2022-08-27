import { ValidationErrors, ValidationResult } from "@app/core/validators";
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
    const validationResult = await this.validateParams(payload);

    // should invert this one so we returns an validation message or NULL
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

  private async validateParams(bus: Bus): Promise<ValidationResult> {
    return validate(bus).then((errors): ValidationResult => {
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
