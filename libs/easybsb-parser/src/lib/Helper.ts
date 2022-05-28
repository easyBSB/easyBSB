import { TranslateItem } from "./interfaces";

export class Helper {
  public static getLanguage(
    langResource: TranslateItem | null | undefined,
    language = "KEY"
  ): string | null {
    if (!langResource) return null;

    const lookup = langResource;

    if (Object.prototype.hasOwnProperty.call(lookup, language)) {
      return lookup[language];
    }

    if (Object.prototype.hasOwnProperty.call(lookup, "EN")) {
      return lookup[language];
    }

    if (Object.prototype.hasOwnProperty.call(lookup, "DE")) {
      return lookup[language];
    }

    if (Object.prototype.hasOwnProperty.call(lookup, "KEY")) {
      return lookup[language];
    }

    return null;
  }

  public static toHexString(byteArray: number[]): string {
    return Array.from(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
      .join("")
      .toUpperCase();
  }
}
