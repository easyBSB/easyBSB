import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { i18nInitializer } from './i18n.initializer';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  exports: [ TranslateModule ],
  imports: [
    TranslateModule.forChild({
      isolate: false
    }),
    CommonModule,
  ],
})
export class I18NModule {

  static forRoot(): ModuleWithProviders<I18NModule> {
    return {
      ngModule: I18NModule,
      providers: [{
        provide: APP_INITIALIZER,
        useFactory: (i18n: TranslateService, http: HttpClient) => i18nInitializer(i18n, http), 
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