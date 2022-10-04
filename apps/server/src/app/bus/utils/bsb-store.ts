import { Injectable } from "@nestjs/common";
import { Bus } from '../model/bus.entity';
import { BSB } from "../../../../../../libs/easybsb-parser/src/lib/bsb";

@Injectable()
export class BsbStorage {

  private store: Map<Bus['id'], BSB> = new Map();

  public register(id: Bus['id'], bsb: BSB) {
    if (!this.store.has(id)) {
      this.store.set(id, bsb);
    }
  }

  public getById(id: Bus['id']): BSB | undefined {
    if (this.store.has(id)) {
      return this.store.get(id);
    }
  }
}
