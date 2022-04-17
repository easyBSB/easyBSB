import { Value, Command } from '../interfaces'

export class Number implements Value<number> {

    public value: number | null = null
    private command: Command

    constructor(data: number[] | string | number | null, command: Command) {
        this.command = command;
        if (data instanceof Array) {

            let payload = data
            let len = command.type.payload_length & 31;
            let rawValue = 0

            // WORKAROUND: no length is defined from the command table
            // if the len is odd and no enable_byte, in most cases this should be added
            if ((payload.length == 3 || payload.length == 5) && command.type.enable_byte == 0) {
                command.type.enable_byte = 1;
            }

            if (len == 0)
                // if no enable_byte than just take length otherwise length-1
                len = payload.length - (command.type.enable_byte == 0 ? 0 : 1);

            let enabled = true;
            if (command.type.enable_byte > 0) {

                if ((payload[0] & 0x01) == 0x01)
                    enabled = false;

                payload = payload.slice(1);
            }

            if (enabled) {
                switch (len) {
                    case 1:
                        rawValue = Buffer.from(payload).readInt8();
                        break;
                    case 2:
                        rawValue = Buffer.from(payload).readInt16BE();
                        break;
                    case 4:
                        rawValue = Buffer.from(payload).readInt32BE();
                        break;
                }
                this.value = (rawValue / command.type.factor)
            }
            else {
                this.value = null
            }

        } else if (typeof (data) == 'number') {
            this.value = data
        } else if (typeof (data) == 'string') {
            this.value = parseInt(data, 10)
        }
    }

    public toPayload () {
        
        const len = this.command.type.payload_length & 31
        let enable_byte = this.command.type.enable_byte
        const bf = Buffer.allocUnsafe(len + (enable_byte > 0 ? 1: 0));
        if (enable_byte > 0)
        {
            if (this.value === null)
                enable_byte--

            bf.writeUInt8(enable_byte,0)
        }

        const value = (this.value ?? 0) * this.command.type.factor

        switch (len) {
            case 1:
                bf.writeInt8(value ?? 0,1)
                break;
            case 2:
                bf.writeInt16BE(value ?? 0,1);
                break;
            case 4:
                bf.writeInt32BE(value ?? 0,1);
                break;
        }

        const result = []
        for (let i = 0; i < bf.length; i++)
            result.push(bf[i])
        return result
    }

    public toString() {
        return this.value?.toFixed(this.command.type.precision) ?? '---'
    }
}
