import { TranslateItem } from "./interfaces";

export class Helper {
    public static getLanguage(langRessource: TranslateItem | null | undefined, language = "KEY"): string | null {

        if (!langRessource)
            return null;

        const lookup = langRessource;

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
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('').toUpperCase();
    }
}
