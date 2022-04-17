import { Value } from '../interfaces'

export class Error implements Value<number> {

    public value: number | null = null

    constructor(data: number[] | number | string | null) {
        if (data instanceof Array) {
            const payload = data
            switch (payload.length) {
                case 1:
                    this.value = Buffer.from(payload).readUInt8();
                    break;
                case 2:
                    this.value = Buffer.from(payload).readUInt16BE();
                    break;
                case 4:
                    this.value = Buffer.from(payload).readUInt32BE();
                    break;
            }

        } else if (typeof (data) == 'number') {
            this.value = data
        }
    }

    public toPayload () {
        return []
    }

    public toString(lang = 'KEY') {
        return this.value?.toString() ?? '0'
    }
}
