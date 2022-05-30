import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EasyBsbConnection } from "./entities/connection.entity";

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(EasyBsbConnection)
    private readonly repository: Repository<EasyBsbConnection>
  ) {}

  addEntry() {
    this.repository.insert({
      ip: "123.456.789.0",
      name: "my field",
      port: 1234,
      hostId: 1,
    });
  }
}
