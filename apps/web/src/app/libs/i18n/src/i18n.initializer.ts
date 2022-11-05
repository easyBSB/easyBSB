import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { lastValueFrom } from "rxjs";
import { supportedLanguages } from "./constants";

export function i18nInitializer(
  i18n: TranslateService,
  http: HttpClient
): () => Promise<void> {
  const currentLang = navigator.language.replace(/^([a-z]{2})(-.*)?$/, '$1')
  let language = localStorage.getItem('lang') || currentLang;

  if (supportedLanguages.indexOf(language) > -1) {
    language = 'en';
  }

  const languageUrl = `/i18n/${language}/core.json`;
  const lang$ = http.get(languageUrl)

  return () => {
    return lastValueFrom(lang$).then((val) => {
      i18n.setTranslation(currentLang, val)
      i18n.use(currentLang);
    });
  }
}
