import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, lastValueFrom, map, Observable, of, shareReplay, switchMap, zip } from "rxjs";
import { supportedLanguages } from "../constants/supported-languages";

@Injectable({
  providedIn: 'root'
})
export class I18NService {

  private lang$ = new BehaviorSubject<string>(this.translateService.getDefaultLang());

  constructor(
    private readonly translateService: TranslateService,
    private readonly httpService: HttpClient
  ) {
    this.observeLanguageChange();
  }

  public static i18nInitializer(
    i18n: TranslateService,
    http: HttpClient
  ): () => Promise<void> {
    const supportedLang = Object.keys(supportedLanguages);
    const browserLang = i18n.getBrowserLang();
    let currentLang: string = localStorage.getItem('lang') || browserLang || 'en';

    if (supportedLang.indexOf(currentLang) === -1) {
      currentLang = 'en';
    }

    i18n.addLangs(supportedLang);

    return () => {
      const lang$ = http.get(I18NService.getLanguageUrl(currentLang));
      return lastValueFrom(lang$).then((val) => {
        i18n.setTranslation(currentLang, val)
        i18n.setDefaultLang(currentLang);
      });
    }
  }

  protected static getLanguageUrl(lang: string): string {
    return `/i18n/${lang}/core.json`;
  }

  public getLanguage(): Observable<string> {
    return this.lang$
      .pipe(shareReplay(1));
  }

  public setLanguage(lang: string) {
    let doSwitch = true && this.translateService.getLangs().indexOf(lang) > -1;
    doSwitch = doSwitch && this.translateService.currentLang !== lang;

    if (doSwitch) {
      localStorage.setItem('lang', lang);
      this.translateService.use(lang);
    }
  }

  private observeLanguageChange(): void {
    this.translateService.onLangChange.pipe(
      map((changeEvent) => changeEvent.lang),
      switchMap((lang) => {
        const url = I18NService.getLanguageUrl(lang);
        return zip(this.httpService.get(url), of(lang));
      }),
      map(([translation, lang]) => {
        this.translateService.setTranslation(lang, translation);
        return lang;
      }),
    ).subscribe(this.lang$);
  }
}
