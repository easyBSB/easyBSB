import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toHex'})
export class ToHexPipe implements PipeTransform {
  transform(value: number | string): string {

    // is allready an hex value we do not validate but it starts with 0x
    if (typeof value === 'string' && value.startsWith('0x')) {
      return value;
    }

    const sanitized = String(value); 
    const numberVal = parseInt(sanitized, 10);

    if (isNaN(numberVal)) {
      return 'invalid number';
    }

    let hexVal = numberVal.toString(16).toUpperCase();
    if (hexVal.length < 2) hexVal = `0` + hexVal;
    return '0x' + hexVal;
  }
}
