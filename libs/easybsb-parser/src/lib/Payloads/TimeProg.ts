import { Value, Command } from '../interfaces'

export class TimeProgEntry {
    public start?: Date
    public end?: Date

    constructor(data?: number[] | string) {
        if (data instanceof Array) {
            // check that data.len = 4
            this.start = new Date(0, 0, 0, data[0], data[1])
            this.end = new Date(0, 0, 0, data[2], data[3])
        }
        // todo add parse from string
    }

    public toString() {

        const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: undefined };
        return (this.start?.toLocaleTimeString('de-DE', options) ?? '--:--')
            + ' - '
            + (this.end?.toLocaleTimeString('de-DE', options) ?? '--:--')
    }

    public static empty = new TimeProgEntry()
}

export class TimeProg implements Value<TimeProgEntry[]> {

    public value: TimeProgEntry[] | null = null
    command: Command

    constructor(data: number[] | string | null, command: Command) {
        this.command = command;

        this.value = []

        if (data instanceof Array) {
            // const values = [];

            for (let i = 0; i < 3; i++) {
                // check if block is enabled
                if ((data.slice(4 * i)[0] & 0x80) != 0x80) {

                    this.value.push(new TimeProgEntry(data.slice(4 * i + 0, 4 * i + 4)))
                }

            }

            // let data = data;
            //     if ((data[0] & 0x01) != 0x01) {
            //         this.value = new Date(0, data[2]-1, data[3]);
            //     }
            //     else
            //         this.value = null;
        } else if (typeof (data) == 'string') {
            // ToDo Parse String
            //this.value = new Date(data)
        }
    }

    public toPayload () {
        return []
    }

    public toString() {

        let result = ''
        const val = this.value ?? [];

        for (let i = 0; i < 3; i++) {
            if (i > 0)
                result += ' '
            result += (i + 1) + '. '
            if (i < val.length) {
                result += val[i].toString()
            } else {
                result += TimeProgEntry.empty.toString()
            }
        }

        return result
    }
}
