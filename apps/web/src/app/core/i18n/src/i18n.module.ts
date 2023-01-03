import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LanguageSelectorComponent } from './ui/language-selector';
import { I18NService } from './utils/i18n.service';

@NgModule({
  declarations: [
    LanguageSelectorComponent,
  ],
  exports: [
    LanguageSelectorComponent,
    TranslateModule,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule.forChild({
      isolate: false
    }),
  ],
})
export class I18NModule {

  static forRoot(): ModuleWithProviders<I18NModule> {
    return {
      ngModule: I18NModule,
      providers: [{
        provide: APP_INITIALIZER,
        useFactory: (i18n: TranslateService, http: HttpClient) => I18NService.i18nInitializer(i18n, http), 
        deps: [TranslateService, HttpClient],
        multi: true
      }],
    }
  }

  static forChild(): ModuleWithProviders<I18NModule> {
    return {
      ngModule: I18NModule
    }
  }
}
