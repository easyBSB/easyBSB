import * as definition from '@easybsb/bsbdef'
import { BSB } from './bsb'
import { Definition } from './Definition'
import { BSBDefinition } from './interfaces'

// @TODO singleton
export class BsbCore {

    private connection: BSB

    async log() {
        if (!this.connection) {
            this.connection = this.createConnection()
        }

        return await this.connection.get(700);
    }

    private createConnection() {
        const def = new Definition(definition as unknown as BSBDefinition)

        // could have multiple ones ?
        const bsb = new BSB(def, { family: 163, var: 5}, 0XC3)

        // multiple connections but if exists do not create again
        bsb.connect('192.168.203.179', 1000)

        bsb.Log$.subscribe({
            next: (payload) => console.log(payload),
            error: (error) => console.error(error)
        })

        return bsb
    }
}

// 700
// 8310 kessel temp
// 8311 kessel sollwert
