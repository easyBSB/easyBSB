import * as definition from "@easybsb/bsbdef";
import { BSB } from "./bsb";
import { Definition } from "./Definition";
import { BSBDefinition } from "./interfaces";

// @TODO singleton
export class BsbCore {
  private connection: BSB;

  log() {
    if (this.connection) {
      this.connection = this.createConnection();
    }

    this.connection = this.createConnection();
    this.connection.Log$.subscribe({
      next: (payload) => console.log(payload.value.toString()),
      error: (error) => console.error(error),
    });
  }

  private createConnection() {
    const def = new Definition(definition as unknown as BSBDefinition);
    const bsb = new BSB(def, { family: 0, var: 0 }, 0xc3);
    bsb.connect("192.168.203.179", 1000);
    return bsb;
  }
}
