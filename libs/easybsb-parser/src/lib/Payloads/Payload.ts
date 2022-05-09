/* eslint-disable no-fallthrough */
import { Command } from "../interfaces";
import * as Payloads from "./"

/**
 * Create a new Payload object for the command
 * @param data can be a payload with datatype number[] or data with string, number or null for empty
 * @param command the command
 */
export function from(data: number[] | number | string | null, command: Command) {
    switch (command.type.datatype) {
        case 'BITS':
            return new Payloads.Bit(data, command)
        case 'ENUM':
            return new Payloads.Enum(data, command)
        case 'VALS':
            return new Payloads.Number(data, command)
        case 'DDMM':
            if (typeof data !== 'number')
                return new Payloads.DayMonth(data, command)
        case 'DTTM':
            switch (command.type.name) {
                case 'DATETIME':
                    return new Payloads.DateTime(data, command)
                // TODO remove
                case 'TIMEPROG':
                    if (typeof data !== 'number')
                        return new Payloads.TimeProg(data, command)
            }
            break;
        case 'TMPR':
            if (typeof data !== 'number')
                return new Payloads.TimeProg(data, command)
        case 'HHMM':
            if (typeof data !== 'number')
                return new Payloads.HourMinute(data, command)
        case 'STRN':
            return new Payloads.String(data, command)
        case 'DWHM':
        // ignore only PPS
    }

    // ToDo add RawPayload as result, with toString of 0x0000
    return new Payloads.Error(data)
}