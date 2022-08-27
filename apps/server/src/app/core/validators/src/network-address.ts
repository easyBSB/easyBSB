import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isNetworkAddress', async: false })
export class IsNetworkAddress implements ValidatorConstraintInterface {

  private readonly hexValue = new RegExp('^0x[0-9, A-F]{1,2}$');
  private readonly numberValue = new RegExp('^[0-9]{1,3}^$');

  validate(value: string): boolean {
    // this becomes allways invalid if value is not a hex oder numeric
    let address = -1;

    // convert hex to integer value
    if (this.hexValue.test(value)) {
      address = parseInt(value, 16);
    }

    // convert to decimal value
    if (this.numberValue.test(value)) {
      address = parseInt(value, 10);
    }

    if (address < 0 || address > 255) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    const allowed = '0x00 - 0xFF, 0 - 255';
    return `Invalid address ($value), allowed values are: ${allowed}`;
  }
}
