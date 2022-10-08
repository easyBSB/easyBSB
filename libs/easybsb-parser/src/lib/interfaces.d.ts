export interface Value<T> extends Payload {
  value: T | null;
}

export interface Payload {
  toString: (lang?: string) => string;
  toPayload: () => number[];
}

export interface BSBDefinition {
  version: string;
  compiletime: string;
  categories: KeyItem<Category>;
}

interface KeyItem<T> {
  [key: string]: T;
}

declare type LanguageKeys =
  | 'KEY'
  | 'CS'
  | 'DA'
  | 'DE'
  | 'EL'
  | 'EN'
  | 'ES'
  | 'FI'
  | 'FR'
  | 'HU'
  | 'IT'
  | 'NL'
  | 'PL'
  | 'RU'
  | 'SL'
  | 'SV'
  | 'TR';

type TranslateItem = {
  [keyof in LanguageKeys]: string | undefined;
};

export interface Category {
  name: TranslateItem;
  min: number;
  max: number;
  commands: Command[];
}

export interface Command {
  parameter: number;
  command: string;
  type: Type;
  description: TranslateItem;
  enum: KeyItem<TranslateItem>;
  flags: string[];
  device: Device[];
}

export interface Device {
  family: number;
  var: number;
}

export interface Type {
  name:
    | "BIT"
    | "BYTE"
    | "BYTE10"
    | "CLOSEDOPEN"
    | "DAYS"
    | "ENUM"
    | "GRADIENT_SHORT"
    | "HOURS_SHORT"
    | "LPBADDR"
    | "MINUTES_SHORT"
    | "MONTHS"
    | "ONOFF"
    | "PERCENT"
    | "PERCENT5"
    | "PRESSURE"
    | "PRESSURE50"
    | "SECONDS_SHORT"
    | "SECONDS_SHORT4"
    | "SECONDS_SHORT5"
    | "TEMP_SHORT"
    | "TEMP_SHORT_US"
    | "TEMP_SHORT5"
    | "TEMP_SHORT5_US"
    | "TEMP_SHORT64"
    | "TEMP_PER_MIN"
    | "VOLTAGE"
    | "VOLTAGEONOFF"
    | "WEEKDAY"
    | "YESNO"
    | "SPF"
    | "CURRENT"
    | "CURRENT1000"
    | "DAYS_WORD"
    | "ERRORCODE"
    | "FP1"
    | "FP02"
    | "GRADIENT"
    | "INTEGRAL"
    | "MONTHS_WORD"
    | "HOUR_MINUTES"
    | "HOURS_WORD"
    | "MINUTES_WORD"
    | "MINUTES_WORD10"
    | "PERCENT_WORD1"
    | "PERCENT_WORD"
    | "PERCENT_100"
    | "POWER_WORD"
    | "POWER_WORD100"
    | "ENERGY_WORD"
    | "ENERGY_CONTENT"
    | "PRESSURE_WORD"
    | "PRESSURE_1000"
    | "PROPVAL"
    | "SECONDS_WORD"
    | "SECONDS_WORD5"
    | "SPEED"
    | "SPEED2"
    | "TEMP"
    | "TEMP_WORD"
    | "TEMP_WORD60"
    | "TEMP_WORD5_US"
    | "VOLTAGE_WORD"
    | "CELMIN"
    | "LITERPERHOUR"
    | "LITERPERMIN"
    | "UINT"
    | "UINT5"
    | "UINT10"
    | "SINT"
    | "SINT1000"
    | "PPS_TIME"
    | "DWORD"
    | "HOURS"
    | "MINUTES"
    | "SECONDS_DWORD"
    | "POWER"
    | "POWER100"
    | "ENERGY10"
    | "ENERGY"
    | "UINT100"
    | "DATETIME"
    | "SUMMERPERIOD"
    | "VACATIONPROG"
    | "TIMEPROG"
    | "STRING"
    | "CUSTOM_ENUM"
    | "CUSTOM_BYTE"
    | "CUSTOM_BIT"
    | "GR_PER_CUBM"
    | "UNKNOWN";
  unit: TranslateItem;
  datatype:
    | "VALS"
    | "ENUM"
    | "BITS"
    | "TMPR"
    | "HHMM"
    | "DTTM"
    | "DDMM"
    | "STRN"
    | "DWHM";
  datatype_id: number;
  factor: number;
  payload_length: number;
  precision: number;
  enable_byte: number;
}

export interface CmdMap {
  [key: string]: Command[];
}
