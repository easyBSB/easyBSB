import { Value, Command, TranslateItem } from '../interfaces' 

import { Helper } from '../Helper'

export class Enum implements Value<number> {

    public value: number | null = null

    private enum: TranslateItem | null = null

    command: Command

    constructor(data: number[] | string | number | null, command: Command) {
        this.command = command;
        if (data instanceof Array) {

            let payload = data

            let enabled = true;
            if (command.type.enable_byte > 0) {

                if ((payload[0] & 0x01) == 0x01)
                    enabled = false;

                payload = payload.slice(1);
            }

            if (enabled) {
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
       
                let enumKey = '0x' + this.value?.toString(16).padStart(4,'0');
                this.enum = command.enum[enumKey]

                if (!this.enum && (command.type.name == 'ONOFF' || command.type.name == 'YESNO' || command.type.name == 'CLOSEDOPEN' || command.type.name == 'VOLTAGEONOFF')) {
                    // for toggle options only the last bit counts try if 0xFF was wrong again with 0x01
                    const val1Bit = (this.value ?? 0) & 0x01
                    enumKey = '0x' + val1Bit.toString(16).padStart(4,'0');
                    this.enum = command.enum[enumKey]
                }
            } else {
                this.value = null
            }
        } else if (typeof (data) == 'number') {
            this.value = data
        } else if (typeof (data) == 'string') {
            // if number -> parseInt
            // if real string -> search in ENUM Text
            //this.value = parseInt(data, 10)
        }
    }

    public toPayload () {
        return []
    }
    

    public toString(lang = 'KEY') {
        if (this.value) {
            return Helper.getLanguage(this.enum, lang) ?? 'ENUM: '+this.value.toString(16).toUpperCase()
        } else {
            return '---'
        }
    }
}
