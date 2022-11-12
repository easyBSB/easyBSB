import { Component } from '@angular/core';
import { supportedLanguages } from '../constants/supported-languages';
import { I18NService } from '../utils/i18n.service';

@Component({
  selector: 'easybsb-i18n-language-selector',
  templateUrl: './language-selector.html',
  styleUrls: ['./language-selector.scss']
})
export class LanguageSelectorComponent {

  supportedLanguages = supportedLanguages;

  constructor(
    private readonly i18n: I18NService
  ) {}

  noSort(): 0 {
    return 0;
  }

  // we can check language is supported
  switchLanguage(lang: string) {
    this.i18n.setLanguage(lang);
  }
}
